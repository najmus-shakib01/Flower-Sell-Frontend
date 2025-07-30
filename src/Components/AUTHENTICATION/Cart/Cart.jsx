import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../../../ConstData/Loader";
import Time from "../../../ConstData/Time";
import { baseUrl } from "../../../constants/env.constants";

const Cart = () => {
  const token = localStorage.getItem("auth_token");
  const queryClient = useQueryClient();
  const [showFullDescription, setShowFullDescription] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${baseUrl}/flower/cart/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      throw new Error("Failed to fetch cart items", error);
    }
  };

  const {
    data: cartItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartItems,
    enabled: !!token,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await axios.delete(
          `${baseUrl}/flower/cart_remove/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `token ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Failed to remove item", error);
      }
    },
    onSuccess: () => {
      toast.success("Item removed from cart!");
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleConfirmDelete = (id) => {
    setDeleteItemId(id);
    document.getElementById("confirmDeleteModal").showModal();
  };

  const handleRemoveFromCart = async () => {
    if (!deleteItemId) return;
    try {
      await removeFromCartMutation.mutateAsync(deleteItemId);
    } finally {
      document.getElementById("confirmDeleteModal").close();
    }
  };

  const toggleDescription = (id) => {
    setShowFullDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!token) {
    toast.error("Please login to view your cart");
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-3 container pt-28">
        <div className="bg-white shadow-xl rounded-xl p-6 text-center">
          <p className="text-red-500 text-lg">Failed to load cart items</p>
          <button
            onClick={() => queryClient.refetchQueries(["cart"])}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.flower_price || 0),
    0
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 container pt-28">
      <Helmet>
        <title>Your Cart - Flower Shop</title>
      </Helmet>

      <div className="bg-white shadow-xl rounded-xl p-4 sm:p-6 ">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
          Your Shopping Cart
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <p className="text-lg font-semibold text-gray-700">
            Total Items:{" "}
            <span className="text-blue-600">{cartItems.length}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Total Price:{" "}
            <span className="text-green-600">৳{totalPrice.toFixed(2)}</span>
          </p>
        </div>

        {cartItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/flowers"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Flowers
            </Link>
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Product</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Added</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.flower_image}
                            alt={item.flower_name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div>
                            <Link
                              to={`/flower_details/?flower_id=${item.flower_id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {item.flower_name}
                            </Link>
                            <p className="text-gray-600 text-sm mt-1">
                              {showFullDescription[item.id]
                                ? item.flower_description
                                : `${item.flower_description.substring(
                                    0,
                                    50
                                  )}...`}
                              <button
                                onClick={() => toggleDescription(item.id)}
                                className="text-blue-500 text-sm ml-1 hover:underline"
                              >
                                {showFullDescription[item.id] ? "Less" : "More"}
                              </button>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">৳{item.flower_price}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.flower_stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.flower_stock > 0
                            ? `${item.flower_stock} available`
                            : "Out of stock"}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {Time(item.added_at)}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleConfirmDelete(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.flower_image}
                      alt={item.flower_name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/flower_details/?flower_id=${item.flower_id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {item.flower_name}
                      </Link>
                      <p className="text-gray-800 font-semibold mt-1">
                        ৳{item.flower_price}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {showFullDescription[item.id]
                          ? item.flower_description
                          : `${item.flower_description.substring(0, 50)}...`}
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-blue-500 text-sm ml-1 hover:underline"
                        >
                          {showFullDescription[item.id] ? "Less" : "More"}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.flower_stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.flower_stock > 0
                        ? `${item.flower_stock} available`
                        : "Out of stock"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {Time(item.added_at)}
                      </span>
                      <button
                        onClick={() => handleConfirmDelete(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <dialog id="confirmDeleteModal" className="modal">
        <div className="modal-box bg-white max-w-md">
          <h3 className="font-bold text-lg">Confirm Removal</h3>
          <p className="py-4">
            Are you sure you want to remove this item from your cart?
          </p>
          <div className="modal-action flex justify-end gap-3">
            <button
              onClick={() =>
                document.getElementById("confirmDeleteModal").close()
              }
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveFromCart}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={removeFromCartMutation.isLoading}
            >
              {removeFromCartMutation.isLoading ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Cart;
