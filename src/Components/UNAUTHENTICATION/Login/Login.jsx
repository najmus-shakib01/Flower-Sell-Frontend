import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/user/login/`, formData);
      const data = response.data;

      if (data.user && data.user.id) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("UserName", data.user.username);
      } else {
        console.error("User ID missing in response!");
      }

      window.dispatchEvent(new Event("storage"));
      toast.success("Login Successfully!");
      navigate(`/profile/${data.user.username}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed To Login. Please Try Again";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="container max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-10 pt-28">
          {/* Left Side Image */}
          <div className="w-full md:w-1/2">
            <img
              className="w-full rounded-2xl shadow-lg"
              src="/login.png"
              alt="Login Illustration"
            />
          </div>

          {/* Right Side Form */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleLogin} id="login-form" className="space-y-4">
              {error && <p className="text-red-500 text-center">{error}</p>}

              <div>
                <label htmlFor="username" className="font-bold block">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter Your Username"
                  required
                  className="input w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="font-bold block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Your Password"
                    required
                    className="input w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer z-10"
                    onClick={togglePassword}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-1/2 bg-green-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? <>Loading...</> : "Login"}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="flex flex-col md:flex-row justify-center items-center text-gray-700">
                  <Link
                    to={"/password_reset"}
                    className="mb-2 md:mb-0 text-blue-500 underline"
                  >
                    <b>Forgotten Password?</b>
                  </Link>
                  <span className="hidden md:inline-block">
                    &nbsp;&nbsp;·&nbsp;&nbsp;
                  </span>
                  <Link to={"/register"} className="text-blue-500 underline">
                    <b>Sign Up For Flower Seal</b>
                  </Link>
                </p>
                <br />
                <Link
                  className="w-1/2 bg-blue-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-blue-700 transition"
                  to={"/hr_login"}
                >
                  HR LOGIN
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
