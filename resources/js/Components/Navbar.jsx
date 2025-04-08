import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import {
  TicketIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  ListOrderedIcon,
  ShoppingCart,
  HelpCircleIcon,
} from "lucide-react";
import axios from "axios";

export default function Navbar({
  auth,
  showingNavigationDropdown,
  setShowingNavigationDropdown,
}) {
  const { cart } = usePage().props;

  // Helper function to determine if a route is active
  const isActive = (routeName) => {
    return route().current(routeName);
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/">
                <img
                  src="/images/logo-no-background.png"
                  alt="Stubly"
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <Link
                href={route("canvas")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                  isActive("canvas")
                    ? "border-orange-400 text-sky-900"
                    : "border-transparent text-gray-500 hover:text-sky-900 hover:border-gray-300"
                }`}
              >
                <TicketIcon className="w-4 h-4 mr-2" />
                Create Ticket
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
            {auth?.user ? (
              <div className="relative">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-sky-900 bg-white hover:text-orange-400 focus:outline-none transition ease-in-out duration-150"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        {auth.user.name}

                        <svg
                          className="ml-2 -mr-0.5 h-4 w-4"
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

                  <Dropdown.Content width="48" contentClasses="py-1 bg-white">
                    <Dropdown.Link
                      href={route("profile.edit")}
                      className="text-sky-900 hover:text-orange-400 hover:bg-gray-50"
                    >
                      <UserIcon className="w-4 h-4 mr-2 inline" />
                      Profile
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route("orders.index")}
                      className="text-sky-900 hover:text-orange-400 hover:bg-gray-50"
                    >
                      <ListOrderedIcon className="w-4 h-4 mr-2 inline" />
                      Order History
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route("support.index")}
                      className="text-sky-900 hover:text-orange-400 hover:bg-gray-50"
                    >
                      <HelpCircleIcon className="w-4 h-4 mr-2 inline" />
                      Support
                    </Dropdown.Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <Dropdown.Link
                      href={route("logout")}
                      method="post"
                      as="button"
                      className="text-sky-900 hover:text-orange-400 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOutIcon className="w-4 h-4 mr-2 inline" />
                      Log Out
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href={route("support.index")}
                  className="relative p-2 text-sky-900 hover:text-orange-400 transition-colors rounded-full hover:bg-gray-100 inline-flex items-center"
                >
                  <HelpCircleIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Support</span>
                </Link>
                <Link
                  href={route("login")}
                  className="relative p-2 text-sky-900 hover:text-orange-400 transition-colors rounded-full hover:bg-gray-100 inline-flex items-center"
                >
                  <UserIcon className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Sign in</span>
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href={route("cart.index")}
              className="relative p-2 text-sky-900 hover:text-orange-400 transition-colors rounded-full hover:bg-gray-100"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.count}
                </span>
              )}
            </Link>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() =>
                setShowingNavigationDropdown((previousState) => !previousState)
              }
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-sky-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-sky-900 transition duration-150 ease-in-out"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={
                    !showingNavigationDropdown ? "inline-flex" : "hidden"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={
                    showingNavigationDropdown ? "inline-flex" : "hidden"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          showingNavigationDropdown ? "block" : "hidden"
        } sm:hidden`}
      >
        <div className="pt-2 pb-3 space-y-1">
          <ResponsiveNavLink
            href={route("canvas")}
            active={isActive("canvas")}
            className="flex items-center"
          >
            <TicketIcon className="w-4 h-4 mr-2" />
            <span
              className={
                isActive("canvas") ? "text-orange-400" : "text-sky-900"
              }
            >
              Create Ticket
            </span>
          </ResponsiveNavLink>

          {/* Mobile Cart Link */}
          <ResponsiveNavLink
            href={route("cart.index")}
            className="flex items-center"
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            <span className="text-sky-900">Cart</span>
          </ResponsiveNavLink>
        </div>

        {auth?.user && (
          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="px-4">
              <div className="font-medium text-base text-sky-900 flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                {auth.user.name}
              </div>
              <div className="font-medium text-sm text-gray-500 ml-6">
                {auth.user.email}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink
                href={route("profile.edit")}
                className="text-sky-900 hover:text-orange-400 flex items-center"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route("orders.index")}
                className="text-sky-900 hover:text-orange-400 flex items-center"
              >
                <ListOrderedIcon className="w-4 h-4 mr-2" />
                Order History
              </ResponsiveNavLink>

              <div className="border-t border-gray-200 my-1 mx-4"></div>

              <ResponsiveNavLink
                method="post"
                href={route("logout")}
                as="button"
                className="text-sky-900 hover:text-orange-400 flex items-center w-full text-left"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Log Out
              </ResponsiveNavLink>
            </div>
          </div>
        )}

        {!auth?.user && (
          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="mt-3 space-y-1">
              <ResponsiveNavLink
                href={route("login")}
                className="text-sky-900 hover:text-orange-400 flex items-center"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Sign in
              </ResponsiveNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
