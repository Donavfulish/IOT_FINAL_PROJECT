import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export const useSaveFCMToken = async (userId: number, fcmToken: string) => {
  try {
    await api.post("/api/firebase/save-fcm-token", { userId, fcmToken });
  } catch (e) {
    console.error("Login failed: ", e);
  }
};

export const useSendNotification = async (
  userId: number,
  title: string,
  body: string,
  data: object
) => {
  try {
    await api.post("/api/firebase/send-notification", {
      userId,
      title,
      body,
      data,
    });
  } catch (e) {
    console.error("Login failed: ", e);
  }
};
