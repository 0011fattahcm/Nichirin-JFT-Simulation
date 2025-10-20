"use client";
import React, { use, useState } from "react";
import axios from "axios";

const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/register`,
        {
          username,
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);
      setSuccess("Admin berhasil dibuat. Redirecting...");
      window.location.href = "/rx78gpo1p6/login";
    } catch (err) {
      setError(err.response?.data?.message || "Gagal register admin");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Register Admin
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
