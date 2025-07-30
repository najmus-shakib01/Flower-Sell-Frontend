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
    try {
      const response = await axios.get(`${baseUrl}/order/my_order/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch orders", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/order/one_user_order_stats/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch stats", error);
    }
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
    onError: (error) => {
      toast.error(error.message);
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
    onError: (error) => {
      console.error(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      refetchOrders();
    }
  }, [token, refetchOrders]);

  if (ordersLoading || statsLoading) {
    return <Loader />;
  }

  if (ordersError || statsError) {
    return (
      <div className="text-center text-gray-600 pt-10">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-3 container pt-28">
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white shadow-xl rounded-xl p-6">
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-700">
            <strong>Debug Info:</strong> {orders?.length} orders found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats?.Total_Orders || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Completed Orders
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats?.Completed_Payments || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Orders
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats?.Pending_Payments || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ৳{stats?.["Total Payments Amount"] || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Order Amount
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ৳{stats?.["Total Order Amount"] || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-4">
          Your Order History
        </h2>

        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Flower</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="p-3 text-lg">Transaction ID</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{order.flower || "N/A"}</td>
                    <td className="py-3 px-4">
                      {order.price ? `${order.price} ৳` : "N/A"}
                    </td>
                    <td className="py-3 px-4">{order.quantity || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-blue-600 font-medium">
                      {order.transaction_id || "N/A"}
                    </td>
                    <td className="py-3 px-4">{Time(order.order_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders found</p>
            <button
              onClick={() => refetchOrders()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
