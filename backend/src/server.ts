import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import symptomRoutes from './routes/symptom.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import surveillanceRoutes from './routes/surveillance.routes.js';
import emergencyRoutes from './routes/emergency.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import mentalHealthRoutes from './routes/mentalHealth.routes.js';

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new SocketIOServer(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/symptoms', symptomRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/surveillance', surveillanceRoutes);
app.use('/api/v1/emergency', emergencyRoutes);
app.use('/api/v1/pharmacy', pharmacyRoutes);
app.use('/api/v1/mental-health', mentalHealthRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to VIT-Health API Server (Proposed for VTOP)',
    docs: '/api/v1/health',
  });
});

// Socket Connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 VIT-Health Backend API running on port ${PORT}`);
  console.log(`🌐 Environment: ${env.NODE_ENV}`);
  console.log(`🤖 AI Service Target: ${env.AI_SERVICE_URL}`);
  console.log(`====================================================`);
});

export { app, server, io };
