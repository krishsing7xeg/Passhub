
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">PassHub</h3>
            <p className="text-gray-200 leading-relaxed">
              Simplifying visitor pass management for events worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link></li>
              <li><a href="#about-us" className="hover:text-indigo-200 transition-colors">About Us</a></li>
              <li><Link to="/subscriptions" className="hover:text-indigo-200 transition-colors">Subscriptions</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-200 transition-colors">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-200 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-200 transition-colors text-2xl">📘</a> {/* Facebook */}
              <a href="#" className="hover:text-indigo-200 transition-colors text-2xl">🐦</a> {/* Twitter */}
              <a href="#" className="hover:text-indigo-200 transition-colors text-2xl">📷</a> {/* Instagram */}
            </div>
          </div>
        </div>
        <div className="border-t border-indigo-500 mt-8 pt-8 text-center">
          <p className="text-gray-200">&copy; 2024 PassHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;