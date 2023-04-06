import express from 'express';
const router = express.Router();
import { verifyWebhook, handleReplyMessage } from '../../../controllers/webhookController.js';

router.get('/webhook', verifyWebhook);
router.post('/webhook', handleReplyMessage);

export default router;