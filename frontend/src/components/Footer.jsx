import React from 'react';
import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-50 to-orange-50 border-t border-amber-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl shadow-md">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                PetsLib
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted companion for pet care information, breed guides, and expert advice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-amber-600 transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-600 hover:text-amber-600 transition-colors duration-200 text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/breeds" className="text-gray-600 hover:text-amber-600 transition-colors duration-200 text-sm">
                  Breed Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">Pet Care Tips</li>
              <li className="text-gray-600 text-sm">Training Guides</li>
              <li className="text-gray-600 text-sm">Health Information</li>
              <li className="text-gray-600 text-sm">Nutrition Advice</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amber-200">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-600 text-sm">
              © 2025 PetsLib. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
