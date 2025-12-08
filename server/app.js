import express from "express";
import cors from "cors";
import deviceRouter from "./routes/device.routes.js";
import userRouter from "./routes/user.routes.js";
import binRouter from "./routes/bin.routes.js";
import firebaseRouter from "./routes/firebase.routes.js";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import { createRequire } from "module";

// 💡 Tạo hàm require cục bộ
const require = createRequire(import.meta.url);

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const serviceAccount = require("./iot-trashbin-final-firebase-adminsdk-fbsvc-2d7304f8e5.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// APIs
app.use("/api/device", deviceRouter);
app.use("/api/user", userRouter);
app.use("/api/bin", binRouter);
app.use("/api/firebase", firebaseRouter);

export default app;
