import { useState } from "react";
import axios from "axios";
import reactLogo from "../assets/react.svg";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:4000/api/auth";

  // Step 1: Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/send-otp`, { email });
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/verify-otp`, { email, otp });

      // store JWT + user info
      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect after login
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
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
          <h1>Login</h1>
          <p>Welcome back! Enter your email to receive a login code.</p>
        </div>

        <div className="form">
          <form
            className="form_body"
            onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp}
          >
            <fieldset>
              <legend>Email</legend>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </fieldset>

            {step === "otp" && (
              <fieldset>
                <legend>OTP</legend>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </fieldset>
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? "Processing..."
                : step === "email"
                ? "Send OTP"
                : "Login"}
            </button>
          </form>

          <p className="redirect">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </main>
    </>
  );
}
