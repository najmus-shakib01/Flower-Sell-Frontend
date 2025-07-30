import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";

const Flower_Details = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("flower_id");
  const [newComment, setNewComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const user = localStorage.getItem("UserName");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const fetchFlowerDetails = async () => {
    const { data } = await axios.get(`${baseUrl}/flower/flower_detail/${id}/`);
    return data;
  };

  const {
    data: flower,
    isLoading: flowerLoading,
    error: flowerError,
  } = useQuery({
    queryKey: ["flower", id],
    queryFn: fetchFlowerDetails,
    enabled: !!id,
  });

  const checkOrderStatus = async () => {
    const token = localStorage.getItem("auth_token");
    const { data } = await axios.get(
      `${baseUrl}/flower/comment_check_order/?flower_id=${id}`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return data.can_comment;
  };

  const { data: canComment } = useQuery({
    queryKey: ["canComment", id],
    queryFn: checkOrderStatus,
    enabled: !!id && !!loggedInUser,
  });

  const fetchComments = async () => {
    const token = localStorage.getItem("auth_token");
    const { data } = await axios.get(`${baseUrl}/flower/comment_show/${id}/`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return data;
  };

  const {
    data: comments = [],
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: fetchComments,
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (commentData) => {
      const token = localStorage.getItem("auth_token");
      const { data } = await axios.post(
        `${baseUrl}/flower/comment_all/`,
        commentData,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("✅ Comment added successfully!");
      setNewComment("");
      refetchComments();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "❌ Failed to add comment!");
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, commentData }) => {
      const token = localStorage.getItem("auth_token");
      const { data } = await axios.put(
        `${baseUrl}/flower/comment_edit/${commentId}/`,
        commentData,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("✅ Comment updated successfully!");
      document.getElementById("editModal").close();
      setEditingComment(null);
      setEditCommentText("");
      refetchComments();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "❌ Failed to update comment!"
      );
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`${baseUrl}/flower/comment_delete/${commentId}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("✅ Comment deleted successfully!");
      refetchComments();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "❌ Failed to delete comment!"
      );
    },
  });

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
      queryClient.invalidateQueries(["canComment"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "❌ Failed to place order!");
    },
  });

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
        `${baseUrl}/payment/payment_detail/${id}/`,
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

  const handleCommentSubmit = () => {
    if (!canComment) {
      toast.error("❌ You must order this flower to comment!");
      return;
    }
    addCommentMutation.mutate({ flower: id, body: newComment });
  };

  const handleEditComment = (commentId) => {
    editCommentMutation.mutate({
      commentId,
      commentData: { body: editCommentText },
    });
  };

  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };

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

  if (flowerLoading) return <Loader />;
  if (flowerError)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Flower not found!</p>
      </div>
    );

  return (
    <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-3 pt-28">
      <Helmet>
        <title>{flower?.title || "Flower Details"} - Blossom Haven</title>
      </Helmet>

      {flower && (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="relative h-80 sm:h-96 w-full">
            <img
              src={flower.image}
              alt={flower.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {flower.title}
              </h1>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ৳{flower.price}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      flower.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {flower.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{flower.description}</p>

                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {flower.category}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-4">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>

                <button
                  onClick={() =>
                    document.getElementById("orderModal").showModal()
                  }
                  disabled={createOrderMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:bg-indigo-400"
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
                  ) : (
                    "Order Now"
                  )}
                </button>

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

                <button
                  onClick={() =>
                    document
                      .getElementById("commentSection")
                      .classList.toggle("hidden")
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  Leave a Review
                </button>
              </div>
            </div>

            <div
              id="commentSection"
              className="hidden mt-8 p-6 bg-gray-50 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Share your experience with this flower..."
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={addCommentMutation.isPending}
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  disabled={addCommentMutation.isPending || !newComment.trim()}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                  {addCommentMutation.isPending ? (
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
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-8">
          Customer Reviews
        </h3>

        {commentsLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={comment.profile_img}
                    alt={comment.user}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{comment.user}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_on).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{comment.body}</p>

                {comment.user === loggedInUser && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setEditingComment(comment.id);
                        setEditCommentText(comment.body);
                        document.getElementById("editModal").showModal();
                      }}
                      className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                      disabled={editCommentMutation.isPending}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                      disabled={deleteCommentMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <dialog id="editModal" className="modal">
        <div className="modal-box bg-white max-w-md">
          <h3 className="text-xl font-bold mb-4">Edit Your Review</h3>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            rows="4"
            value={editCommentText}
            onChange={(e) => setEditCommentText(e.target.value)}
          ></textarea>
          <div className="modal-action flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                document.getElementById("editModal").close();
                setEditingComment(null);
                setEditCommentText("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleEditComment(editingComment)}
              disabled={
                editCommentMutation.isPending || !editCommentText.trim()
              }
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-indigo-400 transition-colors"
            >
              {editCommentMutation.isPending ? (
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
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Flower_Details;
