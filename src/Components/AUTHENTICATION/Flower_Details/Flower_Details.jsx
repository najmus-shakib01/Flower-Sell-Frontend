import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  // Initialize user data
  useEffect(() => {
    const user = localStorage.getItem("UserName");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Fetch flower details
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

  // Check order status
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

  // Fetch comments
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

  // Comment mutations
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

  // Order mutations
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

  // Payment handler
  const handlePayment = async () => {
    const token = localStorage.getItem("auth_token");

    try {
      // First check if user has ordered the flower
      const { data: orderData } = await axios.get(
        `${baseUrl}/flower/comment_check_order/?flower_id=${id}`,
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );

      if (!orderData.can_comment) {
        toast.error("❌ You must order this flower before making a payment!");
        return;
      }

      // Proceed with payment
      const { data: paymentData } = await axios.get(
        `${baseUrl}/payments/payment_detail/${id}/`,
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
    }
  };

  // Comment handlers
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
    return <p className="text-center text-red-500">Flower not found!</p>;

  return (
    <div className="container mx-auto max-w-screen-xl px-6 py-3 pt-28">
      <Helmet>
        <title>Flower Details</title>
      </Helmet>
      {flower && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <figure>
            <img
              src={flower.image}
              alt={flower.title}
              className="w-full h-72 object-cover"
            />
          </figure>

          <div className="p-6">
            <h1 className="text-2xl font-bold">{flower.title}</h1>
            <p className="text-gray-600 mt-2">{flower.description}</p>
            <p className="text-lg font-bold text-primary mt-2">
              <b>৳</b>
              {flower.price}
            </p>
            <p className="text-gray-600 text-lg mt-2">
              Product In Stock {" -> "} {flower.stock}
            </p>
            <p className="text-sm font-semibold mt-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg w-max">
              {flower.category}
            </p>

            {/* Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Link to={"/auth_home"} className="btn btn-primary w-full">
                Back
              </Link>
              <button
                className="btn btn-secondary w-full"
                onClick={() =>
                  document.getElementById("orderModal").showModal()
                }
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Ordering..." : "Order Now"}
              </button>
              <button
                className="btn btn-accent w-full"
                onClick={handlePayment}
                disabled={!canComment}
              >
                Payment
              </button>
              <button
                className="btn btn-warning w-full"
                onClick={() =>
                  document
                    .getElementById("commentSection")
                    .classList.toggle("hidden")
                }
              >
                Comment
              </button>
            </div>

            {/* Comment Section */}
            <div
              id="commentSection" 
              className="hidden mt-4 p-4 border rounded-lg"
            >
              <h3 className="text-lg font-bold">Leave a Comment</h3>
              <textarea
                className="textarea focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full mt-2"
                placeholder="Your comment..."
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                disabled={addCommentMutation.isPending}
              ></textarea>
              <button
                className="btn btn-success mt-2"
                onClick={handleCommentSubmit}
                disabled={addCommentMutation.isPending}
              >
                {addCommentMutation.isPending
                  ? "Submitting..."
                  : "Submit Comment"}
              </button>
            </div>

            {/* Order Modal */}
            <dialog id="orderModal" className="modal">
              <div className="modal-box bg-white">
                <h3 className="text-lg font-bold">Place Your Order</h3>
                <input
                  type="number"
                  className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full mt-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
                <div className="modal-action">
                  <button
                    className="btn btn-primary"
                    onClick={handleOrder}
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? "Ordering..." : "Order"}
                  </button>
                  <button
                    className="btn"
                    onClick={() =>
                      document.getElementById("orderModal").close()
                    }
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      )}

      {/* comment display */}
      <h3 className="text-2xl font-bold text-center mt-4">User Reviews</h3>

      {commentsLoading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <div className="flex flex-col justify-center items-center pt-28">
          <p className="text-lg font-medium text-gray-700">No reviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border rounded-lg bg-gray-100 shadow-md"
            >
              <div className="flex items-center gap-3">
                <img
                  className="rounded-full object-cover w-12 h-12"
                  alt={comment.user}
                  src={comment.profile_img}
                />
                <p className="text-lg font-semibold">{comment.user}</p>
              </div>
              <p className="mt-2 text-gray-700">{comment.body}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(comment.created_on).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: true,
                })}
              </p>

              {comment.user === loggedInUser && (
                <div className="flex gap-3 mt-3">
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditCommentText(comment.body);
                      document.getElementById("editModal").showModal();
                    }}
                    disabled={editCommentMutation.isPending}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDeleteComment(comment.id)}
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

      {/* Edit Comment Modal */}
      <dialog id="editModal" className="modal">
        <div className="modal-box bg-white">
          <h3 className="text-lg font-bold">Edit Comment</h3>
          <textarea
            className="textarea focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full mt-2"
            value={editCommentText}
            onChange={(e) => setEditCommentText(e.target.value)}
            disabled={editCommentMutation.isPending}
          ></textarea>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={() => handleEditComment(editingComment)}
              disabled={editCommentMutation.isPending}
            >
              {editCommentMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              className="btn"
              onClick={() => {
                document.getElementById("editModal").close();
                setEditingComment(null);
                setEditCommentText("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Flower_Details;
