import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">Resumind</h2>
          <p className="text-sm mt-2">
            Track your job applications, prep smarter, and land your next
            opportunity with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Product</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/features" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="/pricing" className="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="/demo" className="hover:underline">
                Live Demo
              </a>
            </li>
            <li>
              <a href="/signup" className="hover:underline">
                Get Started
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="/guides" className="hover:underline">
                Guides
              </a>
            </li>
            <li>
              <a href="/support" className="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
          <p className="text-sm mb-3">contact@resumind.com</p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Twitter" className="hover:text-white">
              🐦
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              🔗
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-white">
              🐙
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; 2025 Resumind. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
          <a href="/accessibility" className="hover:underline">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
