import express from 'express';
import http from 'http';
import { config } from './config/config';
import userRoutes from './routes/user.route';
import { errorHandler } from './middlewares/globalErrorHandle';
import { connectDB } from './config/db';
import { initSocketIO } from './socket/socketConnect';
import { authMiddleware } from './middlewares/auth.middleware';
import orderRoutes from './routes/order.route';
import vendorRoutes from './routes/vendor.route';
import deliveryPartnerRoutes from './routes/deliveryPartner.route';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
initSocketIO(server); 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors configuration
app.use(cors({
  origin: config.client_url,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// mongoDB connection
connectDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/delivery-partners", deliveryPartnerRoutes);

app.use(errorHandler);

app.get("/", authMiddleware, (req, res) => {
  res.send("Hello, World!");
});

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
