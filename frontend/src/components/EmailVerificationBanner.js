import React, { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import './EmailVerificationBanner.css';

const EmailVerificationBanner = () => {
  const [sending, setSending] = useState(false);
  const user = auth.currentUser;

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    setSending(true);
    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="email-verification-banner">
      <div className="banner-content">
        <span className="icon">⚠️</span>
        <p>
          Please verify your email address to unlock all features.
          <button 
            onClick={handleResendEmail} 
            className="resend-btn"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Resend verification email'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
