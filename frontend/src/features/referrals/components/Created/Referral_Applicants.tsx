import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../../../utils/api";
import { Applicant } from "../../types";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import "./Referral_applicants.scss"
export function ReferralApplicants() {
  const { postId } = useParams();
  const { user } = useAuthentication();
  const userId = user?.id;

  const postIdNumber = postId ? parseInt(postId, 10) : null;

  const [applicants, setApplicants] = useState<Applicant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId || !postIdNumber) return;

    request<Applicant[]>({
      endpoint: `/api/v1/referrals/applicants?userId=${userId}&postId=${postIdNumber}`,
      onSuccess: (data) => {
        setApplicants(data);
        setIsLoading(false);
      },
      onFailure: (error) => {
        console.error("Failed to fetch applicants:", error);
        setIsLoading(false);
      },
    });
  }, [userId, postIdNumber]);

  return (
    <div className="applicants-section">
      {isLoading ? (
        <p>Loading applicants...</p>
      ) : applicants && applicants.length > 0 ? (
        <ul className="applicants-list">
          {applicants.map((applicant) => (
            <li key={applicant.id} className="applicant-card">
              <div className="applicant-info">
                <strong>
                  {applicant.firstName} {applicant.lastName}
                </strong>
                <p>Email: {applicant.email}</p>
                <p>Company: {applicant.company}</p>
              </div>
              <div>Resume</div>
              {applicant.resumeLink && (
                <a
                  href={applicant.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  View Resume 
                </a>
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
