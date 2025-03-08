'use client'

import MainLayout from '@/app/components/mainLayout';
import { User } from '@/app/interface/user';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User[]>([]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/user');
      if (res.data.status === 200) {
        setUser(res.data.data)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const findExitEmail = user.find(item => item.user_email === email)
    if(!findExitEmail){
      setMessage('ไม่พบข้อมูลอีเมลนี้ ในสมาชิก');
      return;
    }
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email }),
      });

      if (res.status !== 200) {
        console.log('res-------->', res)
        console.log('send error ');

      }
      setMessage('Reset email has been sent. Please check your inbox.');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      console.error('send error ---> ', error);
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
          <p className="mb-4 text-center">
            Enter your email address and we will send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="team@mynaui.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
          <div className="mt-6 text-center">
            <a
              onClick={() => window.history.back()}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              &larr; Back to Login
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
