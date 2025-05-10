import { useState } from "react";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import "../form_css/ReferralForm.scss";

const ReferralForm = () => {
  const { user } = useAuthentication();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [link, setJobLink] = useState("");
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
        referrerId: user.id,
        jobTitle: position,
        company,
        notes: description,
        link,
      }),
      onSuccess: () => {
        setMessage("Referral posted successfully!");
        setCompany("");
        setPosition("");
        setDescription("");
        setJobLink("");
      },
      onFailure: (err) => {
        console.error("Error posting referral:", err);
        setMessage("Failed to post referral.");
      },
    });
  };

  return (
    <div className="referral-container">
      <h2>Post a Referral</h2>
      <form
        className="referral-form"
        onSubmit={handleSubmit}
      >
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
        <input
          type="url"
          placeholder="Job Link"
          value={link}
          onChange={(e) => setJobLink(e.target.value)}
          required
        />
        <button type="submit">Submit Referral</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ReferralForm;
