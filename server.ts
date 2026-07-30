import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { GitHubProfile } from './src/types';

// In-Memory Active Admin Sessions Map token -> { email: string, expiresAt: number }
const activeAdminSessions = new Map<string, { email: string; expiresAt: number }>();

// Simple In-Memory Rate Limiter to prevent DoS, DDoS & brute force
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const key = `${clientIp}:${req.path}`;
    const now = Date.now();
    let record = rateLimitMap.get(key);

    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
      rateLimitMap.set(key, record);
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    record.count += 1;
    next();
  };
}

// XSS Sanitization Helper to strip dangerous HTML tags
function sanitizeInput(val: any): any {
  if (typeof val === 'string') {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeInput);
  }
  if (typeof val === 'object' && val !== null) {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      cleaned[key] = sanitizeInput(val[key]);
    }
    return cleaned;
  }
  return val;
}

// Middleware to verify Admin Authorization Token
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeAdminSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeAdminSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized. Session expired or invalid.' });
  }

  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Strict Payload Size & JSON Parsing
  app.use(express.json({ limit: '100kb' }));

  // 2. HTTP Security Headers (XSS, Clickjacking, MIME sniffing, Referrer)
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // 3. Global Rate Limiting (120 requests per minute per IP)
  app.use('/api', rateLimiter(120, 60 * 1000));

  // 4. Strict Rate Limiting on sensitive endpoints (15 requests per 3 minutes)
  const strictRateLimit = rateLimiter(15, 3 * 60 * 1000);
  app.use('/api/admin/login', strictRateLimit);
  app.use('/api/posts/secret', strictRateLimit);
  app.use('/api/applications/secret', strictRateLimit);

  // Cached GitHub profile for sudostealth
  let cachedGitHubProfile: GitHubProfile | null = null;
  let lastFetchTime = 0;

  // --- API ROUTES ---

  // 1. GitHub Profile fetch for footer credit (sudostealth)
  app.get('/api/github-profile', async (req, res) => {
    const now = Date.now();
    if (cachedGitHubProfile && now - lastFetchTime < 3600000) { // 1 hr cache
      return res.json(cachedGitHubProfile);
    }

    try {
      const response = await fetch('https://api.github.com/users/sudostealth', {
        headers: {
          'User-Agent': 'FreeTuitionMediaApp'
        }
      });
      if (response.ok) {
        const data = await response.json();
        cachedGitHubProfile = {
          username: data.login || 'sudostealth',
          name: data.name || 'SudoStealth',
          avatarUrl: data.avatar_url || 'https://github.com/sudostealth.png',
          bio: data.bio || 'Full-Stack Developer & Open Source Contributor',
          htmlUrl: data.html_url || 'https://github.com/sudostealth',
          publicRepos: data.public_repos || 0,
          location: data.location || 'Bangladesh'
        };
        lastFetchTime = now;
        return res.json(cachedGitHubProfile);
      }
    } catch (err) {
      console.warn('Could not fetch GitHub profile for sudostealth, using default fallback:', err);
    }

    // Fallback if API fails or rate limited
    const fallback: GitHubProfile = {
      username: 'sudostealth',
      name: 'SudoStealth',
      avatarUrl: 'https://github.com/sudostealth.png',
      bio: 'Full-Stack Developer & Software Architect from Bangladesh',
      htmlUrl: 'https://github.com/sudostealth',
      publicRepos: 18,
      location: 'Dhaka, Bangladesh'
    };
    res.json(fallback);
  });

  // 2. Taxonomy API
  app.get('/api/taxonomy', async (req, res) => {
    try {
      const taxonomy = await db.getTaxonomy();
      res.json(taxonomy);
    } catch (err: any) {
      console.error('Taxonomy Error:', err);
      res.status(500).json({ error: 'Failed to retrieve taxonomy data.' });
    }
  });

  // Add custom taxonomy option (for custom subjects, locations, institutions)
  app.post('/api/taxonomy/add', async (req, res) => {
    const { type, key, value } = sanitizeInput(req.body);
    if (!type || !value) {
      return res.status(400).json({ error: 'Missing type or value' });
    }
    try {
      const updated = await db.addCustomTaxonomy(type, { key, value });
      res.json({ success: true, taxonomy: updated });
    } catch (err: any) {
      console.error('Taxonomy Add Error:', err);
      res.status(500).json({ error: 'Failed to add custom dropdown option.' });
    }
  });

  // 3. Public Posts Feed (Data Leakage Protection: Strip parent phone & secret codes for public list)
  app.get('/api/posts', async (req, res) => {
    try {
      const {
        division,
        district,
        thana,
        medium,
        studentClass,
        subject,
        gender,
        tuitionType,
        minSalary,
        maxSalary,
        search
      } = req.query;

      let posts = await db.getAllPosts(true); // Live posts only

      if (division && division !== 'all') {
        posts = posts.filter(p => p.division.toLowerCase() === (division as string).toLowerCase());
      }
      if (district && district !== 'all') {
        posts = posts.filter(p => p.district.toLowerCase() === (district as string).toLowerCase());
      }
      if (thana && thana !== 'all') {
        posts = posts.filter(p => p.thana.toLowerCase() === (thana as string).toLowerCase());
      }
      if (medium && medium !== 'all') {
        posts = posts.filter(p => p.medium.toLowerCase() === (medium as string).toLowerCase());
      }
      if (studentClass && studentClass !== 'all') {
        posts = posts.filter(p => p.studentClass.toLowerCase() === (studentClass as string).toLowerCase());
      }
      if (gender && gender !== 'all') {
        posts = posts.filter(p => p.tutorGenderPref.toLowerCase() === (gender as string).toLowerCase() || p.tutorGenderPref === 'Any');
      }
      if (tuitionType && tuitionType !== 'all') {
        posts = posts.filter(p => p.tuitionType.toLowerCase() === (tuitionType as string).toLowerCase());
      }
      if (minSalary) {
        const min = parseInt(minSalary as string, 10);
        if (!isNaN(min)) posts = posts.filter(p => p.salary >= min);
      }
      if (maxSalary) {
        const max = parseInt(maxSalary as string, 10);
        if (!isNaN(max)) posts = posts.filter(p => p.salary <= max);
      }
      if (search) {
        const q = (search as string).toLowerCase();
        posts = posts.filter(p => 
          p.subjects.some(s => s.toLowerCase().includes(q)) ||
          p.thana.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.studentClass.toLowerCase().includes(q) ||
          p.medium.toLowerCase().includes(q) ||
          (p.specialNote && p.specialNote.toLowerCase().includes(q))
        );
      }

      // Sanitized Public Feed: Remove private phone numbers and secret codes
      const sanitizedPosts = posts.map(p => ({
        ...p,
        parentPhone: '017********', // Masked for privacy on public feed
        secretCode: '' // Omitted for public list
      }));

      res.json(sanitizedPosts);
    } catch (err: any) {
      console.error('Fetch posts error:', err);
      res.status(500).json({ error: 'Failed to fetch tuition posts.' });
    }
  });

  // 4. Create Parent Tuition Request
  app.post('/api/posts', async (req, res) => {
    try {
      const sanitizedBody = sanitizeInput(req.body);
      const {
        parentName,
        parentPhone,
        isWhatsapp,
        division,
        district,
        thana,
        address,
        coords,
        tuitionType,
        medium,
        studentClass,
        subjects,
        daysPerWeek,
        preferredDays,
        tutorGenderPref,
        salary,
        specialNote
      } = sanitizedBody;

      if (!parentName || !parentPhone || !division || !district || !thana || !medium || !studentClass || !subjects || !salary) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
      }

      const post = await db.createPost({
        parentName,
        parentPhone,
        isWhatsapp: Boolean(isWhatsapp),
        division,
        district,
        thana,
        address: address || '',
        coords: coords || { lat: 23.8103, lng: 90.4125 },
        tuitionType: tuitionType || 'Offline',
        medium,
        studentClass,
        subjects: Array.isArray(subjects) ? subjects : [subjects],
        daysPerWeek: parseInt(daysPerWeek, 10) || 3,
        preferredDays: preferredDays || [],
        tutorGenderPref: tutorGenderPref || 'Any',
        salary: parseInt(salary, 10) || 5000,
        specialNote: specialNote || ''
      });

      res.status(201).json({ success: true, post });
    } catch (err: any) {
      console.error('Create post error:', err);
      res.status(500).json({ error: 'Failed to create tuition post.' });
    }
  });

  // 5. Check Parent Post by Secret Code
  app.post('/api/posts/secret', async (req, res) => {
    try {
      const { secretCode } = sanitizeInput(req.body);
      if (!secretCode) return res.status(400).json({ error: 'Secret code is required' });

      const post = await db.getPostBySecretCode(secretCode);
      if (!post) {
        return res.status(404).json({ error: 'Post not found for this secret code' });
      }
      res.json(post);
    } catch (err: any) {
      console.error('Check secret post error:', err);
      res.status(500).json({ error: 'Failed to retrieve post details.' });
    }
  });

  // 6. Edit Parent Post by Secret Code
  app.put('/api/posts/secret', async (req, res) => {
    try {
      const { secretCode, updates } = sanitizeInput(req.body);
      if (!secretCode || !updates) {
        return res.status(400).json({ error: 'Secret code and updates are required' });
      }
      const updated = await db.updatePostBySecretCode(secretCode, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ success: true, post: updated });
    } catch (err: any) {
      console.error('Update post error:', err);
      res.status(500).json({ error: 'Failed to update tuition post.' });
    }
  });

  // 7. Get Tutor Applicants for a Parent Post (requires Parent Secret Code)
  app.post('/api/posts/secret/applications', async (req, res) => {
    try {
      const { secretCode } = sanitizeInput(req.body);
      if (!secretCode) return res.status(400).json({ error: 'Secret code is required' });

      const post = await db.getPostBySecretCode(secretCode);
      if (!post) {
        return res.status(404).json({ error: 'Post not found for this secret code' });
      }

      const applications = await db.getApplicationsByPostId(post.id);
      res.json({ post, applications });
    } catch (err: any) {
      console.error('Get applications error:', err);
      res.status(500).json({ error: 'Failed to fetch applicants.' });
    }
  });

  // 8. Accept Tutor Application (Parent action)
  app.post('/api/posts/secret/accept', async (req, res) => {
    try {
      const { secretCode, applicationId } = sanitizeInput(req.body);
      if (!secretCode || !applicationId) {
        return res.status(400).json({ error: 'Secret code and applicationId required' });
      }
      const post = await db.getPostBySecretCode(secretCode);
      if (!post) return res.status(404).json({ error: 'Invalid secret code' });

      const result = await db.acceptApplication(post.id, applicationId);
      res.json(result);
    } catch (err: any) {
      console.error('Accept application error:', err);
      res.status(500).json({ error: 'Failed to accept application.' });
    }
  });

  // 9. Cancel Tutor Acceptance (Parent action)
  app.post('/api/posts/secret/cancel-accept', async (req, res) => {
    try {
      const { secretCode, applicationId } = sanitizeInput(req.body);
      if (!secretCode || !applicationId) {
        return res.status(400).json({ error: 'Secret code and applicationId required' });
      }
      const post = await db.getPostBySecretCode(secretCode);
      if (!post) return res.status(404).json({ error: 'Invalid secret code' });

      const success = await db.cancelApplicationAcceptance(post.id, applicationId);
      res.json({ success });
    } catch (err: any) {
      console.error('Cancel accept error:', err);
      res.status(500).json({ error: 'Failed to cancel application acceptance.' });
    }
  });

  // 9b. Directly Reject Tutor Application (Parent action)
  app.post('/api/posts/secret/reject', async (req, res) => {
    try {
      const { secretCode, applicationId } = sanitizeInput(req.body);
      if (!secretCode || !applicationId) {
        return res.status(400).json({ error: 'Secret code and applicationId required' });
      }
      const post = await db.getPostBySecretCode(secretCode);
      if (!post) return res.status(404).json({ error: 'Invalid secret code' });

      const success = await db.rejectApplication(post.id, applicationId);
      res.json({ success });
    } catch (err: any) {
      console.error('Reject app error:', err);
      res.status(500).json({ error: 'Failed to reject application.' });
    }
  });

  // 10. Confirm & Finalize Tuition (Parent action -> deletes post from site)
  app.post('/api/posts/secret/confirm', async (req, res) => {
    try {
      const { secretCode, applicationId } = sanitizeInput(req.body);
      if (!secretCode || !applicationId) {
        return res.status(400).json({ error: 'Secret code and applicationId required' });
      }
      const post = await db.getPostBySecretCode(secretCode);
      if (!post) return res.status(404).json({ error: 'Invalid secret code' });

      const success = await db.confirmTuitionFinal(post.id, applicationId);
      res.json({ success });
    } catch (err: any) {
      console.error('Confirm final tuition error:', err);
      res.status(500).json({ error: 'Failed to confirm tuition.' });
    }
  });

  // 11. Tutor Apply to Post
  app.post('/api/applications', async (req, res) => {
    try {
      const sanitizedBody = sanitizeInput(req.body);
      const {
        postId,
        tutorName,
        tutorPhone,
        isWhatsapp,
        studyStatus,
        studyLevel,
        institution,
        department,
        completedDegree,
        experience
      } = sanitizedBody;

      if (!postId || !tutorName || !tutorPhone || !studyStatus || !experience) {
        return res.status(400).json({ error: 'Please complete all required fields.' });
      }

      const post = await db.getPostById(postId);
      if (!post) return res.status(404).json({ error: 'Tuition post no longer exists.' });

      const appData = await db.createApplication({
        postId,
        tutorName,
        tutorPhone,
        isWhatsapp: Boolean(isWhatsapp),
        studyStatus,
        studyLevel: studyLevel || '',
        institution: institution || '',
        department: department || '',
        completedDegree: completedDegree || '',
        experience
      });

      res.status(201).json({ success: true, application: appData });
    } catch (err: any) {
      console.error('Submit application error:', err);
      res.status(500).json({ error: 'Failed to submit application.' });
    }
  });

  // 12. Tutor Check Application Status by Secret Code
  app.post('/api/applications/secret', async (req, res) => {
    try {
      const { secretCode } = sanitizeInput(req.body);
      if (!secretCode) return res.status(400).json({ error: 'Secret code is required' });

      const application = await db.getApplicationBySecretCode(secretCode);
      if (!application) {
        return res.status(404).json({ error: 'Application not found for this secret code' });
      }

      // Determine 5-hour countdown timer status if status is 'accepted'
      let hoursRemaining = 5;
      let timerExpired = false;
      let showParentContact = false;

      if (application.status === 'accepted') {
        if (!application.acceptedAt) {
          application.acceptedAt = application.createdAt || new Date().toISOString();
        }
        const acceptedTimestamp = new Date(application.acceptedAt).getTime();
        const fiveHoursMs = 5 * 60 * 60 * 1000;
        const elapsedMs = Date.now() - acceptedTimestamp;

        if (elapsedMs >= fiveHoursMs) {
          timerExpired = true;
          showParentContact = true;
          hoursRemaining = 0;
        } else {
          const remainingMs = fiveHoursMs - elapsedMs;
          hoursRemaining = Math.max(0, remainingMs / (1000 * 60 * 60));
        }
      } else if (application.status === 'confirmed') {
        showParentContact = false;
      }

      res.json({
        application,
        hoursRemaining,
        timerExpired,
        showParentContact
      });
    } catch (err: any) {
      console.error('Get application by secret error:', err);
      res.status(500).json({ error: 'Failed to retrieve application status.' });
    }
  });

  // 13. Site Stats API
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await db.getSiteStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Get stats error:', err);
      res.status(500).json({ error: 'Failed to retrieve site statistics.' });
    }
  });

  // 14. Admin Endpoints

  // Admin Login with Email + Password & Supabase Auth Verification
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = sanitizeInput(req.body);

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      // Enforce configured Admin Email verification
      const configAdminEmail = (process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || 'admin@tutoria.bd').trim().toLowerCase();
      const providedEmail = email.trim().toLowerCase();

      if (providedEmail !== configAdminEmail) {
        return res.status(401).json({ error: 'Unauthorized login attempt. Admin email does not match system configuration.' });
      }

      const supabase = db.getSupabase();
      if (supabase) {
        // Authenticate user with Supabase Auth Engine
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: providedEmail,
          password
        });

        if (authError || !authData.user) {
          return res.status(401).json({
            error: authError ? authError.message : 'Invalid Supabase admin credentials.'
          });
        }
      } else {
        // Fallback for local environment before Supabase keys are configured
        if (!db.verifyAdminPassword(password)) {
          return res.status(401).json({ error: 'Invalid admin password.' });
        }
      }

      // Issue cryptographically secure session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      activeAdminSessions.set(sessionToken, { email: providedEmail, expiresAt });

      res.json({
        success: true,
        token: sessionToken,
        email: providedEmail,
        expiresAt
      });
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      res.status(500).json({ error: 'Admin login failed due to a server error.' });
    }
  });

  // Protected: Pending Posts list for Admin
  app.get('/api/admin/pending-posts', requireAdminAuth, async (req, res) => {
    try {
      const posts = await db.getPendingPosts();
      res.json(posts);
    } catch (err: any) {
      console.error('Admin pending posts error:', err);
      res.status(500).json({ error: 'Failed to fetch pending posts.' });
    }
  });

  // Protected: Approve post
  app.post('/api/admin/approve-post', requireAdminAuth, async (req, res) => {
    try {
      const { id } = sanitizeInput(req.body);
      const success = await db.approvePost(id);
      res.json({ success });
    } catch (err: any) {
      console.error('Admin approve post error:', err);
      res.status(500).json({ error: 'Failed to approve post.' });
    }
  });

  // Protected: Reject post
  app.post('/api/admin/reject-post', requireAdminAuth, async (req, res) => {
    try {
      const { id } = sanitizeInput(req.body);
      const success = await db.rejectPost(id);
      res.json({ success });
    } catch (err: any) {
      console.error('Admin reject post error:', err);
      res.status(500).json({ error: 'Failed to reject post.' });
    }
  });

  // Protected: Recover secret code
  app.post('/api/admin/recover-code', requireAdminAuth, async (req, res) => {
    try {
      const { query, type } = sanitizeInput(req.body);
      const result = await db.recoverSecretCode(query, type);
      res.json(result);
    } catch (err: any) {
      console.error('Admin recover code error:', err);
      res.status(500).json({ error: 'Failed to recover secret code.' });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Free Tuition Media server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
