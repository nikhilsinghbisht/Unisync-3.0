import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../../../utils/api";
import { Applicant } from "../../types";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import "./Referral_applicants.scss";

export function ReferralApplicants() {
  const { postId } = useParams();
  const { user } = useAuthentication();
  const userId = user?.id;
  const postIdNumber = postId ? parseInt(postId, 10) : null;

  const [applicants, setApplicants] = useState<Applicant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");

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

  const updateS = (applicantId: number, newStatus: string) => {
    if (!postIdNumber) return;

    const url = `/api/v1/referrals/referral/application/status?applicantId=${applicantId}&postId=${postIdNumber}&status=${newStatus}`;

    request({
      endpoint: url,
      method: "PUT",
      onSuccess: () => {
        setApplicants((prevApplicants) =>
          prevApplicants
            ? prevApplicants.map((applicant) =>
                applicant.id === applicantId
                  ? { ...applicant, applicationStatus: newStatus }
                  : applicant
              )
            : prevApplicants
        );
        // setStatusUpdateMessage(
        //   `Status updated to ${newStatus} for applicant ${applicantId}`
        // );
      },
      onFailure: (error) => {
        console.error("Failed to update status:", error);
        setStatusUpdateMessage("Failed to update status.");
      },
    });
  };

  return (
    <div className="applicants-section">
      {isLoading ? (
        <p>Loading applicants...</p>
      ) : applicants && applicants.length > 0 ? (
        <>
          {statusUpdateMessage && (
            <p className="status-message">{statusUpdateMessage}</p>
          )}
          <ul className="applicants-list">
            {applicants.map((applicant) => (
              <li key={applicant.id} className="applicant-card">
                <div className="applicant-info">
                  <strong>
                    {applicant.firstName} {applicant.lastName}
                  </strong>
                  <p>Email: {applicant.email}</p>
                  <p>Company: {applicant.company}</p>
                  <div>
            Status -
            <span className={`application-status ${applicant.applicationStatus?.toLowerCase() || "pending"}`}>
               {applicant.applicationStatus || "PENDING"}
            </span>
            </div>
                </div>
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
                <div className="status-buttons">
                  <button
                    onClick={() => updateS(applicant.id, "ACCEPTED")}
                    disabled={applicant.applicationStatus === "ACCEPTED"}
                    className="accept-button"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateS(applicant.id, "REJECTED")}
                    disabled={applicant.applicationStatus === "REJECTED"}
                    className="reject-button"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No applicants yet.</p>
      )}
    </div>
  );
}
