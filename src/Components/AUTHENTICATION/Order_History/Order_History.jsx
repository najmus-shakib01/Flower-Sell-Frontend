import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../../ConstData/Loader";
import Time from "../../../ConstData/Time";
import { baseUrl } from "../../../constants/env.constants";

const OrderHistory = () => {
  const token = localStorage.getItem("auth_token");

  const fetchOrders = async () => {
    const response = await axios.get(`${baseUrl}/order/my_order/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
    });
    return response.data;
  };

  const fetchStats = async () => {
    const response = await axios.get(`${baseUrl}/order/one_user_order_stats/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
    });
    return response.data;
  };

  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: !!token,
    onError: () => {
      toast.error("❌ Network error. Try again.");
    },
    onSuccess: (data) => {
      if (data.length === 0) {
        toast.error("❌ No orders found!", { duration: 3000 });
      }
    },
  });

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    enabled: !!token,
    onError: () => {
      console.error("Error fetching order stats");
    },
  });

  useEffect(() => {
    window.addEventListener("orderUpdated", refetchOrders);

    return () => {
      window.removeEventListener("orderUpdated", refetchOrders);
    };
  }, [refetchOrders]);

  if (ordersLoading || statsLoading) {
    return <Loader />;
  }

  if (ordersError || statsError) {
    return (
      <p className="text-center text-gray-600 pt-10">
        Error loading data. Please try again later.
      </p>
    );
  }

  if (!stats) {
    return (
      <p className="text-center text-gray-600 pt-10">
        No statistics available.
      </p>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-3 container pt-28">
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white shadow-xl rounded-xl p-6">
        <div>
          {/* Responsive Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-4">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-2xl font-bold">{stats.Total_Orders}</p>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold whitespace-nowrap">
                Complete Payment
              </h3>
              <p className="text-2xl font-bold">{stats.Completed_Payments}</p>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Pending Payment</h3>
              <p className="text-2xl font-bold">{stats.Pending_Payments}</p>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold whitespace-nowrap">
                Total Payment Amount
              </h3>
              <p className="text-2xl font-bold">
                {stats["Total Payments Amount"]} ৳
              </p>
            </div>
            <div className="bg-yellow-800 text-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Total Order Amount</h3>
              <p className="text-2xl font-bold">
                {stats["Total Order Amount"]} ৳
              </p>
            </div>
          </div>

          {/* Order History Table */}
          <h2 className="text-center text-2xl mt-5 font-bold text-gray-800 mb-3 whitespace-nowrap">
            Your Order History
          </h2>

          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-lg">Flower</th>
                  <th className="p-3 text-lg">Price</th>
                  <th className="p-3 text-lg">Quantity</th>
                  <th className="p-3 text-lg">Status</th>
                  <th className="p-3 text-lg">Transaction ID</th>
                  <th className="p-3 text-lg">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200">
                      <td className="p-3 whitespace-nowrap">{order.flower}</td>
                      <td className="p-3 whitespace-nowrap">{order.price} ৳</td>
                      <td className="p-3 whitespace-nowrap">
                        {order.quantity}
                      </td>
                      <td
                        className={`p-3 whitespace-nowrap font-semibold ${
                          order.status === "Completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </td>
                      <td className="p-3 whitespace-nowrap text-blue-600 font-medium">
                        {order.transaction_id || "N/A"}
                      </td>
                      <td className="whitespace-nowrap">
                        {Time(order.order_date)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-3 text-red-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
