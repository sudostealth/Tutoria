import React, { useState, useEffect } from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { TaxonomyData } from '../types';

export const AdminApp = () => {
  const [taxonomy, setTaxonomy] = useState<TaxonomyData | null>(null);

  const fetchTaxonomy = async () => {
    try {
      const res = await fetch('/api/taxonomy');
      if (res.ok) {
        const data = await res.json();
        setTaxonomy(data);
      }
    } catch (err) {
      console.error('Error loading taxonomy:', err);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AdminPanel
          language="bn"
          taxonomy={taxonomy}
          onRefreshTaxonomy={fetchTaxonomy}
        />
      </div>
    </div>
  );
};