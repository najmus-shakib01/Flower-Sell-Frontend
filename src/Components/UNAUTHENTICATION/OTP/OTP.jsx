import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";

const OTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailResend, setEmailResend] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const enteredOtp = otp.join("");

    try {
      const response = await fetch(`${baseUrl}/user/verify_otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        toast.success("OTP Verified Successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong! Please try again.", error);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setResendDisabled(true);
    setTimer(30);

    try {
      const response = await fetch(`${baseUrl}/user/resend_otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailResend }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`A new OTP has been sent to ${emailResend}`);
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-10 pt-28 container">
      <Helmet>
        <title>OTP</title>
      </Helmet>
      <div className="w-full md:w-1/2">
        <img
          className="w-full rounded-lg shadow-lg"
          src="/otp.png"
          alt="Register Image"
        />
      </div>
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <div className="p-6 bg-white shadow-lg rounded-lg w-full">
          <form id="otp-form" className="space-y-4" onSubmit={handleVerifyOTP}>
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <label className="font-bold">OTP Code</label>
              <div className="flex w-full justify-between gap-0.5 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-12 h-12 sm:w-16 sm:h-16 text-center text-xl rounded"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full md:w-1/3"
              disabled={loading}
            >
              {loading ? "Loading..." : "Verify OTP"}
            </button>
          </form>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-lg w-full">
          <form
            id="otp-resend-form"
            className="space-y-4"
            onSubmit={handleResendOTP}
          >
            <label htmlFor="email_resend" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="email_resend"
              className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
              placeholder="Enter Your Email"
              value={emailResend}
              onChange={(e) => setEmailResend(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg w-full md:w-1/3"
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTP;