import { useState } from "react";
import axios from "axios";
import reactLogo from "../../assets/react.svg";
import OtpInput from "../../components/OtpForm";

export default function SignupPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const API = "http://localhost:4000/api/auth";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/send-otp`, { email, name, dob });
      setStep("otp");
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/verify-otp`, {
        email,
        otp,
      });

      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <div className="logo">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <div className="company_name">
          <p>HD</p>
        </div>
      </header>

      <main>
        <div>
          <h1>Sign Up</h1>
          <p>Sign up to enjoy the feature of HD</p>
        </div>

        <div className="form">
          <form
            className="form_body"
            onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp}
          >
            <fieldset>
              <legend>Your Name</legend>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </fieldset>

            <fieldset>
              <legend>Date of Birth</legend>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </fieldset>

            <fieldset>
              <legend>Email</legend>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>

            {step === "otp" && <OtpInput otp={otp} setOtp={setOtp} />}

            <button type="submit" disabled={loading}>
              {loading
                ? "Processing..."
                : step === "email"
                ? "Get OTP"
                : "Sign Up"}
            </button>
          </form>
          <p className="redirect">
            Aleady have an account?? <a href="/login">Login</a>
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </main>
    </>
  );
}
