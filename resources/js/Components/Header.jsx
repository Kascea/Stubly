import React from 'react';
import { Link } from '@inertiajs/react';

const Header = () => {
  return (
    <header className="bg-sky-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          CustomTickets.ai
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li>
              <Link href="/" className="text-white hover:text-orange-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="#features" className="text-white hover:text-orange-200 transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="#cta" className="text-white hover:text-orange-200 transition">
                Get Started
              </Link>
            </li>
          </ul>
          <div className="flex space-x-2">
            <Link
              href="/login"
              className="bg-white text-sky-900 hover:bg-orange-200 transition px-4 py-2 rounded-full text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-orange-400 text-sky-900 hover:bg-orange-300 transition px-4 py-2 rounded-full text-sm font-medium"
            >
              Register
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
