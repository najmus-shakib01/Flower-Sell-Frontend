import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";

const Reset_Password = () => {
  const { uid64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/pass_change/reset_password/${uid64}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password Has Been Change Successfully!");
        navigate("/");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <section>
        <div className="container max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between pt-28 gap-10">
          <div className="w-full md:w-1/2 md:order-none">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <img
                className="w-full"
                src="/password.png"
                alt="Password Reset"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-center text-2xl font-bold mb-6 text-gray-800">
              Reset Password
            </h3>

            {message && (
              <div className="alert alert-success shadow-lg mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-error shadow-lg mb-4">{error}</div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full p-2 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-0 pr-10"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition duration-300"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Reset_Password;
