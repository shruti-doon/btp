import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-orange-500 font-medium">Crop</span>
          <span className="text-green-600 font-medium"> Darpan</span>
        </Link>

        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <span className="mr-2 text-gray-600">Language</span>
            <select className="border rounded px-2 py-1">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-blue-600 hover:underline"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
                {username || 'Expert'}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <Link to="/profile/edit" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
                  <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100">Change Password</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in" className="flex items-center text-blue-600 hover:underline">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
