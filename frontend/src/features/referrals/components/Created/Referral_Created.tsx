import { useEffect, useState } from "react";
import "../form_css/ReferralForm.scss";
import { Referral } from "../../types";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { ReferralApplicants } from "./Referral_Applicants";

const ReferralCreated = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [visibleApplicants, setVisibleApplicants] = useState<
    Record<number, boolean>
  >({});
  const { user } = useAuthentication();
  const userId = user?.id;

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

  const toggleApplicants = (postId: number) => {
    setVisibleApplicants((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
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
                  <button onClick={() => toggleApplicants(ref.postId)}>
                    {visibleApplicants[ref.postId]
                      ? "Hide Applicants"
                      : "View Applicants"}
                  </button>
                  <button
                    className="ref-delete"
                    onClick={() => handleDelete(ref.postId)}
                  >
                    Delete
                  </button>
                </div>
                {visibleApplicants[ref.postId] && (
                  <ReferralApplicants
                    userId={userId ?? 0}
                    postId={ref.postId}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default ReferralCreated;
