"use client";

import Link from "next/link";
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useGuestLogin, useLogin, UserLoginPayload } from "@/hook/userHook";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: UserLoginPayload = {
      password: password,
      email: email,
    };

    const res = await useLogin(payload);

    if (!res) {
      alert("Login failed!");
    } else {
      router.replace("/");
    }
  };

  const handleGuestLogin = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    useGuestLogin();
    router.replace("/");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-3xl font-bold">
          <span className="text-cyan-500">Smart</span>Bin
        </p>
        <div className="w-110 h-fit mt-10 card-primary border-cyan-800! flex flex-col gap-2 items-center">
          <p className="text-xl font-bold mb-2.5">Login</p>
          <form
            onSubmit={handleSubmit}
            className="w-full p-2 flex flex-col gap-3"
          >
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
              <label className="text-sm text-gray-400" htmlFor="password">
                Password must contain at least 8 characters
              </label>
            </div>
            <div className="flex flex-col gap-3 my-3">
              <button
                type="submit"
                className="bg-[#00c2ff] p-1 rounded-md text-black font-bold hover:bg-[#00a2d3] transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={handleGuestLogin}
                className="bg-transparent p-1 rounded-md border border-gray-500 hover:border-[#00a2d3] transition-colors duration-200"
              >
                Continue as guest
              </button>
              <p className="text-center text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#00c2ff] hover:border-[#00a2d3] hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
