
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";
import Api from "../../../shared/utils/api";

const LoginForm = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setPending(true);
    try {
      const res = await Api.post("/auth/login", { email, password });
      toast.success(res.data?.message || "Logged in successfully");
      navigate("/dashbaord");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Password</label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            minLength={6}
            required
            onInvalid={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.validity.valueMissing) {
                target.setCustomValidity("Password is required");
              } else if (target.validity.tooShort) {
                target.setCustomValidity(
                  "Password must be at least 6 characters",
                );
              }
            }}
            onInput={(e) => {
              (e.target as HTMLInputElement).setCustomValidity("");
            }}
            className="w-full p-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
          >
            {passwordVisible ? <BsEye /> : <FiEyeOff />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer bg-[#0F3C9F] hover:bg-[#0b2f7d] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-md transition-all duration-300"
      >
        {pending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
