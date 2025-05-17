import { Trash } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../../ConstData/Loader";
import Time from "../../../ConstData/Time";
import { baseUrl } from "../../../constants/env.constants";

const Cart = () => {
  const token = localStorage.getItem("auth_token");
  const queryClient = useQueryClient();
  const [showFullDescription, setShowFullDescription] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);

  const fetchCartItems = async () => {
    const response = await axios.get(`${baseUrl}/flower/cart/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
    });
    return response.data;
  };

  const {
    data: cartItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartItems,
    enabled: !!token,
    onError: () => {
      toast.error("Failed to load cart!");
    },
    onSuccess: (data) => {
      if (!Array.isArray(data) && !Array.isArray(data?.data)) {
        console.error("Unexpected API response:", data);
        toast.error("Failed to load cart!");
      }
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id) => {
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
    },
    onSuccess: () => {
      toast.success("Removed from cart!");
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove!");
    },
  });

  // Handle confirm delete
  const handleConfirmDelete = (id) => {
    setDeleteItemId(id);
    document.getElementById("confirmDeleteModal").showModal();
  };

  const handleRemoveFromCart = async () => {
    if (!deleteItemId) return;
    removeFromCartMutation.mutate(deleteItemId);
    document.getElementById("confirmDeleteModal").close();
  };

  const toggleDescription = (id) => {
    setShowFullDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  if (!token) {
    toast.error("You need to log in first!");
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error loading cart data.</p>;
  }

  const items = Array.isArray(cartItems) ? cartItems : cartItems?.data || [];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-3 container pt-28">
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <div className="bg-white h-auto shadow-xl rounded-xl p-6">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-5">
          Cart Items
        </h2>

        <p className="text-center text-lg font-semibold mb-5 text-gray-600">
          Total Items : {items.length} {" || "}
          Total Price : <b>৳</b>
          {items
            .reduce((total, item) => total + Number(item.flower_price || 0), 0)
            .toFixed(2)}
        </p>

        {items.length === 0 ? (
          <p className="text-center text-lg text-gray-600 mt-5">
            No items in the cart.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 rounded-lg text-sm sm:text-base">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-2 py-2 whitespace-nowrap">Sl.</th>
                  <th className="px-2 py-2 whitespace-nowrap">Flower</th>
                  <th className="px-2 py-2 whitespace-nowrap">Title</th>
                  <th className="px-2 py-2 whitespace-nowrap">Price</th>
                  <th className="px-2 py-2 whitespace-nowrap">Description</th>
                  <th className="px-2 py-2 whitespace-nowrap">Stock</th>
                  <th className="px-2 py-2 whitespace-nowrap">Category</th>
                  <th className="px-2 py-2 whitespace-nowrap">Cart Add Time</th>
                  <th className="px-2 py-2 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-2 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <img
                        src={item.flower_image}
                        alt={item.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {item.flower}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <strong>৳</strong>
                      {item.flower_price}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {showFullDescription[item.id]
                        ? item.flower_description
                        : `${item.flower_description.slice(0, 20)}...`}
                      <button
                        onClick={() => toggleDescription(item.id)}
                        className="text-blue-400 underline"
                      >
                        {showFullDescription[item.id]
                          ? " See Less"
                          : " See All"}
                      </button>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {item.flower_stock}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {item.flower_category}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {Time(item.added_at)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleConfirmDelete(item.id);
                        }}
                      >
                        <Trash className="w-5 h-5 text-red-700" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <dialog id="confirmDeleteModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            Do you really want to remove this item from the cart?
          </p>
          <div className="modal-action">
            <button onClick={handleRemoveFromCart} className="btn btn-error">
              Yes, Remove
            </button>
            <button
              onClick={() =>
                document.getElementById("confirmDeleteModal").close()
              }
              className="btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Cart;
