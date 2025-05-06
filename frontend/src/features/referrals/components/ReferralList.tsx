import { useEffect, useState } from "react";
import { request } from "../../../utils/api";
import { Referral } from "../types";
import { useAuthentication } from "../../authentication/contexts/AuthenticationContextProvider";

export function ReferralList() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    request<Referral[]>({
      endpoint: "/api/v1/referrals/open-to-apply",
      onSuccess: setReferrals,
      onFailure: (error) => {
        console.error("Failed to fetch referrals:", error);
      },
    });
  }, []);

  return (
    <div>
      <h2>Available Referrals</h2>
      {referrals.map((r) => (
        <div
          key={r.postId}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>
            {r.company} - {r.jobTitle}
          </h3>
          <p>{r.notes}</p>
          <a href={r.jobLink}></a>
          <ApplyForm referralId={r.referrerId!} />
        </div>
      ))}
    </div>
  );
}

function ApplyForm({ referralId }: { referralId: number }) {
  const [resumeLink, setResumeLink] = useState("");
  const { user } = useAuthentication();

  const apply = async () => {
    if (!resumeLink) {
      alert("Please enter resume link.");
      return;
    }

    await request({
      endpoint: "/api/v1/referrals/apply",
      method: "POST",
      body: JSON.stringify({
        referralId,
        resumeLink,
        userId: user?.id,
      }),
      onSuccess: () => {
        alert("Applied successfully!");
        setResumeLink("");
      },
      onFailure: (error) => {
        console.error("Failed to apply for referral:", error);
        alert("Failed to apply.");
      },
    });
  };

  return (
    <div>
      <input
        placeholder="Resume Link"
        value={resumeLink}
        onChange={(e) => setResumeLink(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={apply}>Apply</button>
    </div>
  );
}
