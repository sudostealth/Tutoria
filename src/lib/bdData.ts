import { TaxonomyData } from '../types.js';

export const initialTaxonomy: TaxonomyData = {
  divisions: [
    'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 
    'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ],
  districts: {
    // Dhaka Division
    'Dhaka': ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],

    // Chattogram Division
    'Chattogram': ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
    'Chittagong': ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', "Cox's Bazar", 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],

    // Rajshahi Division
    'Rajshahi': ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],

    // Khulna Division
    'Khulna': ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],

    // Barishal Division
    'Barishal': ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
    'Barisal': ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],

    // Sylhet Division
    'Sylhet': ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],

    // Rangpur Division
    'Rangpur': ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],

    // Mymensingh Division
    'Mymensingh': ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur']
  },
  thanas: {
    // --- DHAKA DIVISION ---
    'Dhaka': ['Dhanmondi', 'Mirpur', 'Uttara', 'Gulshan', 'Banani', 'Mohammadpur', 'Badda', 'Khilgaon', 'Rampura', 'Motijheel', 'Old Dhaka', 'Bashundhara R/A', 'Farmgate', 'Lalmatia', 'Tejgaon', 'Jatrabari', 'Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'],
    'Faridpur': ['Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Faridpur Sadar', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
    'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur', 'Tongi'],
    'Gopalganj': ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
    'Kishoreganj': ['Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kishoreganj Sadar', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail'],
    'Madaripur': ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar', 'Dasar'],
    'Manikganj': ['Daulatpur', 'Ghior', 'Harirampur', 'Manikganj Sadar', 'Saturia', 'Shivalaya', 'Singair'],
    'Munshiganj': ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
    'Narayanganj': ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon', 'Siddhirganj', 'Fatullah'],
    'Narsingdi': ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
    'Rajbari': ['Baliakandi', 'Goalandaghat', 'Pangsha', 'Kalukhali', 'Rajbari Sadar'],
    'Shariatpur': ['Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Shariatpur Sadar', 'Zajira'],
    'Tangail': ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar'],

    // --- CHATTOGRAM DIVISION ---
    'Bandarban': ['Bandarban Sadar', 'Alikadam', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'],
    'Brahmanbaria': ['Akhaura', 'Bancharampur', 'Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail', 'Bijoynagar', 'Ashuganj'],
    'Chandpur': ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
    'Chattogram': ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda', 'Panchlaish', 'Double Mooring', 'Halishahar', 'Kotwali', 'Khulshi', 'Agrabad', 'Chawkbazar', 'GEC', 'Nasirabad'],
    'Chittagong': ['Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda', 'Panchlaish', 'Double Mooring', 'Halishahar', 'Kotwali', 'Khulshi', 'Agrabad', 'Chawkbazar', 'GEC', 'Nasirabad'],
    'Cumilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Cumilla Sadar', 'Cumilla Sadar Dakshin', 'Laksam', 'Monohorganj', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
    'Comilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Cumilla Sadar', 'Cumilla Sadar Dakshin', 'Laksam', 'Monohorganj', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
    "Cox's Bazar": ['Chakaria', "Cox's Bazar Sadar", 'Kutubdia', 'Maheshkhali', 'Pekua', 'Ramu', 'Teknaf', 'Ukhia'],
    'Feni': ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Fulgazi', 'Parshuram', 'Sonagazi'],
    'Khagrachari': ['Dighinala', 'Khagrachari Sadar', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'],
    'Khagrachhari': ['Dighinala', 'Khagrachari Sadar', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'],
    'Lakshmipur': ['Kamalnagar', 'Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati'],
    'Noakhali': ['Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Noakhali Sadar', 'Senbagh', 'Sonaimuri', 'Subarnachar', 'Kabirhat'],
    'Rangamati': ['Baghaichhari', 'Barkal', 'Kaptai', 'Juraichhari', 'Langadu', 'Nannerchar', 'Rajasthali', 'Rangamati Sadar', 'Belaichhari'],

    // --- RAJSHAHI DIVISION ---
    'Bogura': ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatola'],
    'Bogra': ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatola'],
    'Joypurhat': ['Akkelpur', 'Joypurhat Sadar', 'Kalai', 'Khetlal', 'Panchbibi'],
    'Naogaon': ['Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mahadebpur', 'Naogaon Sadar', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'],
    'Natore': ['Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Natore Sadar', 'Singra'],
    'Chapainawabganj': ['Bholahat', 'Gomastapur', 'Nachole', 'Chapainawabganj Sadar', 'Shibganj'],
    'Chapai Nawabganj': ['Bholahat', 'Gomastapur', 'Nachole', 'Chapainawabganj Sadar', 'Shibganj'],
    'Pabna': ['Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Pabna Sadar', 'Santhia', 'Sujanagar'],
    'Rajshahi': ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore', 'Boalia', 'Rajpara', 'Motihar', 'Chandrima', 'Shah Mokdum'],
    'Sirajganj': ['Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Sirajganj Sadar', 'Tarash', 'Ullapara'],

    // --- KHULNA DIVISION ---
    'Bagerhat': ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'],
    'Chuadanga': ['Alamdanga', 'Chuadanga Sadar', 'Damurhuda', 'Jibannagar'],
    'Jashore': ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
    'Jessore': ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
    'Jhenaidah': ['Harinakunda', 'Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'],
    'Khulna': ['Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada', 'Khulna Sadar', 'Sonadanga', 'Boyra', 'Khalishpur', 'Daulatpur'],
    'Kushtia': ['Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Kushtia Sadar', 'Mirpur'],
    'Magura': ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'],
    'Meherpur': ['Gangni', 'Meherpur Sadar', 'Mujibnagar'],
    'Narail': ['Kalia', 'Lohagara', 'Narail Sadar'],
    'Satkhira': ['Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Satkhira Sadar', 'Shyamnagar', 'Tala'],

    // --- BARISHAL DIVISION ---
    'Barguna': ['Amtali', 'Bamna', 'Barguna Sadar', 'Betagi', 'Patharghata', 'Taltali'],
    'Barishal': ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Barishal Sadar', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
    'Barisal': ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Barishal Sadar', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
    'Bhola': ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
    'Jhalokati': ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
    'Patuakhali': ['Bauphal', 'Dashmina', 'Dumki', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Patuakhali Sadar', 'Rangabali'],
    'Pirojpur': ['Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad (Swarupkathi)', 'Pirojpur Sadar', 'Zianagar'],

    // --- SYLHET DIVISION ---
    'Habiganj': ['Ajmiriganj', 'Bahubal', 'Baniachong', 'Chunarughat', 'Habiganj Sadar', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Sayestaganj'],
    'Moulvibazar': ['Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Moulvibazar Sadar', 'Rajnagar', 'Sreemangal'],
    'Sunamganj': ['Bishwamvarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sullah', 'Sunamganj Sadar', 'Tahirpur', 'South Sunamganj'],
    'Sylhet': ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Dakshin Surma', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Sylhet Sadar', 'Zakiganj', 'Zindabazar', 'Ambarkhana', 'Tilagarh', 'Akhalia']
  },
  mediums: ['Bangla', 'English', 'English Version', 'Madrasa'],
  classesByMedium: {
    'Bangla': ['Play', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10 (SSC)', 'Class 11 (HSC 1st)', 'Class 12 (HSC 2nd)', 'University Admission', 'Degree / Honours'],
    'English Version': ['Play', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10 (SSC)', 'Class 11 (HSC 1st)', 'Class 12 (HSC 2nd)', 'Admission Prep'],
    'English': ['Play', 'Nursery', 'KG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'O Level (IGCSE)', 'A Level (IAS/IAL)', 'IELTS / SAT'],
    'Madrasa': ['Ebtedayee 1', 'Ebtedayee 2', 'Ebtedayee 3', 'Ebtedayee 4', 'Ebtedayee 5', 'Dakhil 6', 'Dakhil 7', 'Dakhil 8', 'Dakhil 9', 'Dakhil 10 (SSC)', 'Alim 11', 'Alim 12 (HSC)', 'Fazil / Kamil']
  },
  subjectsByMediumAndClass: {
    'general': ['Bangla', 'English', 'General Math', 'Higher Math', 'Physics', 'Chemistry', 'Biology', 'ICT / Computer', 'General Science', 'Accounting', 'Finance', 'Economics', 'Business Studies', 'Geography', 'History', 'Islam / Religion', 'Drawing', 'Spoken English']
  },
  institutions: [
    'University of Dhaka',
    'University of Rajshahi',
    'University of Chittagong',
    'Jahangirnagar University',
    'Islamic University, Bangladesh',
    'Shahjalal University of Science and Technology',
    'Khulna University',
    'Jagannath University',
    'Comilla University',
    'Begum Rokeya University',
    'Barisal University',
    'Jatiya Kabi Kazi Nazrul Islam University',
    'Rabindra University, Bangladesh',
    'Sheikh Hasina University',
    'Bangamata Sheikh Fojilatunnesa Mujib Science & Technology University',
    'National University',
    'Bangladesh Open University',
    'Islamic Arabic University',
    'Bangladesh University of Engineering and Technology (BUET)',
    'Rajshahi University of Engineering & Technology (RUET)',
    'Khulna University of Engineering & Technology (KUET)',
    'Chittagong University of Engineering & Technology (CUET)',
    'Dhaka University of Engineering & Technology (DUET)',
    'Hajee Mohammad Danesh Science & Technology University',
    'Mawlana Bhashani Science & Technology University',
    'Noakhali Science and Technology University',
    'Pabna University of Science and Technology',
    'Jashore University of Science and Technology',
    'Patuakhali Science and Technology University',
    'Bangladesh University of Textiles (BUTEX)',
    'Bangladesh Army University of Science and Technology (BAUST)',
    'Bangladesh Army University of Engineering & Technology (BAUET)',
    'Military Institute of Science and Technology (MIST)',
    'Rangamati Science and Technology University',
    'Bangabandhu Sheikh Mujibur Rahman Science & Technology University',
    'Bangabandhu Sheikh Mujibur Rahman Digital University',
    'Bangladesh Agricultural University',
    'Bangabandhu Sheikh Mujibur Rahman Agricultural University',
    'Sher-e-Bangla Agricultural University',
    'Sylhet Agricultural University',
    'Chittagong Veterinary and Animal Sciences University',
    'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
    'Bangladesh University of Professionals (BUP)',
    'Dhaka College',
    'Dhaka Government Muslim High School',
    'Government Laboratory High School',
    'Rajuk Uttara Model College',
    'Adamjee Cantonment College',
    'Notre Dame College',
    'Holy Cross College',
    'Viqarunnisa Noon School and College',
    'Ideal School and College, Motijheel',
    'Scholastica',
    'South Breeze School',
    'Mastermind School',
    'Sunbeams School',
    'Chittagong College',
    'Chittagong Collegiate School',
    'Government Commerce College',
    'Chittagong Grammar School',
    'International Islamic University Chittagong School and College',
    'Rajshahi College',
    'Rajshahi Collegiate School',
    'Rajshahi Government City College',
    'Khulna Zilla School',
    'Brajalal College (BL College)',
    'Barisal Zilla School',
    'Brojomohon College (BM College)',
    'Sylhet Government Pilot High School',
    'Murari Chand College (MC College)',
    'Rangpur Zilla School',
    'Carmichael College',
    'Mymensingh Zilla School',
    'Ananda Mohan College'
  ],
  departments: [
    'Computer Science & Engineering (CSE)',
    'Electrical & Electronic Engineering (EEE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Medicine & Surgery (MBBS)',
    'Dental Surgery (BDS)',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biochemistry & Molecular Biology',
    'English Literature',
    'Bangla Literature',
    'Economics',
    'Finance & Banking',
    'Accounting & Information Systems',
    'Marketing',
    'Management',
    'International Relations',
    'Law (LL.B)',
    'Pharmacy',
    'Microbiology',
    'Genetics & Biotechnology',
    'Islamic Studies',
    'Arabic & Quranic Sciences'
  ]
};

// --- HELPER FUNCTIONS FOR GEOGRAPHIC TAXONOMY ---
export function getDistrictsForDivision(division: string, taxonomy?: TaxonomyData | null): string[] {
  const taxDistricts = taxonomy?.districts || initialTaxonomy.districts;
  let divKey = division;

  if (taxDistricts[divKey] && taxDistricts[divKey].length > 0) {
    return taxDistricts[divKey];
  }

  // Alias fallbacks
  if (divKey === 'Chittagong' && taxDistricts['Chattogram']) return taxDistricts['Chattogram'];
  if (divKey === 'Chattogram' && taxDistricts['Chittagong']) return taxDistricts['Chittagong'];
  if (divKey === 'Barisal' && taxDistricts['Barishal']) return taxDistricts['Barishal'];
  if (divKey === 'Barishal' && taxDistricts['Barisal']) return taxDistricts['Barisal'];

  return taxDistricts['Dhaka'] || ['Dhaka', 'Gazipur', 'Narayanganj'];
}

export function getThanasForDistrict(district: string, taxonomy?: TaxonomyData | null): string[] {
  const taxThanas = taxonomy?.thanas || initialTaxonomy.thanas;
  let distKey = district;

  if (taxThanas[distKey] && taxThanas[distKey].length > 0) {
    return taxThanas[distKey];
  }

  // Alias fallbacks
  if (distKey === 'Cumilla' && taxThanas['Comilla']) return taxThanas['Comilla'];
  if (distKey === 'Comilla' && taxThanas['Cumilla']) return taxThanas['Cumilla'];
  if (distKey === 'Bogura' && taxThanas['Bogra']) return taxThanas['Bogra'];
  if (distKey === 'Bogra' && taxThanas['Bogura']) return taxThanas['Bogura'];
  if (distKey === 'Jashore' && taxThanas['Jessore']) return taxThanas['Jessore'];
  if (distKey === 'Jessore' && taxThanas['Jashore']) return taxThanas['Jashore'];
  if (distKey === 'Chapainawabganj' && taxThanas['Chapai Nawabganj']) return taxThanas['Chapai Nawabganj'];
  if (distKey === 'Chapai Nawabganj' && taxThanas['Chapainawabganj']) return taxThanas['Chapainawabganj'];
  if (distKey === 'Khagrachari' && taxThanas['Khagrachhari']) return taxThanas['Khagrachhari'];
  if (distKey === 'Khagrachhari' && taxThanas['Khagrachari']) return taxThanas['Khagrachari'];

  return [`${district} Sadar`, `${district} Town`, 'Other Area'];
}

export function getAllThanasInDivision(division: string, taxonomy?: TaxonomyData | null): string[] {
  const dists = getDistrictsForDivision(division, taxonomy);
  const set = new Set<string>();
  dists.forEach(dist => {
    getThanasForDistrict(dist, taxonomy).forEach(t => set.add(t));
  });
  return Array.from(set);
}

// --- HELPER FUNCTION FOR MEDIUM + CLASS SUBJECT TAXONOMY ---
export function getSubjectsForMediumAndClass(
  medium: string,
  studentClass: string,
  taxonomy?: TaxonomyData | null
): string[] {
  const key = `${medium}__${studentClass}`;
  const customList = (taxonomy?.subjectsByMediumAndClass && taxonomy.subjectsByMediumAndClass[key]) || [];

  const cls = (studentClass || '').toLowerCase();
  const med = (medium || '').toLowerCase();

  let defaults: string[] = [];

  // English Medium (O Level / A Level / SAT / IELTS)
  if (med.includes('english') && !med.includes('version')) {
    if (cls.includes('o level') || cls.includes('igcse')) {
      defaults = [
        'Mathematics B (Pure)', 'Further Pure Mathematics', 'Physics', 'Chemistry', 
        'Biology', 'Computer Science', 'ICT', 'Accounting', 'Economics', 
        'Business Studies', 'English Language', 'English Literature', 'Bangla'
      ];
    } else if (cls.includes('a level') || cls.includes('ias') || cls.includes('ial')) {
      defaults = [
        'Pure Mathematics (P1-P4)', 'Mechanics (M1-M2)', 'Statistics (S1-S2)', 
        'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 
        'Accounting', 'Business Studies', 'Law', 'Psychology'
      ];
    } else if (cls.includes('sat') || cls.includes('ielts')) {
      defaults = ['Reading & Writing', 'SAT Math', 'IELTS Listening', 'IELTS Speaking', 'IELTS Reading', 'IELTS Writing'];
    }
  }

  // Madrasa Medium
  if (defaults.length === 0 && med.includes('madrasa')) {
    if (cls.includes('ebtedayee')) {
      defaults = ['Quran Mazid', 'Ebtedayee Bangla', 'Ebtedayee English', 'Mathematics', 'General Science', 'Arabic'];
    } else if (cls.includes('dakhil')) {
      defaults = [
        'Quran Mazid & Tajweed', 'Hadith Sharif', 'Fiqh & Usul-ul-Fiqh', 'Arabic 1st Paper', 'Arabic 2nd Paper',
        'General Mathematics', 'Higher Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT', 'Bangla', 'English'
      ];
    } else if (cls.includes('alim') || cls.includes('fazil')) {
      defaults = [
        'Quran Mazid', 'Hadith Sharif', 'Fiqh', 'Usul-ul-Fiqh', 'Balagat & Mantiq', 'Arabic Literature',
        'Physics', 'Chemistry', 'Higher Math', 'Biology', 'ICT', 'English'
      ];
    }
  }

  // Primary (Play, Nursery, KG, Class 1-5, Grade 1-5)
  if (
    defaults.length === 0 &&
    (cls.includes('play') || cls.includes('nursery') || cls.includes('kg') ||
    cls.includes('class 1') || cls.includes('class 2') || cls.includes('class 3') || 
    cls.includes('class 4') || cls.includes('class 5') || cls.includes('grade 1') || 
    cls.includes('grade 2') || cls.includes('grade 3') || cls.includes('grade 4') || cls.includes('grade 5'))
  ) {
    defaults = [
      'All Subjects (General)', 'Bangla', 'English', 'Mathematics', 
      'Elementary Science', 'Bangladesh & Global Studies', 'Religion & Moral Education', 
      'Drawing & Art', 'Spoken English', 'Handwriting'
    ];
  }

  // Junior Secondary (Class 6-8, Grade 6-8)
  if (
    defaults.length === 0 &&
    (cls.includes('class 6') || cls.includes('class 7') || cls.includes('class 8') ||
    cls.includes('grade 6') || cls.includes('grade 7') || cls.includes('grade 8'))
  ) {
    defaults = [
      'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 
      'General Mathematics', 'General Science', 'ICT / Computer Science', 
      'Bangladesh & Global Studies', 'Islam & Moral Education', 'Hindu Religion Education'
    ];
  }

  // Secondary (Class 9-10 / SSC)
  if (defaults.length === 0 && (cls.includes('class 9') || cls.includes('class 10') || cls.includes('ssc'))) {
    defaults = [
      'General Mathematics', 'Higher Mathematics', 'Physics', 'Chemistry', 'Biology', 
      'ICT / Computer Science', 'Bangla 1st & 2nd', 'English 1st & 2nd', 
      'Accounting', 'Finance & Banking', 'Business Entrepreneurship', 
      'General Science', 'Economics', 'Geography', 'Bangladesh & Global Studies'
    ];
  }

  // Higher Secondary (Class 11-12 / HSC)
  if (defaults.length === 0 && (cls.includes('class 11') || cls.includes('class 12') || cls.includes('hsc'))) {
    defaults = [
      'Physics 1st Paper', 'Physics 2nd Paper', 'Chemistry 1st Paper', 'Chemistry 2nd Paper', 
      'Higher Math 1st Paper', 'Higher Math 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper', 
      'ICT', 'Bangla', 'English', 
      'Accounting 1st & 2nd', 'Finance & Banking', 'Economics 1st & 2nd', 'Business Organization', 
      'Civics & Good Governance', 'Logic', 'Social Work', 'Islamic History & Culture'
    ];
  }

  // Admission / Higher Education
  if (defaults.length === 0 && (cls.includes('admission') || cls.includes('university') || cls.includes('degree') || cls.includes('honours'))) {
    defaults = [
      'Engineering Prep (Physics, Chemistry, Math)', 'Medical Prep (Biology, Chemistry, Physics, GK, English)', 
      'DU A-Unit Prep (Physics, Chem, Math, Bio)', 'DU B-Unit Prep (Bangla, English, GK)', 
      'DU C-Unit Prep (Accounting, Finance, Management, English, Bangla)', 
      'General Knowledge (GK)', 'English (Grammar & Vocabulary)', 'Bangla', 'IELTS / Higher Studies'
    ];
  }

  // Fallback if defaults still empty
  if (defaults.length === 0) {
    defaults = [
      'Bangla', 'English', 'General Math', 'Higher Math', 'Physics', 'Chemistry', 
      'Biology', 'ICT / Computer', 'General Science', 'Accounting', 'Finance', 
      'Economics', 'Business Studies', 'Islam / Religion'
    ];
  }

  // Merge defaults and custom subjects without duplicates
  const set = new Set([...defaults, ...customList]);
  return Array.from(set);
}

// Valid BD phone number regex helper
export function isValidBDPhone(phone: string): boolean {
  let clean = (phone || '').replace(/[\s\-\+\(\)]/g, '');
  if (clean.startsWith('880')) clean = clean.slice(2);
  if (/^1[3-9]\d{8}$/.test(clean)) clean = '0' + clean;
  const pattern = /^01[3-9]\d{8}$/;
  return pattern.test(clean);
}

export function formatBDPhone(phone: string): string {
  let clean = (phone || '').replace(/[\s\-\+\(\)]/g, '');
  if (clean.startsWith('880')) {
    clean = '0' + clean.slice(3);
  } else if (/^1[3-9]\d{8}$/.test(clean)) {
    clean = '0' + clean;
  }
  return clean;
}
