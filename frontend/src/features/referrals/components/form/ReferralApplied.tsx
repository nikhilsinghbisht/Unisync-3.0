import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { Referral } from "../../types";
import "../form_css/ReferralApplied.scss";

const ReferralApplied = () => {
  const [applications, setApplications] = useState<Referral[]>([]);
  const { user } = useAuthentication();
  const userId = user?.id;

  const fetchApplications = () => {
    if (!userId) return;

    request<Referral[]>({
      endpoint: `/api/v1/referrals/applied?userId=${userId}`,
      onSuccess: setApplications,
      onFailure: (error) => {
        console.error("Failed to fetch referral applications:", error);
      },
    });
  };

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  return (
    <div className="my-applications-container">
      <h3 style={{ fontSize: "1.5rem", textAlign: "center", margin: "15px" }}>
        Applied Referral Applications
      </h3>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <button className="refresh-button" onClick={fetchApplications}>
          🔄 Refresh Status
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="no-applications">
          You haven’t applied for any referrals yet.
        </p>
      ) : (
        applications.map((app) => (
          <div className="application-card" key={app.postId}>
            <h3 className="application-title">
              {app.company} - {app.jobTitle}
            </h3>
            <p className="application-notes">{app.notes}</p>
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="job-link"
            >
              View Job Posting
            </a>
          <div>
            Status -
            <span className={`application-status ${app.applicationStatus?.toLowerCase() || "pending"}`}>
               {app.applicationStatus || "PENDING"}
            </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReferralApplied;
