import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    <fieldset className="otp">
      <legend>OTP</legend>
      <input
        type={showOtp ? "text" : "password"}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
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
  );
}