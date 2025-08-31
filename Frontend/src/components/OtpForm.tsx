import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../pages/SignupPage/SignupPage.module.css";

interface OtpInputProps {
  otp: string;
  setOtp: (value: string) => void;
}

export default function OtpInput({ otp, setOtp }: OtpInputProps) {
  const [showOtp, setShowOtp] = useState(false);

  const toggleOtpVisibility = () => {
    setShowOtp((prev) => !prev);
  };

  return (
    <>
      <fieldset className={styles["fieldset"]}>
        <input
          type={showOtp ? "text" : "password"}
          value={otp}
          placeholder="OTP"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOtp(e.target.value)
          }
          required
        />
        <span>
          {showOtp ? (
            <FaEyeSlash className="eye-icon" onClick={toggleOtpVisibility} />
          ) : (
            <FaEye className="eye-icon" onClick={toggleOtpVisibility} />
          )}
        </span>
      </fieldset>
    </>
  );
}
