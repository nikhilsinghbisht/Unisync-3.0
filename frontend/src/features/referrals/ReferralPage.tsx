import { useState } from "react";
import { ReferralForm } from "./components/form/ReferralForm";
import { ReferralList } from "./components/form/ReferralList";
import { ReferralApplied } from "./components/form/ReferralApplied"
export function ReferralPage() {
  const [activeTab, setActiveTab] = useState("referrals");
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <>
    <h1 style={{ textAlign:"center", marginTop: activeTab === "created" ? "3rem" : 0, fontSize:"30px"}}>
          Referral Hub
        </h1>
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRight: "1px solid #ccc"
        }}
      >

        {/* Referrals */}
        <button
          style={{
            display: "block",
            marginBottom: "1rem",
            background: activeTab === "referrals" ? "#007bff" : "#fff",
            color: activeTab === "referrals" ? "#fff" : "#000",
            border: "none",
            padding: "0.5rem",
            width: "100%",
            textAlign: "left",
            cursor: "pointer"
          }}
          onClick={() => {
            setActiveTab("referrals");
            setShowForm(false);
          }}
        >
          Referrals
        </button>

        {/* Referral Created */}
        <button
          style={{
            display: "block",
            marginBottom: "1rem",
            background: activeTab === "created" ? "#007bff" : "#fff",
            color: activeTab === "created" ? "#fff" : "#000",
            border: "none",
            padding: "0.5rem",
            width: "100%",
            textAlign: "left",
            cursor: "pointer"
          }}
          onClick={() => {
            setActiveTab("created");
          }}
        >
          Referral Created
        </button>

        {/* Referral Applied */}
        <button
          style={{
            display: "block",
            background: activeTab === "applied" ? "#007bff" : "#fff",
            color: activeTab === "applied" ? "#fff" : "#000",
            border: "none",
            padding: "0.5rem",
            width: "100%",
            textAlign: "left",
            cursor: "pointer"
          }}
          onClick={() => {
            setActiveTab("applied");
            setShowForm(false);
          }}
        >
          Referral Applied
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "1rem", position: "relative" }}>
        {activeTab === "created" && (
          <button
            onClick={handleToggleForm}
            style={{
              position: "absolute",
              bottom: "99%",
              right: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {showForm ? "-" : "+"}
          </button>
        )}

        
        <hr />

        {activeTab === "applied" && <ReferralApplied />}
        {activeTab === "referrals" && <ReferralList />}
        {activeTab === "created" && showForm && <ReferralForm />}
      </div>
    </div>
    </>
  );
}
