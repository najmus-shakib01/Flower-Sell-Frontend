import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";

const Hr_Login = () => {
  const [showPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      username: "admin",
      password: "Abcd@..?1234",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${baseUrl}/user/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        if (data.user && data.user.id) {
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("UserName", data.user.username);
          console.log("User ID Stored:", localStorage.getItem("userId"));
          console.log(
            "User UserName Stored:",
            localStorage.getItem("UserName")
          );
        } else {
          console.error("User ID missing in response!");
        }

        window.dispatchEvent(new Event("storage"));
        toast.success("Login Successfully!");
        navigate(`/profile/${data.user.username}`);
      } else {
        toast.error(data.detail || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Failed To Login. Please Try Again");
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
                  className="input focus:ring-blue-400 bg-gray-200 w-full"
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
                    className="input focus:ring-blue-400 bg-gray-200 w-full"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-md font-bold"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hr_Login;
