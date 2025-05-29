import express from 'express';
import http from 'http';
import { config } from './config/config';
import userRoutes from './routes/user.route';
import { errorHandler } from './middlewares/globalErrorHandle';
import { connectDB } from './config/db';
import { initSocketIO } from './socket/socketConnect';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();
const server = http.createServer(app);
initSocketIO(server); 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/v1/users", userRoutes);
app.use(errorHandler);

app.get("/", authMiddleware, (req, res) => {
  res.send("Hello, World!");
});

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
