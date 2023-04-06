import express from 'express';
import dotenv from 'dotenv';
const server = express();

import webhookRouter from './routes/api-v1/webhook/webhook.js';

// Load environment variables
dotenv.config();

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Declare the port
const PORT = process.env.PORT || 5000;

// API Routes
server.use('/api/v1', webhookRouter);

server.listen(PORT, () => console.log(`webhook is listening on port ${PORT}`));