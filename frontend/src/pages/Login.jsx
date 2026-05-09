import { useState, useEffect } from "react";
import Welcome from "../assets/welcome.png";
import logo from "../assets/logo.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google';
import fbModule from '@greatsumini/react-facebook-login';
const FacebookLogin = fbModule.default || fbModule;

export default function LoginPage() {
  const { token } = useParams();
  const [view, setView] = useState("login"); // login, forgot, reset, success
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setView("reset");
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data);
      setView("success");
    } catch (err) {
      setError(err.response?.data || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", { token, password });
      setMessage(res.data);
      setView("success");
    } catch (err) {
      setError(err.response?.data || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/social-login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data || "Social Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        handleSocialLogin({
          email: userInfo.data.email,
          name: userInfo.data.name,
          providerId: userInfo.data.sub,
          provider: "google"
        });
      } catch (err) {
        setError("Failed to fetch Google profile");
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  const handleFacebookSuccess = (response) => {
    handleSocialLogin({
      email: response.email,
      name: response.name,
      providerId: response.userID,
      provider: "facebook"
    });
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

        {/* ── LEFT SIDE ── */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center gap-6 select-none">
          <img
            src={Welcome}
            alt="Payment illustration"
            className="w-full max-w-sm xl:max-w-md object-contain"
          />
          <h2
            className="text-3xl xl:text-4xl font-bold text-center leading-snug"
            style={{ color: "#2D2D2D" }}
          >
            {view === "login" ? "Welcome back, you've been missed!" : 
             view === "forgot" ? "Don't worry, we've got you covered!" :
             view === "reset" ? "Reset your password to continue." :
             "All set! You can now login."}
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
            <img src={logo} alt="Pangat Logo" className="h-24 sm:h-32 w-auto object-contain" />
          </div>

          {/* Heading */}
          <div className="mb-5 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#1A1A1A" }}>
              {view === "login" ? "Login Here" : 
               view === "forgot" ? "Forgot Password" :
               view === "reset" ? "New Password" :
               "Success!"}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>
              {view === "login" ? "Login to continue managing your business" :
               view === "forgot" ? "Enter your email to receive a reset link" :
               view === "reset" ? "Enter a strong new password" :
               "Your action was completed successfully."}
            </p>
            {error && <p className="text-sm font-semibold mt-3" style={{ color: "#EF4444" }}>{error}</p>}
            {message && view === "success" && <p className="text-sm font-semibold mt-3" style={{ color: "#10B981" }}>{message}</p>}
          </div>

          {/* ── LOGIN VIEW ── */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-2.5 sm:py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                    style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3.5 flex items-center">
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => setView("forgot")} className="text-sm font-semibold text-purple-600 hover:opacity-70">Forget Password</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 sm:py-3.5 rounded-xl text-white font-semibold" style={{ backgroundColor: "#9333EA" }}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="mt-5 sm:mt-6 text-center">
                <span className="text-xs sm:text-sm text-gray-500">Sign in with</span>
                <div className="flex justify-center gap-4 mt-4">
                  <button type="button" onClick={() => loginWithGoogle()} className="w-11 h-11 border rounded-full flex items-center justify-center hover:scale-110 transition-all">
                    <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.6-5 7.3v6h8.1c4.7-4.3 7.2-10.7 7.2-17.4z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.8 2.2-6 0-11.1-4-12.9-9.5H2.8v6.2C6.8 42.8 14.9 48 24 48z"/><path fill="#FBBC05" d="M11.1 28.9c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.8C1 17.4 0 20.6 0 24s1 6.6 2.8 9.1l8.3-4.2z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.9 2.1 30.5 0 24 0 14.9 0 6.8 5.2 2.8 12.9l8.3 4.2C12.9 13.5 18 9.5 24 9.5z"/></svg>
                  </button>
                  <FacebookLogin
                    appId="YOUR_FACEBOOK_APP_ID_HERE"
                    onProfileSuccess={handleFacebookSuccess}
                    className="w-11 h-11 border rounded-full flex items-center justify-center hover:scale-110 transition-all"
                    style={{ padding: 0 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.3 9-9.3 2.6 0 5.4.5 5.4.5v5.9h-3c-3 0-3.9 1.9-3.9 3.8V24h6.6l-1.1 6.9h-5.6v16.8C39.2 45.9 48 36 48 24z"/></svg>
                  </FacebookLogin>
                </div>
              </div>
            </form>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 sm:py-3.5 rounded-xl text-white font-semibold" style={{ backgroundColor: "#9333EA" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button type="button" onClick={() => setView("login")} className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors">
                Back to Login
              </button>
            </form>
          )}

          {/* ── RESET PASSWORD VIEW ── */}
          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA" }}
                />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 sm:py-3.5 rounded-xl text-white font-semibold" style={{ backgroundColor: "#9333EA" }}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* ── SUCCESS VIEW ── */}
          {view === "success" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <button onClick={() => { setView("login"); navigate("/login"); }} className="w-full py-3 sm:py-3.5 rounded-xl text-white font-semibold" style={{ backgroundColor: "#9333EA" }}>
                Go to Login
              </button>
            </div>
          )}

          {/* Sign Up Footer */}
          {view === "login" && (
            <p className="text-center text-xs sm:text-sm mt-5 sm:mt-6" style={{ color: "#6B7280" }}>
              Don't have an account? <Link to="/Signup" className="font-semibold text-purple-600 hover:opacity-70">Sign Up</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}