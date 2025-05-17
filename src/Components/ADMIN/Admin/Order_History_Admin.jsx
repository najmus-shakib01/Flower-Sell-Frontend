import { Helmet } from "react-helmet-async";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";
import Time from "../../../ConstData/Time";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Order_History_Admin = () => {
  const token = localStorage.getItem("auth_token");

  // Fetch all orders
  const fetchOrders = async () => {
    const { data } = await axios.get(`${baseUrl}/order/all_order/`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return data;
  };

  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchOrders,
    enabled: !!token,
  });

  // Fetch order statistics
  const fetchStats = async () => {
    const { data } = await axios.get(`${baseUrl}/order/user_order_stats/`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return data;
  };

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["orderStats"],
    queryFn: fetchStats,
    enabled: !!token,
  });

  if (!token) {
    return (
      <div className="text-center pt-28">
        <p className="text-red-500">Authentication required. Please log in.</p>
      </div>
    );
  }

  if (ordersLoading || statsLoading) {
    return <Loader />;
  }

  if (ordersError || statsError) {
    return (
      <div className="text-center pt-28">
        <p className="text-red-500">
          Error loading data: {ordersError?.message || statsError?.message}
        </p>
      </div>
    );
  }

  return (
    <section>
      <Helmet>
        <title>Order History Admin</title>
      </Helmet>
      <h2 className="text-3xl font-bold mb-4 text-center pt-28">
        All User Order History
      </h2>

      {/* Statistics Cards */}
      {stats && (
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
          <div className="bg-red-800 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Profit</h3>
            <p className="text-2xl font-bold">{stats["Total Profit"]} ৳</p>
          </div>
          <div className="bg-yellow-800 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Order Amount</h3>
            <p className="text-2xl font-bold">
              {stats["Total Order Amount"]} ৳
            </p>
          </div>
        </div>
      )}

      <div className="container max-w-screen-xl mx-auto px-4 py-6">
        {/* Responsive Scrollable Table */}
        <div className="overflow-x-auto bg-white p-3 shadow-md rounded-lg">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  User
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Flower
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Price
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Status
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Order Date
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {order.user}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {order.flower}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {order.price} ৳
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {order.quantity}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-bold whitespace-nowrap ${
                      order.status === "Completed"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {Time(order.order_date)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {order.transaction_id || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Order_History_Admin;
