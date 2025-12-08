import firebaseServices from "../services/firebase.services.js";
import admin from "firebase-admin";

const saveFCMToken = async (req, res) => {
  const { userId, fcmToken } = req.body;

  if (userId && fcmToken) {
    await firebaseServices.saveFCMToken(userId, fcmToken);
    console.log(`[SERVER] Đã lưu Token cho user ${userId}: ${fcmToken}`);
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
        .send({ message: `Không tìm thấy token cho user ${userId}` });
    }

    const message = {
      notification: {
        title: title || "Cảnh báo hệ thống",
        body: body || "Có thông tin cập nhật.",
      },
      data: data, // Để gửi dữ liệu tùy chỉnh cho client xử lý
      token: targetToken,
    };

    const response = await admin.messaging().send(message);
    console.log("[SERVER] Thông báo đã gửi thành công:", response);
    res.status(200).send({ success: true, message: "Thông báo đã được gửi" });
  } catch (error) {
    console.error("[SERVER] Lỗi khi gửi thông báo:", error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export default { saveFCMToken, sendNotification };
