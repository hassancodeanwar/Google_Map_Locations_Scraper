import type { ScraperJob, ScraperResult } from '../lib/supabase';

interface ResultsTableProps {
  job: ScraperJob;
  results: ScraperResult[];
  onExportCSV: () => void;
}

function ResultsTable({ job, results, onExportCSV }: ResultsTableProps) {
  return (
    <div className="results-table">
      <div className="results-header">
        <div>
          <h2>
            {job.category} in {job.state}
          </h2>
          <p className="results-subtitle">
            {results.length} results found
          </p>
        </div>
        {results.length > 0 && (
          <button onClick={onExportCSV} className="btn-export">
            Export to CSV
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty-results">
          <p>No results yet for this job.</p>
          <p className="hint">
            This job is {job.status}. Results will appear here once scraping is complete.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Hours</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>
                    <strong>{result.name}</strong>
                  </td>
                  <td>{result.address || 'N/A'}</td>
                  <td>
                    {result.average_rating ? (
                      <span className="rating">⭐ {result.average_rating}</span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{result.number_of_raters || 'N/A'}</td>
                  <td className="hours-cell">
                    {result.hours || 'N/A'}
                  </td>
                  <td>
                    {result.location_link ? (
                      <a
                        href={result.location_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-button"
                      >
                        View on Maps
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResultsTable;
