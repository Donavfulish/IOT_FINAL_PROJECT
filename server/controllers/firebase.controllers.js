import firebaseServices from "../services/firebase.services.js";
import admin from "firebase-admin";

const saveFCMToken = async (req, res) => {
  const { userId, fcmToken } = req.body;

  if (userId && fcmToken) {
    await firebaseServices.saveFCMToken(userId, fcmToken);
    return res.status(200).send({ success: true, message: "Token saved" });
  }
  res.status(400).send({ success: false, message: "Invalid data" });
};

const sendNotification = async (req, res) => {
  const { userId, title, body, data } = req.body;

  try {
    const targetToken = await firebaseServices.getFCMToken(userId);

    if (!targetToken) {
      return res
        .status(404)
        .send({ message: `Fail to find token for user: ${userId}` });
    }

    const message = {
      notification: {
        title: title || "System notification",
        body: body || "There is a notification from the system",
      },
      data: data, // Để gửi dữ liệu tùy chỉnh cho client xử lý
      token: targetToken,
    };

    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Internal Server Error", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export default { saveFCMToken, sendNotification };
