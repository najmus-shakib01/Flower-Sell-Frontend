import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";

// eslint-disable-next-line react/prop-types
const PaymentSection = ({ flowerId, canComment }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async () => {
    if (!canComment) {
      toast.error("❌ You must order this flower before making a payment!");
      return;
    }

    setIsProcessingPayment(true);
    const token = localStorage.getItem("auth_token");

    try {
      const { data: paymentData } = await axios.get(
        `${baseUrl}/payment/payment_detail/${flowerId}/`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      window.location.href = paymentData.redirect_url;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "🚨 Network error. Please try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  

  return (
    <button
      onClick={handlePayment}
      disabled={!canComment || isProcessingPayment}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-green-400"
    >
      {isProcessingPayment ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        "Make Payment"
      )}
    </button>
  );
};

export default PaymentSection;