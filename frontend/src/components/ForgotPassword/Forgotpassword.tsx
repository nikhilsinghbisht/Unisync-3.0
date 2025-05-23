import React, { useState } from 'react';
import styles from './ForgotPassword.module.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Send email to backend for reset
//     console.log('Reset link sent to:', email);
//     // Optional: show toast/alert here
//   };

  return (
    <div className={styles.container}>
      <h2>Forgot Your Password?</h2>
      <p>Enter your registered email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      <a href="/login" className={styles.backLink}>Back to Login</a>
    </div>
  );
};

export default ForgotPassword;
