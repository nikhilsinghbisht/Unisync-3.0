import React, { useEffect, useState } from 'react';
import { request } from '../../utils/api';
import "./JobStyles.scss"
type Job = {
  id: number;
  title: string;
  companyName: string;
  companyLogo: string;
  category: string;
  tags: string[];
  jobType: string;
  publicationDate: string;
  candidateRequiredLocation: string;
  salary: string;
  description: string;
  url: string;
};

const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<Job[]>({
      endpoint: '/api/v1/jobs/job',
      onSuccess: (data) => {
        setJobs(data.slice(0, 15)); // Limit results for better readability
        setLoading(false);
      },
      onFailure: (error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg font-semibold">Loading IT jobs...</p>;

  return (
    <div className="job-board-container">
  <h1>💼 Explore Top IT Jobs</h1>
  <div className="job-grid">
    {jobs.map((job) => (
      <div key={job.id} className="job-card">
        <div className="company-info">
          <img src='../../assest/image.png' alt='photo'/>
          <div>
            <h2>{job.title}</h2>
            <p>{job.companyName}</p>
          </div>
        </div>
        <div className="job-details">
          <p>📍 {job.candidateRequiredLocation}</p>
          <p>📅 {new Date(job.publicationDate).toLocaleDateString()}</p>
          <p className="salary">💰 {job.salary}</p>
          <p><span className="label">Category:</span>{job.category}</p>
          <p><span className="label">Type:</span>{job.jobType}</p>
        </div>
        <div className="job-tags">
          {job.tags.map((tag, idx) => (
            <span key={idx}>#{tag}</span>
          ))}
        </div>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="view-job-btn">
          View Job →
        </a>
      </div>
    ))}
  </div>
</div>
  );
};

export default JobBoard;
