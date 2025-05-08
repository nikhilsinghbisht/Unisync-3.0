import { useState } from "react";
import "../form_css/ReferralApplied.scss";

interface Application {
  company: string;
  jobTitle: string;
  jobLink: string;
  notes: string;
  postId: number;
  appliedAt: string;
}

export function ReferralApplied() {
  const [applications] = useState<Application[]>([
    {
      company: "Google",
      jobTitle: "Software Engineer",
      jobLink: "https://careers.google.com/jobs/results/",
      notes: "Exciting backend role for freshers.",
      postId: 1,
      appliedAt: "2025-05-01T10:00:00Z",
    },
    {
      company: "Amazon",
      jobTitle: "Frontend Developer",
      jobLink: "https://www.amazon.jobs/en/",
      notes: "React experience preferred.",
      postId: 2,
      appliedAt: "2025-05-03T14:30:00Z",
    },
  ]);

  return (
    <div className="my-applications-container">
      <h3 style={{fontSize:"1.5rem" , textAlign:"center" , margin:"15px"}}>Applied Referral Applications</h3>
      {applications.length === 0 ? (
        <p className="no-applications">You haven’t applied for any referrals yet.</p>
      ) : (
        applications.map((app) => (
          <div className="application-card" key={app.postId}>
            <h3 className="application-title">{app.company} - {app.jobTitle}</h3>
            <p className="application-notes">{app.notes}</p>
            <a
              href={app.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="job-link"
            >
              View Job Posting
            </a>
            <p className="application-date">
              Applied on: {new Date(app.appliedAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
