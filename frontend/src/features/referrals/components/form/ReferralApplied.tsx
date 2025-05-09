import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { Referral } from "../../types";
import "../form_css/ReferralApplied.scss";

export function ReferralApplied() {
  const [applications, setApplications] = useState<Referral[]>([]);
  const { user } = useAuthentication();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    request<Referral[]>({
      endpoint: `/api/v1/referrals/applied?userId=${userId}`,
      onSuccess: setApplications,
      onFailure: (error) => {
        console.error("Failed to fetch referral applications:", error);
      },
    });
  }, [userId]);

  return (
    <div className="my-applications-container">
      <h3 style={{ fontSize: "1.5rem", textAlign: "center", margin: "15px" }}>
        Applied Referral Applications
      </h3>
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
            <p>Status - {app.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
