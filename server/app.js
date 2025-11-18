import express from "express";
import cors from "cors";
import deviceRouter from "./routes/device.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// APIs
app.use("/api/device", deviceRouter);

export default app;
