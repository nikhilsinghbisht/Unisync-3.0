import { ReferralForm } from "./components/ReferralForm";
import { ReferralList } from "./components/ReferralList";

export function ReferralPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Referral Hub</h1>
      <ReferralForm />
      <hr />
      <ReferralList />
    </div>
  );
}
