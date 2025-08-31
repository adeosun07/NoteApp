import { useState } from "react";
import axios from "axios";
import reactLogo from "../../assets/react.svg";
import OtpInput from "../../components/OtpForm";
import styles from "./SignupPage.module.css";

export default function SignupPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const API = import.meta.env.VITE_API_URL;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/auth/send-otp`, { email, name, dob });
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
      const res = await axios.post(`${API}/auth/verify-otp`, {
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
      <header className={styles["header"]}>
        <div>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <div>
          <p>HD</p>
        </div>
      </header>

      <main className={styles["main"]}>
        <div>
          <h1>Sign Up</h1>
          <p className={styles["small_text"]}>
            Sign up to enjoy the feature of HD
          </p>
        </div>

        <div>
          <form
            onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp}
          >
            <fieldset className={styles["fieldset"]}>
              <legend>Your Name</legend>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className={styles["fieldset"]}>
              <legend>Date of Birth</legend>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className={styles["fieldset"]}>
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
          <p className={styles["redirect"]}>
            <span className={styles["small_text"]}>
              Aleady have an account??
            </span>
            <a href="/login" className={styles["span"]}>
              Sign in
            </a>
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </main>
    </>
  );
}
