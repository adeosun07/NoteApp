import { useState, useEffect } from "react";
import axios from "axios";
import reactLogo from "../../assets/react.svg";
import OtpInput from "../../components/OtpForm";
import styles from "../SignupPage/SignupPage.module.css";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === "otp") {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/auth/send-otp`, { email });
      setStep("otp");
      setTimer(300);
      setCanResend(false);
    } catch (err: any) {
      console.error(err);
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
      const res = await axios.post(`${API}/auth/verify-otp`, { email, otp });

      if (keepLoggedIn) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("jwt", res.data.token);
      } else {
        sessionStorage.setItem("jwt", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSession = () => {
    setKeepLoggedIn(!keepLoggedIn);
  };

  return (
    <>
      <header className={styles["header"]}>
        <div>
          <img src={reactLogo}  alt="React logo" />
        </div>
        <div>
          <p>HD</p>
        </div>
      </header>

      <main className={styles["main"]}>
        <div>
          <h1>Login</h1>
          <p className={styles["small_text"]}>
            Please login to continue to your account
          </p>
        </div>

        <div>
          <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp}>
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
            {step === "otp" && (
              <p
                className={styles["resendCode"]}
                onClick={() => handleSendOtp()}
                style={{
                  cursor: canResend ? "pointer" : "not-allowed",
                  color: canResend ? "#367AFF" : "gray",
                }}
              >
                {canResend
                  ? "Resend Code"
                  : `Resend in ${Math.floor(timer / 60)}:${String(
                      timer % 60
                    ).padStart(2, "0")}`}
              </p>
            )}

            <p className={styles["keepMeLoggedIn"]}>
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={handleSession}
                id="keepLoggedIn"
              />
              <label htmlFor="keepLoggedIn"> Keep me logged in</label>
            </p>

            <button type="submit" disabled={loading}>
              {loading
                ? "Processing..."
                : step === "email"
                ? "Send OTP"
                : "Login"}
            </button>
          </form>
          <p className={styles["redirect"]}>
            <span className={styles["small_text"]}>
              Don't have an account?{" "}
            </span>
            <a href="/signup" className={styles["span"]}>
              Create one
            </a>
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </main>
    </>
  );
}
