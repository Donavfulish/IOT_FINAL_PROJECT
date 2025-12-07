"use client";

// components/NotificationSetup.tsx
import React, { useEffect } from "react";
// Import các đối tượng đã export từ file cấu hình của bạn
import { messaging, VAPID_KEY } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { useSaveFCMToken } from "@/hook/notificationHook";

const NotificationSetup = ({ userId }: { userId: number }) => {
  const saveTokenOnServer = async (token: string) => {
    // Gửi Token lên Express server
    try {
      await useSaveFCMToken(userId, token);
      console.log("FCM Token đã được lưu trữ thành công trên server.");
    } catch (error) {
      console.error("Lỗi khi lưu Token lên server:", error);
    }
  };

  const requestPermissionAndGetToken = async () => {
    // Chỉ chạy trên trình duyệt (client-side)
    if (!messaging || !("serviceWorker" in navigator)) return;

    try {
      // 1. Yêu cầu quyền thông báo từ người dùng
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Quyền thông báo được cấp.");

        // 2. Lấy FCM Token bằng VAPID Key
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          // 3. Gửi Token lên server
          await saveTokenOnServer(currentToken);
        } else {
          console.log("Không có token đăng ký có sẵn.");
        }
      } else {
        console.log("Quyền thông báo bị từ chối.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy token:", error);
    }
  };

  useEffect(() => {
    // Lắng nghe thông báo khi ứng dụng đang mở (foreground)
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Thông báo nhận được khi ứng dụng đang mở:", payload);
        const title = payload.notification?.title || "Thông báo hệ thống";
        const body = payload.notification?.body || "Có dữ liệu mới cập nhật.";

        toast.info(
          <div onClick={() => console.log("Thông báo được click")}>
            <strong>{title}</strong>
            <p style={{ margin: 0 }}>{body}</p>
            {/* Nếu có data tùy chỉnh, có thể hiển thị thêm tại đây */}
          </div>,
          {
            // Tùy chọn cho Toast này
            type: "warning", // 'success' | 'error' | 'warning' | 'info' | 'default'
            position: "top-right",
            autoClose: 7000,
          }
        );
      });
    }

    // Bắt đầu quá trình đăng ký
    requestPermissionAndGetToken();
  }, [userId]);

  return (
    <div>
      {/* Component này chỉ cần chạy một lần khi người dùng đăng nhập */}
    </div>
  );
};

export default NotificationSetup;
