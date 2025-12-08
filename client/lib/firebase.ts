// lib/firebase.ts (Đã cập nhật cho Push Notifications)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 💡 Cần import getMessaging
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDZjR9jfeYQroqEReM4FAt3VkNZ-8QAd4",
  authDomain: "iot-trashbin-final.firebaseapp.com",
  projectId: "iot-trashbin-final",
  storageBucket: "iot-trashbin-final.firebasestorage.app",
  messagingSenderId: "618425186170",
  appId: "1:618425186170:web:9a22916eb04d53efc988c3",
  measurementId: "G-20MVXQZ56G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Có thể giữ lại nếu bạn dùng Analytics

// 1. Khởi tạo Messaging và export
// Kiểm tra môi trường để đảm bảo hàm getMessaging chỉ chạy trên client
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

// 2. Export VAPID Public Key
// 🚨 BẠN PHẢI THAY THẾ CHỖ NÀY bằng VAPID Key của bạn.
// Lấy từ Firebase Console -> Project Settings -> Cloud Messaging -> Web Push Certificates
export const VAPID_KEY =
  "BGTgMRxtUR6Uu-YXgloUUi4r7RxYtIaOVNZuH8gyzSDsA0Pz7hXjv3ZkDE1LOUiM2oG1mTAn2QQBNSB85fGw_TA";
