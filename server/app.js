import express from "express";
import cors from "cors";
import deviceRouter from "./routes/device.routes.js";
import userRouter from "./routes/user.routes.js";
import binRouter from "./routes/bin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// APIs
app.use("/api/device", deviceRouter);
app.use("/api/user", userRouter);
app.use("/api/bin/", binRouter);

export default app;
