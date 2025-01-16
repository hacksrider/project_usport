'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
// import Logo from 'assets/images/Logo.png';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="flex items-center justify-center p-4 h-[100%]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <a>
              {/* <Image src={Logo} alt="Logo" width={92} height={92} /> */}
            </a>
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-800">Recover</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              required
              className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="mail@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Your Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;