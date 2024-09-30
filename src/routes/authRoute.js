import express from 'express'
const router = express.Router();
import { register, login, logout } from '../controller/authController.js';


router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

export default router;
