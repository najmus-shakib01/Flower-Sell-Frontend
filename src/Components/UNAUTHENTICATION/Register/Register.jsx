import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Email validation function
  const validateEmail = async (email) => {
    const accessKey = "00c1c8b0668ea0626e7898daa00a093c";
    const url = `https://apilayer.net/api/check?access_key=${accessKey}&email=${email}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Email validation failed", error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const password = formData.get("password");
    const confirm_password = formData.get("confirm_password");
    const profile_img = formData.get("profile_img");

    if (!profile_img || profile_img.size === 0) {
      toast.error("Please upload a profile image.");
      setLoading(false);
      return;
    }

    if (password !== confirm_password) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    // First validate the email directly without useQuery
    try {
      const emailValidation = await validateEmail(email);

      if (
        !emailValidation.format_valid ||
        !emailValidation.mx_found ||
        !emailValidation.smtp_check
      ) {
        toast.error("Please provide a valid and deliverable email address");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Email validation error:", error);
      toast.error(
        "Email validation service unavailable. Proceeding with registration..."
      );
    }

    try {
      // Upload image to Cloudinary
      const imgData = new FormData();
      imgData.append("file", profile_img);
      imgData.append("upload_preset", "first_time_using_cloudinary");
      imgData.append("cloud_name", "daasda9rp");

      const imgRes = await axios.post(
        "https://api.cloudinary.com/v1_1/daasda9rp/image/upload",
        imgData
      );

      const imgResult = imgRes.data;

      if (imgRes.status !== 200 || !imgResult.secure_url) {
        toast.error("Image upload failed!");
        setLoading(false);
        return;
      }

      if (!profile_img.type.startsWith("image/")) {
        toast.error("Only image files are allowed!");
        setLoading(false);
        return;
      }

      if (profile_img.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB!");
        setLoading(false);
        return;
      }

      const profileImageUrl = imgResult.secure_url;

      // Send data to backend
      const response = await axios.post(`${baseUrl}/user/register/`, {
        username,
        email,
        first_name,
        last_name,
        password,
        confirm_password,
        profile_img: profileImageUrl,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration Successful! Redirecting to Login...");
        navigate("/otp");
      } else {
        toast.error(
          response.data?.message ||
            response.data?.error ||
            response.data?.detail ||
            "Registration failed"
        );
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <section>
        <div className="container mx-auto max-w-screen-xl px-6 py-3 flex flex-col md:flex-row justify-center items-center gap-10 pt-28">
          <div className="w-full md:w-1/2 md:order-none">
            <img
              className="w-full rounded-xl shadow-lg"
              src="/reg.png"
              alt="Register Image"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 bg-white rounded-xl shadow-lg">
            <Link
              className="w-1/2 bg-green-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-green-700 transition"
              to={"/hr_login"}
            >
              HR LOGIN
            </Link>
            <br />
            <br />
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                className="input w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="input w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
                className="input w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
                className="input w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="input w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 hover:text-blue-500"
                  onClick={() => togglePassword("password")}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              </div>

              <div className="relative mt-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  required
                  className="input input-bordered w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 hover:text-blue-500"
                  onClick={() => togglePassword("confirm_password")}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </span>
              </div>
              <input
                type="file"
                name="profile_img"
                required
                className="file-input file-input-bordered w-full bg-gray-200"
              />
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white py-3 px-5 rounded-lg font-bold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </form>
            <Link
              to={"/login"}
              className="text-center block mt-3 text-blue-500 underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
