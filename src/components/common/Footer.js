import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Crop Darpan. All rights reserved.
            </p>
          </div>
          
          {/* <div className="flex space-x-4">
            {/* <Link to="/about" className="text-sm text-blue-600 hover:text-blue-800">
              About
            </Link>
            <Link to="/about-us" className="text-sm text-blue-600 hover:text-blue-800">
              About Us
            </Link>
            <Link to="/contact" className="text-sm text-blue-600 hover:text-blue-800">
              Contact
            </Link> */}
          {/* </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;