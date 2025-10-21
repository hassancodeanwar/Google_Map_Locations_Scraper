import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface JobFormProps {
  onJobCreated: () => void;
}

function JobForm({ onJobCreated }: JobFormProps) {
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [stateShortcut, setStateShortcut] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !state || !stateShortcut) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('scraper_jobs')
      .insert([
        {
          category,
          state,
          state_shortcut: stateShortcut,
          status: 'pending'
        }
      ]);

    if (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    } else {
      setCategory('');
      setState('');
      setStateShortcut('');
      onJobCreated();
    }

    setSubmitting(false);
  };

  return (
    <div className="job-form">
      <h2>Create Scraping Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Churches, Restaurants"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g., Kentucky, California"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stateShortcut">State Abbreviation</label>
          <input
            type="text"
            id="stateShortcut"
            value={stateShortcut}
            onChange={(e) => setStateShortcut(e.target.value)}
            placeholder="e.g., KY, CA"
            maxLength={3}
            required
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}

export default JobForm;
