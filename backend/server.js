import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as IOServer } from 'socket.io';
dotenv.config();
import connectDB from './config/db.js';
connectDB();
import userRouter from './routes/user.router.js';
import adminRouter from './routes/admin.router.js';
import aboutRouter from './routes/aboutRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new IOServer(server, {
	cors: { origin: '*' }
});

// Make io available to routes via app.locals
app.locals.io = io;

io.on('connection', (socket) => {
	console.log('Socket connected:', socket.id);

	socket.on('registerCustomer', (email) => {
		if (email) {
			socket.join(`customer:${email}`);
			console.log(`Socket ${socket.id} joined room customer:${email}`);
		}
	});

	socket.on('registerDriver', (driverId) => {
		if (driverId) {
			socket.join(`driver:${driverId}`);
			console.log(`Socket ${socket.id} joined room driver:${driverId}`);
		}
	});

	socket.on('driverLocationUpdate', (data) => {
		// data: {tripId, driverId, lat, lng, customerEmail}
		if (data && data.tripId && data.driverId) {
			if (data.customerEmail) {
				io.to(`customer:${data.customerEmail}`).emit('driverLocationUpdate', data);
			}
			io.to(`driver:${data.driverId}`).emit('driverLocationUpdate', data);
		}
	});

	socket.on('customerLocationUpdate', (data) => {
		// data: {tripId, customerEmail, lat, lng, driverId}
		if (data && data.tripId && data.customerEmail) {
			if (data.driverId) {
				io.to(`driver:${data.driverId}`).emit('customerLocationUpdate', data);
			}
			io.to(`customer:${data.customerEmail}`).emit('customerLocationUpdate', data);
		}
	});

	socket.on('disconnect', () => {
		console.log('Socket disconnected:', socket.id);
	});
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/api/about', aboutRouter);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server + sockets running on http://localhost:${PORT}`));

