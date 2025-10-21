import type { ScraperJob } from '../lib/supabase';

interface JobListProps {
  jobs: ScraperJob[];
  loading: boolean;
  selectedJob: ScraperJob | null;
  onJobSelect: (job: ScraperJob) => void;
}

function JobList({ jobs, loading, selectedJob, onJobSelect }: JobListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'running':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="job-list">
        <h2>Recent Jobs</h2>
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="job-list">
      <h2>Recent Jobs</h2>
      {jobs.length === 0 ? (
        <p className="empty-message">No jobs yet. Create your first job above.</p>
      ) : (
        <div className="jobs">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`job-item ${selectedJob?.id === job.id ? 'selected' : ''}`}
              onClick={() => onJobSelect(job)}
            >
              <div className="job-header">
                <h3>{job.category}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(job.status) }}
                >
                  {job.status}
                </span>
              </div>
              <p className="job-details">
                <strong>{job.state}</strong> ({job.state_shortcut})
              </p>
              <p className="job-meta">
                Created: {formatDate(job.created_at)}
              </p>
              {job.total_results > 0 && (
                <p className="job-results">
                  {job.total_results} results
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;
