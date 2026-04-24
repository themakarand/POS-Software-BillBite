import { useState } from "react";
import Welcome from "../assets/welcome.png";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8"
      style={{ backgroundColor: "#EDE9F8", fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-10">

        {/* ── LEFT SIDE — hidden on mobile, visible on lg+ ── */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center gap-6 select-none">
          {/* Illustration */}
          <img
            src={Welcome}
            alt="Payment illustration showing a phone with contactless payment and a hand holding a checkmark"
            className="w-full max-w-sm xl:max-w-md object-contain"
          />

          {/* Text */}
          <h2
            className="text-3xl xl:text-4xl font-bold text-center leading-snug"
            style={{ color: "#2D2D2D" }}
          >
            Welcome back, you've<br />been missed!
          </h2>
        </div>

        {/* ── RIGHT SIDE — White Card ── */}
        <div
          className="w-full max-w-sm sm:max-w-md lg:max-w-md rounded-2xl sm:rounded-3xl px-6 sm:px-8 lg:px-10 py-8 sm:py-10"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 48px rgba(120,80,200,0.10)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <img
              src={logo}
              alt="BILLBITE Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mb-5 sm:mb-6">
            <h1
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ color: "#1A1A1A" }}
            >
              Login Here
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>
              Login to continue managing your business
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">

            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid #E5E7EB",
                  color: "#1A1A1A",
                  backgroundColor: "#FAFAFA",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1.5px solid #9333EA";
                  e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1.5px solid #E5E7EB";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#1A1A1A" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #E5E7EB",
                    color: "#1A1A1A",
                    backgroundColor: "#FAFAFA",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1.5px solid #9333EA";
                    e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1.5px solid #E5E7EB";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Forget Password */}
              <div className="flex justify-end mt-2">
                <a
                  href="#"
                  className="text-sm font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: "#9333EA" }}
                >
                  Forget Password
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white transition-all duration-200 mt-1"
              style={{
                backgroundColor: loading ? "#C084FC" : "#9333EA",
                boxShadow: loading ? "none" : "0 4px 16px rgba(147,51,234,0.3)",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#7E22CE"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#9333EA"; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>
          </form>

          {/* Sign in with */}
          <div className="mt-5 sm:mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
              <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: "#6B7280" }}>
                Sign in with
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "#E5E7EB" }} />
            </div>

            <div className="flex items-center justify-center gap-4">
              {/* Google */}
              <button
                type="button"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                aria-label="Sign in with Google"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.6-5 7.3v6h8.1c4.7-4.3 7.2-10.7 7.2-17.4z" />
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.8 2.2-6 0-11.1-4-12.9-9.5H2.8v6.2C6.8 42.8 14.9 48 24 48z" />
                  <path fill="#FBBC05" d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.8C1 17.4 0 20.6 0 24s1 6.6 2.8 9.1l8.3-4.2z" />
                  <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.9 2.1 30.5 0 24 0 14.9 0 6.8 5.2 2.8 12.9l8.3 4.2C12.9 13.5 18 9.5 24 9.5z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                aria-label="Sign in with Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.3 9-9.3 2.6 0 5.4.5 5.4.5v5.9h-3c-3 0-3.9 1.9-3.9 3.8V24h6.6l-1.1 6.9h-5.6v16.8C39.2 45.9 48 36 48 24z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sign Up */}
          <p className="text-center text-xs sm:text-sm mt-5 sm:mt-6" style={{ color: "#6B7280" }}>
            Don't have an account?{" "}
            <a
              href="#"
              className="font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "#9333EA" }}
            >
            <Link to="/Signup">Sign Up</Link>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}