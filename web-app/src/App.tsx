import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { ScraperJob, ScraperResult } from './lib/supabase';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import ResultsTable from './components/ResultsTable';
import './App.css';

function App() {
  const [jobs, setJobs] = useState<ScraperJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ScraperJob | null>(null);
  const [results, setResults] = useState<ScraperResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchResults(selectedJob.id);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scraper_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const fetchResults = async (jobId: string) => {
    const { data, error } = await supabase
      .from('scraper_results')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
    } else {
      setResults(data || []);
    }
  };

  const handleJobCreated = () => {
    fetchJobs();
  };

  const handleJobSelect = (job: ScraperJob) => {
    setSelectedJob(job);
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = ['Name', 'Address', 'Location Link', 'Average Rating', 'Number of Raters', 'Hours'];
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        `"${r.name}"`,
        `"${r.address || ''}"`,
        `"${r.location_link || ''}"`,
        `"${r.average_rating || ''}"`,
        `"${r.number_of_raters || ''}"`,
        `"${r.hours || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedJob?.state}_${selectedJob?.category}_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Google Maps Location Scraper</h1>
        <p>Collect location data from Google Maps by category and state</p>
      </header>

      <div className="container">
        <div className="sidebar">
          <JobForm onJobCreated={handleJobCreated} />
          <JobList
            jobs={jobs}
            loading={loading}
            selectedJob={selectedJob}
            onJobSelect={handleJobSelect}
          />
        </div>

        <div className="main-content">
          {selectedJob ? (
            <ResultsTable
              job={selectedJob}
              results={results}
              onExportCSV={handleExportCSV}
            />
          ) : (
            <div className="empty-state">
              <h2>Welcome to Google Maps Scraper</h2>
              <p>Create a new scraping job to get started, or select an existing job to view results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
