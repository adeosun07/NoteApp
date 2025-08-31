import bcrypt from "bcrypt";
import pool from "../db.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET || "your_secret_key";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default {
  get_otp: async (req, res) => {
    if (req.body.name && req.body.dob) {
      const { email, name, dob } = req.body;
      await pool.query(
        "INSERT INTO users (email, name, dob) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
        [email, name, dob]
      );
      try {
        const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp = await bcrypt.hash(rawOtp, saltRounds);
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${rawOtp}. It is valid for 5 minutes.`,
        };
        await transporter.sendMail(mailOptions);
        const expiry = new Date(Date.now() + 5 * 60 * 1000);
        await pool.query(
          "INSERT INTO otps (email, otp, expiry) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET otp = $2, expiry = $3",
          [email, otp, expiry]
        );
        res.status(200).json({ message: "OTP sent to email" });
      } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      const { email } = req.body;
      const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = await bcrypt.hash(rawOtp, saltRounds);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${rawOtp}. It is valid for 5 minutes.`,
      };

      try {
        await transporter.sendMail(mailOptions);

        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        await pool.query(
          `INSERT INTO otps (email, otp, expiry, used)
     VALUES ($1, $2, $3, FALSE)
     ON CONFLICT (email)
     DO UPDATE SET otp = EXCLUDED.otp, expiry = EXCLUDED.expiry, used = FALSE`,
          [email, otp, expiry]
        );

        res.status(200).json({ message: "OTP sent to email" });
      } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: "No user found" });
      }
    }
  },
  verify_otp: async (req, res) => {
    const { email, otp } = req.body;
    try {
      const result = await pool.query(
        "SELECT otp, used, expiry FROM otps WHERE email = $1",
        [email]
      );
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or OTP" });
      }
      const user = result.rows[0];
      if (user.used) {
        return res.status(400).json({ message: "OTP already used" });
      }
      if (new Date(user.expiry) < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }
      const isMatch = await bcrypt.compare(otp, user.otp);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or OTP" });
      } else {
        await pool.query("UPDATE otps SET used = TRUE WHERE email = $1", [
          email,
        ]);
        const validateUser = await pool.query(
          "SELECT id, email, name FROM users WHERE email = $1",
          [email]
        );
        const validUser = validateUser.rows[0];
        const accessToken = jwt.sign(
          { id: validUser.id, email: validUser.email, username: validUser.name},
          secretKey,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { id: user.id },
          process.env.REFRESH_SECRET,
          { expiresIn: "7d" }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res.json({ token: accessToken, user: validUser });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  logout: (req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  },
  refreshToken: (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const accessToken = jwt.sign({ id: decoded.id }, secretKey, {
        expiresIn: "1h",
      });
      return res.json({ token: accessToken });
    } catch (error) {
      console.error("Error refreshing token:", error);
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  },
};
