/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";


const OrderSection = ({ flower, orderStatus }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const token = localStorage.getItem("auth_token");
      const { data } = await axios.post(
        `${baseUrl}/order/create_order/`,
        orderData,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("✅ Order placed successfully! Please Check Your Email.");
      navigate("/order_history");
      document.getElementById("orderModal").close();
      window.dispatchEvent(new Event("orderUpdated"));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "❌ Failed to place order!");
    },
  });

  const handleOrder = () => {
    if (!flower) {
      toast.error("❌ Flower data not found!");
      return;
    }
    createOrderMutation.mutate({
      flower: flower.id,
      quantity: parseInt(quantity),
    });
  };

  return (
    <>
      <button
        onClick={() => document.getElementById("orderModal").showModal()}
        disabled={createOrderMutation.isPending || !!orderStatus}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors ${
          orderStatus
            ? "bg-indigo-800 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
        }`}
      >
        {createOrderMutation.isPending ? (
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
            Ordering...
          </>
        ) : orderStatus === 'Pending' ? (
          "Already Ordered"
        ) : orderStatus === 'Completed' ? (
          "Purchased"
        ) : (
          "Order Now"
        )}
      </button>

      <dialog id="orderModal" className="modal">
        <div className="modal-box bg-white max-w-md">
          <h3 className="text-xl font-bold mb-4">Place Your Order</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={flower?.stock || 100}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600">Unit Price:</span>
              <span className="font-medium">৳{flower?.price || 0}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-bold text-lg">
                ৳{(flower?.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="modal-action flex justify-end gap-3 mt-6">
            <button
              onClick={() => document.getElementById("orderModal").close()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOrder}
              disabled={createOrderMutation.isPending}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-indigo-400 transition-colors"
            >
              {createOrderMutation.isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                </span>
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default OrderSection;