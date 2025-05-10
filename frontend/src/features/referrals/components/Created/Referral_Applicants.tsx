import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { Applicant, Props } from "../../types";

export function ReferralApplicants({ userId, postId }: Props) {
  const [applicants, setApplicants] = useState<Applicant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    request<Applicant[]>({
      endpoint: `/api/v1/referral/get-applicants?userId=${userId}&postId=${postId}`,
      onSuccess: (data) => {
        setApplicants(data), setIsLoading(false);
      },
      onFailure: (error) => {
        console.error("Failed to fetch applicants:", error);
      },
    });
  }, [userId, postId]);

  return (
    <div className="applicants-section">
      {isLoading ? (
        <p>Loading applicants...</p>
      ) : applicants && applicants.length > 0 ? (
        <ul className="applicants-list">
          {applicants.map((applicant) => (
            <li key={applicant.id}>
              <strong>{applicant.name}</strong> ({applicant.email})
              {applicant.resumeLink && (
                <>
                  {" "}
                  –{" "}
                  <a
                    href={applicant.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No applicants yet.</p>
      )}
    </div>
  );
}
