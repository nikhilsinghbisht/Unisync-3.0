import { useState } from "react";
import "../form_css/ReferralForm.scss";

export interface Referral {
  id: number;
  company: string;
  jobTitle: string;
  notes: string;
  jobLink: string;
}

export function ReferralForm() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [message, setMessage] = useState("");

  // Static referral data with id included
  const referrals: Referral[] = [
    {
      id: 1,
      company: "Company A",
      jobTitle: "Software Engineer",
      notes: "Looking for a software engineer with expertise in JavaScript.",
      jobLink: "https://www.companyA.com/job/1",
    },
    {
      id: 2,
      company: "Company B",
      jobTitle: "Product Manager",
      notes: "Hiring a product manager for an exciting new project.",
      jobLink: "https://www.companyB.com/job/2",
    },
    {
      id: 3,
      company: "Company C",
      jobTitle: "Data Scientist",
      notes: "Seeking a data scientist for our growing analytics team.",
      jobLink: "https://www.companyC.com/job/3",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("Referral posted successfully!");
    setCompany("");
    setPosition("");
    setDescription("");
    setJobLink("");
  };

  return (
    <>
    <div className="referral-container">
      <div className="referral-form-container">
        <h2>Post a Referral</h2>
        <form className="referral-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
          <input
            type="url"
            placeholder="Job Link"
            value={jobLink}
            onChange={(e) => setJobLink(e.target.value)}
            required
          />
          <button type="submit">Submit Referral</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
      </div>
      {referrals.length > 0 && (
        <div className="referrals-list-container">
          <h3>My Posted Referrals</h3>
          <div className="referrals-list">
            {referrals.map((ref) => (
              <div className="referral-card" key={ref.id}>
                <h4>{ref.company} - {ref.jobTitle}</h4>
                <p>{ref.notes}</p>
                <a href={ref.jobLink} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
                <button className="ref-delete">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
