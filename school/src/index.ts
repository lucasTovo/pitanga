import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { schoolClassRouter } from "./routes/school-class.routes";
import { authenticate } from "./middlewares/auth.middleware";
import { readFileSync } from "fs";
import { createServer } from "https";
import logger from "./shared/logger";
import userRouter from "./routes/user.routes";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({
  origin: "https://localhost:3000", // origem exata do front
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/classes", authenticate, schoolClassRouter);
app.use("/users", authenticate, userRouter);

const options = {
  key: readFileSync('./certs/server.key'),
  cert: readFileSync('./certs/server.cert')
};

const httpsServer = createServer(options, app);
  httpsServer.listen(PORT, () => {
  logger.info({ data: { port: PORT } }, `HTTPS server running on port ${PORT}`);
});
