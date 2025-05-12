// ReferralList.tsx
import { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { Referral } from "../../types";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import "../form_css/ReferralList.scss";

const ReferralList = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const { user } = useAuthentication();

  useEffect(() => {
    if (!user?.id) return;

    request<Referral[]>({
      endpoint: `/api/v1/referrals/open-to-apply?userId=${user.id}`,
      onSuccess: setReferrals,
      onFailure: (error) => {
        console.error("Failed to fetch referrals:", error);
      },
    });
  }, [user?.id]);

  return (
    <div className="referral-container">
      <h2>Available Referrals</h2>
      {referrals.map((r) => (
        <div
          className="referral-card"
          key={r.postId}
        >
          <h3 className="referral-title">
            {r.company} - {r.jobTitle}
          </h3>
          <p className="referral-notes">{r.notes}</p>
          {r.referrerId !== Number(user?.id) && (
            <ApplyForm
              referrerId={r.referrerId}
              postId={r.postId}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default ReferralList;

function ApplyForm({
  referrerId,
  postId,
}: {
  referrerId: number;
  postId: number;
}) {
  const [link, setResumeLink] = useState("");
  const { user } = useAuthentication();

  const apply = async () => {
    if (!link) {
      alert("Please enter resume link.");
      return;
    }

    await request({
      endpoint: "/api/v1/referrals/apply",
      method: "POST",
      body: JSON.stringify({
        postId,
        referrerId,
        link,
        applicantId: [{ id: user?.id }],
      }),
      onSuccess: () => {
        alert("Applied successfully!");
        setResumeLink("");
      },
    onFailure: (error: any) => {
      // Check if the error contains a message
      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;

        // If the error message contains "already applied", show a specific message
        if (errorMessage.includes("already applied")) {
          alert("You have already applied to this referral.");
        } else {
          console.error("Failed to apply for referral:", error);
          alert("Failed to apply.");
        }
      } else {
        // In case the error doesn't have a response or message, show a generic message
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred.");
      }
    },
    });
  };

  return (
    <div className="apply-form">
      <input
        placeholder="Resume Link"
        value={link}
        onChange={(e) => setResumeLink(e.target.value)}
      />
      <button onClick={apply}>Apply</button>
    </div>
  );
}
