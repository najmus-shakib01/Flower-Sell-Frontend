import { useEffect, useState, useRef } from "react";
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
  const otpInputRefs = useRef([]);

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

      // Auto focus to next input
      if (value && index < 5) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const pasteArray = pasteData.split('');
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (pasteArray[i]) {
          newOtp[i] = pasteArray[i];
        }
      }
      setOtp(newOtp);
      
      // Focus on the last input after paste
      if (otpInputRefs.current[5]) {
        otpInputRefs.current[5].focus();
      }
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
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 pt-20 md:pt-28 container">
      <Helmet>
        <title>OTP</title>
      </Helmet>
      <div className="w-full md:w-1/2 hidden md:block">
        <img
          className="w-full rounded-lg shadow-lg"
          src="/otp.png"
          alt="Register Image"
        />
      </div>
      <div className="flex flex-col gap-4 md:gap-6 w-full md:w-1/2">
        <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg w-full">
          <form id="otp-form" className="space-y-4" onSubmit={handleVerifyOTP}>
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full p-2 rounded"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <label className="font-bold">OTP Code</label>
              <div className="flex w-full justify-between gap-1 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-12 h-12 sm:w-16 sm:h-16 text-center text-xl rounded"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onPaste={index === 0 ? handleOtpPaste : null}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Tip: You can paste the 6-digit OTP code
              </p>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full md:w-1/3 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Verify OTP"}
            </button>
          </form>
        </div>
        <div className="p-4 sm:p-6 bg-white shadow-lg rounded-lg w-full">
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
              className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full p-2 rounded"
              placeholder="Enter Your Email"
              value={emailResend}
              onChange={(e) => setEmailResend(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full md:w-1/3 transition-colors"
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