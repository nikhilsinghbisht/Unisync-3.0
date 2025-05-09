import { useEffect, useState } from "react";
import "../form_css/ReferralForm.scss";
import { Referral } from "../../types";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";

export function ReferralFormPersonal() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const { user } = useAuthentication();
  const userId = user?.id;

  // State to trigger deletion
  // const [referralToDelete, setReferralToDelete] = useState<number | null>(null);

  // Fetch referrals
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

  // Delete referral when referralToDelete changes
  // useEffect(() => {
  //   if (!referralToDelete || !userId) return;

  //   request({
  //     method: "DELETE",
  //     endpoint: "/api/v1/referrals/delete",
  //     data: {
  //       userId,
  //       referrerId: referralToDelete,
  //     },
  //     onSuccess: () => {
  //       setReferrals((prev) =>
  //         prev.filter((ref) => ref.referrerId !== referralToDelete)
  //       );
  //       setReferralToDelete(null); // reset after delete
  //     },
  //     onFailure: (error) => {
  //       console.error("Failed to delete referral:", error);
  //       setReferralToDelete(null); // reset even if it fails
  //     },
  //   });
  // }, [referralToDelete, userId]);

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
                <a href={ref.jobLink} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
                {/* <button
                  className="ref-delete"
                  onClick={() => setReferralToDelete(ref.referrerId)}
                >
                  Delete
                </button> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
