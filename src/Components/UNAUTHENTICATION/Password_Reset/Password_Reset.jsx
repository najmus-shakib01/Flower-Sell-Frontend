import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";

const Password_Reset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/pass_change/password_reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Password Reset Successully. Please Check Your Email`);
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
        <title>Password Reset</title>
      </Helmet>
      <section>
        <div className="container max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between pt-28 gap-10">
          {/* Image Column */}
          <div className="w-full md:w-1/2 md:order-none">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <img
                className="w-full"
                src="/password.png"
                alt="Password Reset Image"
              />
            </div>
          </div>

          {/* Password Reset Form */}
          <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-center text-2xl font-bold mb-4">
              Password Reset
            </h3>

            {/* Success Message */}
            {message && (
              <div className="alert alert-success shadow-lg mb-4">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error shadow-lg mb-4">{error}</div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-bold">
                  Your Email
                </label>
                <input
                  type="email"
                  className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                  placeholder="Please Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition duration-300"
                disabled={loading}
              >
                {loading ? "Sending..." : "Password Reset"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Password_Reset;
