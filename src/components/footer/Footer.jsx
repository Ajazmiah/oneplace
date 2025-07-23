import React from "react";

function Footer() {
  return (
    <footer class="bg-black text-gray-300 py-12 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* <!-- Brand --> */}
        <div>
          <h2 class="text-xl font-bold text-white">Resumind</h2>
          <p class="text-sm mt-2">
            Track your job applications, prep smarter, and land your next
            opportunity with confidence.
          </p>
        </div>

        {/* <!-- Quick Links --> */}
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Product</h3>
          <ul class="space-y-1 text-sm">
            <li>
              <a href="/features" class="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="/pricing" class="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="/demo" class="hover:underline">
                Live Demo
              </a>
            </li>
            <li>
              <a href="/signup" class="hover:underline">
                Get Started
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Resources</h3>
          <ul class="space-y-1 text-sm">
            <li>
              <a href="/blog" class="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="/faq" class="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="/guides" class="hover:underline">
                Guides
              </a>
            </li>
            <li>
              <a href="/support" class="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- Contact + Social --> */}
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">Connect</h3>
          <p class="text-sm mb-3">contact@resumind.com</p>
          <div class="flex space-x-4">
            <a href="#" aria-label="Twitter" class="hover:text-white">
              🐦
            </a>
            <a href="#" aria-label="LinkedIn" class="hover:text-white">
              🔗
            </a>
            <a href="#" aria-label="GitHub" class="hover:text-white">
              🐙
            </a>
          </div>
        </div>
      </div>

      {/* <!-- Divider --> */}
      <div class="border-t border-gray-700 my-6"></div>

      {/* <!-- Bottom Row --> */}
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; 2025 Resumind. All rights reserved.</p>
        <div class="flex space-x-4 mt-2 md:mt-0">
          <a href="/privacy" class="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" class="hover:underline">
            Terms of Service
          </a>
          <a href="/accessibility" class="hover:underline">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
