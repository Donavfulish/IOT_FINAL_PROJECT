"use client";

import Link from "next/link";
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { isValidEmail } from "@/utils/formValidationUtils";
import {
  useRegister,
  UserRegisterPayload,
  UserRegisterResult,
} from "@/hook/userHook";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showBinPassword, setShowBinPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [binId, setBinId] = useState<string>("");
  const [binPassword, setBinPassword] = useState<string>("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !binId || !binPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Email không hợp lệ");
      return;
    }

    if (password.length < 8) {
      alert("Mật khẩu phải dài tối thiểu 8 ký tự");
      return;
    }
    if (password != confirmPassword) {
      alert("Mật khẩu chưa trùng khớp");
      return;
    }

    const payload: UserRegisterPayload = {
      email: email,
      password: password,
      bin_id: binId,
      bin_password: binPassword,
    };

    const result: UserRegisterResult = await useRegister(payload);

    if (!result.success) alert(result.log);
    else {
      alert("Đăng ký tài khoản thành công.\nQuay về trang đăng nhập");
      router.replace("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-3xl font-bold">
          <span className="text-cyan-500">Smart</span>Bin
        </p>
        <div className="w-110 h-fit mt-10 card-primary border-cyan-800! flex flex-col gap-2 items-center">
          <p className="text-xl font-bold mb-2.5">Register</p>
          <form
            onSubmit={handleRegister}
            className="w-full p-2 text-sm font-medium pb-2"
          >
            <p className="text-sm font-medium pb-2">User Information</p>
            <section className="w-full flex flex-col gap-3">
              <input
                type="text"
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary w-full h-10"
              />
              <div className="relative flex flex-col gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-primary w-full h-10"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-3 text-gray-400 cursor-pointer hover:text-cyan-800 transition-colors duration-200"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-primary w-full h-10"
                />
                <div
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-2 right-3 text-gray-400 cursor-pointer hover:text-cyan-800 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </div>
                <label className="text-sm text-gray-400" htmlFor="password">
                  Password must contain at least 8 characters
                </label>
              </div>
            </section>

            <p className="text-sm font-medium pb-2 mt-5">
              TrashBin Information
            </p>
            <section className="w-full flex flex-col gap-3">
              <input
                type="text"
                id="bin-id"
                placeholder="Bin ID"
                value={binId}
                onChange={(e) => setBinId(e.target.value)}
                className="input-primary w-full h-10"
              />
              <div className="relative flex flex-col gap-2">
                <input
                  type={showBinPassword ? "text" : "password"}
                  id="bin-password"
                  placeholder="Bin Password"
                  value={binPassword}
                  onChange={(e) => setBinPassword(e.target.value)}
                  className="input-primary w-full h-10"
                />
                <div
                  onClick={() => setShowBinPassword(!showBinPassword)}
                  className="absolute top-2 right-3 text-gray-400 cursor-pointer hover:text-cyan-800 transition-colors duration-200"
                >
                  {showBinPassword ? <EyeOffIcon /> : <EyeIcon />}
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3 my-3 mt-10">
              <button
                type="submit"
                className="bg-[#00c2ff] p-1 rounded-md text-black font-bold hover:bg-[#00a2d3] transition-colors duration-200"
              >
                Register
              </button>
              <Link
                href="/login"
                className="bg-transparent p-1 rounded-md border border-gray-500 hover:border-[#00a2d3] transition-colors duration-200 text-center"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
