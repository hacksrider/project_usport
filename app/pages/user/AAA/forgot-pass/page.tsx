'use client'

import MainLayout from '@/app/components/mainLayout';
// import { Main } from 'next/document';
import React from 'react';

export default function ForgotPassword() {
  return (
    <MainLayout>
    <div className="flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <p className="mb-4 text-center">Enter your email address and we will send you a link to reset your password.</p>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="team@mynaui.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300"
          >
            Send Reset Email
          </button>
        </form>
        <div className="mt-6 text-center">
          <a onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Login</a>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
