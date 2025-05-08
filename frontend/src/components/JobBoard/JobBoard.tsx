import React, { useEffect, useState } from 'react';
import { request } from '../../utils/api';
import "./JobStyles.css"

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
    <div className="px-6 py-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-12">
        💼 Explore Top IT Jobs
      </h1>

      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div
            key={job.id}
            id="job-card"
            className="border-black p-10 bg-white transition transform hover:scale-105 "
          >
            <div className="flex items-center mb-4">
              <img
                src={`${job.companyLogo}?not-from-cache-please` || '/default-logo.png'}
                alt="Company Logo"
                crossOrigin='anonymous'
                className="w-12 h-12 mr-4 rounded-full object-cover border border-gray-300"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <p className="text-sm text-gray-600">{job.companyName}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500">📍 {job.candidateRequiredLocation}</p>
            <p className="text-sm text-gray-500">📅 {new Date(job.publicationDate).toLocaleDateString()}</p>
            <p className="text-sm text-green-600 font-medium mt-2">💰 {job.salary}</p>
            <p className="text-sm mt-3">
              <span className="font-semibold">Category:</span> {job.category}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Type:</span> {job.jobType}
            </p>

            {/* Job Tags */}
            <div className="flex flex-wrap mt-3 gap-2">
              {job.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block text-center text-white bg-indigo-600 hover:bg-indigo-700 font-bold py-2 rounded-xl transition"
            >
              View Job →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
