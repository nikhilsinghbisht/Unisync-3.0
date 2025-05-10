import { useEffect, useState } from "react";
import "../form_css/ReferralForm.scss";
import { Referral } from "../../types";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { useNavigate } from "react-router-dom";

const ReferralCreated = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const { user } = useAuthentication();
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    request<Referral[]>({
      endpoint: `/api/v1/referrals/created?userId=${userId}`,
      onSuccess: setReferrals,
      onFailure: (error) => {
        console.error("Failed to fetch created referrals:", error);
      },
    });
  }, [userId]);

  const handleDelete = (postId: number) => {
    if (!userId) return;

    request<void>({
      endpoint: `/api/v1/referrals/delete?userId=${userId}&postId=${postId}`,
      method: "DELETE",
      onSuccess: () => {
        setReferrals((prev) => prev.filter((ref) => ref.postId !== postId));
      },
      onFailure: (error) => {
        console.error("Failed to delete referral:", error);
      },
    });
  };

  return (
    <>
      {referrals.length > 0 && (
        <div className="referrals-list-container">
          <h3>My Posted Referrals</h3>
          <div className="referrals-list">
            {referrals.map((ref) => (
              <div key={ref.postId}>
                <div className="referral-card">
                  <h4>
                    {ref.company} - {ref.jobTitle}
                  </h4>
                  <p>{ref.notes}</p>
                  
                  {/* Displaying the job link */}
                  <a
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="referral-link"
                  >
                    Job Link
                  </a>

                  <div className="referral-actions">
                    <button
                      className="ref-view-applicants"
                      onClick={() => navigate(`/referral-applicants/${ref.postId}`)}
                    >
                      View Applicants
                    </button>
                    <button
                      className="ref-delete"
                      onClick={() => handleDelete(ref.postId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralCreated;
