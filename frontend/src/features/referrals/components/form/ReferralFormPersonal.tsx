import { useEffect, useState } from "react";
import "../form_css/ReferralForm.scss";
import { Referral } from "../../types";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";

export function ReferralFormPersonal() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const { user } = useAuthentication();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      console.log("User ID is not available yet.");
      return;
    }

    console.log("Fetching referrals for userId:", userId);

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
        console.log(`Deleted referral with postId ${postId}`);
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
              <div className="referral-card" key={ref.postId}>
                <h4>{ref.company} - {ref.jobTitle}</h4>
                <p>{ref.notes}</p>
                console.log("Hello bhai {ref.link}");
                <a href={ref.link} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
                <button
                  className="ref-delete"
                  onClick={() => handleDelete(ref.postId)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}