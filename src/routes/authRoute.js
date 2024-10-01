import express from 'express'
const router = express.Router();
import { register, login, verifyAccessToken, refreshAccessToken } from '../controller/authController.js';


router.post('/register', register);
router.post('/login', login);
router.post('/validate-token', verifyAccessToken);
router.post('/refresh-token', refreshAccessToken);

export default router;
