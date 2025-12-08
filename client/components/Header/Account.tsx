"use client";

import React, { useEffect, useRef, useState } from "react";
import { CircleUser } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const Account = ({ accountRole }: { accountRole: "guest" | "user" }) => {
  const [openAccountPopup, setOpenAccountPopup] = useState<boolean>(false);
  const router = useRouter();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenAccountPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="">
      <div
        onClick={() => setOpenAccountPopup(true)}
        className="rounded-full p-2 hover:bg-gray-600 transition-colors duration-200"
      >
        <CircleUser />
      </div>

      {/* Open Popup */}
      {openAccountPopup && (
        <div className="z-100 absolute top-15 right-2 rounded-md bg-gray-500 flex flex-col w-fit h-fit items-center">
          {accountRole == "guest" && (
            <button
              onClick={() => router.replace("/login")}
              className="w-full px-3 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Đăng nhập
            </button>
          )}
          {accountRole == "guest" && (
            <button
              onClick={() => router.replace("/register")}
              className="w-full px-3 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Đăng ký
            </button>
          )}
          {accountRole == "user" && (
            <button
              onClick={() => {
                useAuthStore.getState().logout();
              }}
              className="w-full px-3 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 text-red-300"
            >
              Đăng xuất
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
