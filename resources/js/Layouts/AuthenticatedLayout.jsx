import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { TicketIcon, UserIcon, LogOutIcon } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-orange-50">
            <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-sky-200/50 to-orange-200/50 backdrop-blur-md z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                              <img
                                src="/images/CustomTicketsLogo.png"
                                alt="CustomTickets"
                                className="h-12 w-auto"
                              />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-orange-100 transition-colors"
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
                                                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-orange-100 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-sky-200 shadow-sm"                                            >
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
                                      <Dropdown.Content className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg ring-1 ring-black/5 mt-1">
                                          <div className="p-1">
                                              <Dropdown.Link 
                                                  href={route('profile.edit')} 
                                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                                              >
                                                  <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                  <span>Profile</span>
                                              </Dropdown.Link>

                                              <Dropdown.Link 
                                                  href={route('tickets.index')} 
                                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                                              >
                                                  <TicketIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                  <span>Tickets</span>
                                              </Dropdown.Link>

                                              <div className="h-px bg-gray-100 my-1"></div>

                                              <Dropdown.Link
                                                  href={route('logout')}
                                                  method="post"
                                                  as="button"
                                                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                                              >
                                                  <LogOutIcon className="h-4 w-4 mr-2 text-gray-500" />
                                                  <span>Log Out</span>
                                              </Dropdown.Link>
                                          </div>
                                      </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-300"
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
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md rounded-lg mt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-white/20"
                                >
                                    {link.text}
                                </Link>
                            ))}
                            <div className="border-t border-white/20 pt-4">
                                <div className="px-3">
                                    <div className="text-base font-medium text-gray-700">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-700/80">
                                        {user.email}
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-white/20"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                    
                                    <Link
                                        href={route('tickets.index')}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-white/20"
                                    >
                                        <TicketIcon className="h-4 w-4" />
                                        <span>Ticket History</span>
                                    </Link>

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-400/20"
                                    >
                                        <LogOutIcon className="h-4 w-4" />
                                        <span>Log Out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white/50 backdrop-blur-sm shadow-sm mt-16">
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