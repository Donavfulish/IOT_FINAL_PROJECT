importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// 1. Cấu hình Firebase
// Bạn phải DÁN LẠI CHÍNH XÁC cấu hình firebaseConfig của bạn vào đây
const firebaseConfig = {
  apiKey: "AIzaSyDDZjR9jfeYQroqEReM4FAt3VkNZ-8QAd4",
  authDomain: "iot-trashbin-final.firebaseapp.com",
  projectId: "iot-trashbin-final",
  storageBucket: "iot-trashbin-final.firebasestorage.app",
  messagingSenderId: "618425186170",
  appId: "1:618425186170:web:9a22916eb04d53efc988c3",
  measurementId: "G-20MVXQZ56G",
};

// 2. Khởi tạo và thiết lập Messaging
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Lắng nghe thông báo khi ứng dụng không mở/không tập trung
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico", // Đặt đường dẫn icon phù hợp
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
