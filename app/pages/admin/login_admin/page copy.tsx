"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/pages/admin/dashboard";
    }
  };

  return (
    <div
      className="relative flex items-center justify-center p-4 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/user/img/football-5.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative w-full max-w-sm p-6 space-y-6 bg-white bg-opacity-90 border rounded-lg shadow-md">
        <Image
          src="/user/img/logo-2.jpg"
          alt="Login"
          width={96}
          height={96}
          className="mx-auto"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="text" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2 mt-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-6 font-bold text-white bg-black rounded-md hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
