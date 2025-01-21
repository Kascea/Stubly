import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { TicketIcon, UserIcon, LogOutIcon } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-orange-50">
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                              <img
                                src="/images/CustomTicketsLogo.png"
                                alt="CustomTickets"
                                class="h-12 w-auto"
                              />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-600 hover:text-sky-900"
                                >
                                    {link.text}
                                </Link>
                            ))}

                            {/* User Dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-sky-900 transition duration-150 ease-in-out hover:text-orange-400 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                      <Dropdown.Link href={route('profile.edit')} className="flex items-center space-x-2">
                                          <UserIcon className="h-4 w-4" />
                                          <span>Profile</span>
                                      </Dropdown.Link>

                                      <Dropdown.Link href={route('tickets.index')} className="flex items-center space-x-2">
                                          <TicketIcon className="h-4 w-4" />
                                          <span>History</span>
                                      </Dropdown.Link>

                                      <Dropdown.Link
                                          href={route('logout')}
                                          method="post"
                                          as="button"
                                          className="flex items-center space-x-2 w-full"
                                      >
                                          <LogOutIcon className="h-4 w-4" />
                                          <span>Log Out</span>
                                      </Dropdown.Link>
                                  </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-sky-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile menu */}
                    <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-sky-900 hover:bg-gray-100"
                                >
                                    {link.text}
                                </Link>
                            ))}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="px-3">
                                    <div className="text-base font-medium text-sky-900">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-sky-700">
                                        {user.email}
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-sky-900 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                                                        <Link
                                        href={route('tickets.index')}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-sky-900 hover:bg-gray-100"
                                    >
                                        <TicketIcon className="mr-2 h-4 w-4" />
                                        <span>Ticket History</span>
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-sky-900 hover:bg-gray-100"
                                    >
                                        Log Out
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow mt-16">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="mt-16">
              {children}
            </main>
        </div>
    );
}