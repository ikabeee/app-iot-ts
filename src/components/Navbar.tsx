import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar, Button, Dropdown, Navbar as FlowbiteNavbar } from 'flowbite-react';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <FlowbiteNavbar fluid rounded>
      <FlowbiteNavbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          IoT App
        </span>
      </FlowbiteNavbar.Brand>
      <FlowbiteNavbar.Toggle />
      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link href="/" active={location.pathname === '/'}>
          Home
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="/dashboard" active={location.pathname === '/dashboard'}>
          Dashboard
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="/devices" active={location.pathname === '/devices'}>
          Devices
        </FlowbiteNavbar.Link>
      </FlowbiteNavbar.Collapse>
      <div className="flex md:order-2">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar rounded>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <svg
                        className="absolute w-10 h-10 text-gray-400 -left-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}
                </Avatar>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">{user.email}</span>
              </Dropdown.Header>
              <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button gradientDuoTone="purpleToBlue">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button gradientDuoTone="purpleToPink">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </FlowbiteNavbar>
  );
} 