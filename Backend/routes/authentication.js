import express from 'express';
import authControllers from '../controllers/authControllers.js';


const router = express.Router();

router.post('/send-otp', authControllers.get_otp);
router.post("/verify-otp", authControllers.verify_otp);

export default router;