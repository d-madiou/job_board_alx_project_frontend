"use client"
import { Link } from "react-router-dom"
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from "@heroicons/react/24/outline"

const Footer = () => {
  return (
    <footer
      className="border-t-2"
      style={{
        backgroundColor: "#0C1B33",
        borderTopColor: "#00FF84",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#00FF84" }}
              >
                <span className="text-xl font-black" style={{ color: "#000000" }}>
                  J
                </span>
              </div>
              <span className="text-2xl font-black" style={{ color: "#00FF84" }}>
                Golleh
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#B0B0B0" }}>
              Your premier destination for finding the perfect job. Connect with top companies and discover
              opportunities that match your skills and aspirations.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:transform hover:scale-110"
                style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#00FF84")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(0, 255, 132, 0.1)")}
              >
                <svg className="w-5 h-5" style={{ color: "#00FF84" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:transform hover:scale-110"
                style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#00FF84")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(0, 255, 132, 0.1)")}
              >
                <svg className="w-5 h-5" style={{ color: "#00FF84" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:transform hover:scale-110"
                style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#00FF84")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(0, 255, 132, 0.1)")}
              >
                <svg className="w-5 h-5" style={{ color: "#00FF84" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/jobs"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/companies"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  to="/post-job"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
              For Job Seekers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/register"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/saved-jobs"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  Saved Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/applications"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  My Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                >
                  <MapPinIcon className="h-4 w-4" style={{ color: "#00FF84" }} />
                </div>
                <span className="text-sm" style={{ color: "#B0B0B0" }}>
                  Malaysia, Kedah
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                >
                  <PhoneIcon className="h-4 w-4" style={{ color: "#00FF84" }} />
                </div>
                <a
                  href="tel:+1234567890"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  +60000000
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                >
                  <EnvelopeIcon className="h-4 w-4" style={{ color: "#00FF84" }} />
                </div>
                <a
                  href="mailto:hello@golleh.com"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  hello@golleh.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 255, 132, 0.1)" }}
                >
                  <GlobeAltIcon className="h-4 w-4" style={{ color: "#00FF84" }} />
                </div>
                <a
                  href="https://golleh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#B0B0B0" }}
                  onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
                  onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
                >
                  www.golleh.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          style={{ borderTopColor: "rgba(0, 255, 132, 0.2)" }}
        >
          <div className="text-sm" style={{ color: "#B0B0B0" }}>
            © 2024 alx prodev frontend
          </div>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-sm transition-colors duration-200"
              style={{ color: "#B0B0B0" }}
              onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
              onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm transition-colors duration-200"
              style={{ color: "#B0B0B0" }}
              onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
              onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm transition-colors duration-200"
              style={{ color: "#B0B0B0" }}
              onMouseEnter={(e) => (e.target.style.color = "#00FF84")}
              onMouseLeave={(e) => (e.target.style.color = "#B0B0B0")}
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
