import { useState } from "react";
import { request } from "../../../utils/api";
import { useAuthentication } from "../../authentication/contexts/AuthenticationContextProvider";

export function ReferralForm() {
  const { user } = useAuthentication();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("You must be logged in to post a referral.");
      return;
    }

    await request({
      endpoint: "/api/v1/referrals/add",
      method: "POST",
      body: JSON.stringify({
        company,
        job_title: position,        // match backend field
        notes: description,         // match backend field
        referrer_id: user.id,       // include required field
      }),
      onSuccess: () => {
        setMessage("Referral posted successfully!");
        setCompany("");
        setPosition("");
        setDescription("");
      },
      onFailure: (err) => {
        console.error("Error posting referral:", err);
        setMessage("Failed to post referral.");
      },
    });
  };

  return (
    <div>
      <h2>Post a Referral</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <button type="submit">Submit Referral</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
