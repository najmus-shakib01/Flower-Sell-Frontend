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
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const inputRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    const registrationTime = localStorage.getItem('registrationTime');
    
    if (!pendingEmail) {
      toast.error("Please register first!");
      navigate("/register");
      return;
    }

    if (registrationTime) {
      const regTime = new Date(registrationTime);
      const currentTime = new Date();
      const timeDiff = (currentTime - regTime) / 1000;
      
      if (timeDiff > 60) {
        toast.error("OTP has expired. Please register again.");
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('registrationTime');
        navigate("/register");
        return;
      }
      
      setTimer(Math.max(0, 60 - Math.floor(timeDiff)));
    }

    setEmail(pendingEmail);
    setEmailResend(pendingEmail);
  }, [navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      toast.error("OTP has expired. Please request a new one.");
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      
      if (newOtp.every(digit => digit !== "") && index === 5) {
        handleAutoSubmit(newOtp.join(""));
      }
    }
  };

  const handleAutoSubmit = async (enteredOtp) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/user/verify_otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('registrationTime');
        toast.success("OTP Verified Successfully!");
        navigate("/login");
      } else {
        toast.error(data.Error || "Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.",error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    console.log("Pasted data:", pastedData);
    
    if (/^\d+$/.test(pastedData)) {
      const pastedDigits = pastedData.split("").slice(0, 6);
      const newOtp = [...otp];
      
      pastedDigits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      const focusIndex = Math.min(pastedDigits.length, 5);
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 0);
      
      if (pastedDigits.length === 6) {
        setTimeout(() => {
          handleAutoSubmit(pastedData);
        }, 100);
      }
      
    } else {
      toast.error("Please paste only numbers (0-9)");
    }
  };

  const handleFocus = (index) => {
    setTimeout(() => {
      inputRefs.current[index]?.select();
    }, 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }
    
    handleAutoSubmit(enteredOtp);
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setResendDisabled(true);
    setTimer(60);

    try {
      const response = await fetch(`${baseUrl}/user/resend_otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailResend }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('registrationTime', new Date().toISOString());
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        toast.success(`A new OTP has been sent to ${emailResend}`);
      } else {
        toast.error(data.Error || "Failed to resend OTP.");
        setResendDisabled(false);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.",error);
      setResendDisabled(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-10 pt-28 container">
      <Helmet>
        <title>OTP Verification</title>
      </Helmet>
      
      <div className="w-full md:w-1/2">
        <img
          className="w-full rounded-lg shadow-lg"
          src="/otp.png"
          alt="OTP Verification"
        />
      </div>
      
      <div className="flex flex-col gap-6 w-full md:w-1/2">
        <div className="p-6 bg-white shadow-lg rounded-lg w-full">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-center">OTP Verification</h2>
            <p className="text-center text-gray-600">
              Time remaining: <span className="font-bold text-red-600">{formatTime(timer)}</span>
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              💡 Tip: You can copy and paste the OTP directly
            </p>
          </div>
          
          <form id="otp-form" className="space-y-4" onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="email" className="font-bold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                value={email}
                readOnly
                required
              />
            </div>
            
            <div>
              <label className="font-bold">OTP Code (6 digits)</label>
              <div 
                className="flex w-full justify-between gap-0.5 sm:gap-4"
                ref={containerRef}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-12 h-12 sm:w-16 sm:h-16 text-center text-xl rounded 
                 hover:bg-gray-300 transition-colors duration-200 ease-in-out
                 focus:bg-white focus:border-blue-500 focus:ring-opacity-50
                 selection:bg-blue-200 caret-transparent"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleFocus(index)}
                    onPaste={handlePaste} 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Paste OTP anywhere in the boxes or type digit by digit
              </p>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full md:w-1/3 disabled:bg-gray-400"
              disabled={loading || timer === 0}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>

        <div className="p-6 bg-white shadow-lg rounded-lg w-full">
          <form id="otp-resend-form" className="space-y-4" onSubmit={handleResendOTP}>
            <div>
              <label htmlFor="email_resend" className="font-bold">
                Email
              </label>
              <input
                type="email"
                id="email_resend"
                className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                value={emailResend}
                readOnly
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg w-full md:w-1/3 disabled:bg-gray-400"
              disabled={resendDisabled || timer > 0}
            >
              {resendDisabled ? `Resend OTP (${formatTime(timer)})` : "Resend OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTP;