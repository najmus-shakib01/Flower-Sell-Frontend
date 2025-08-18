import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";

// eslint-disable-next-line react/prop-types
const CommentSection = ({ flowerId, loggedInUser }) => {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const fetchComments = async () => {
    const token = localStorage.getItem("auth_token");
    const { data } = await axios.get(`${baseUrl}/flower/comment_show/${flowerId}/`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return data;
  };

  const checkOrderStatus = async () => {
    const token = localStorage.getItem("auth_token");
    const { data } = await axios.get(
      `${baseUrl}/flower/comment_check_order/?flower_id=${flowerId}`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    return data.can_comment;
  };

  const { data: canComment } = useQuery({
    queryKey: ["canComment", flowerId],
    queryFn: checkOrderStatus,
    enabled: !!flowerId && !!loggedInUser,
  });

  const {
    data: comments = [],
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", flowerId],
    queryFn: fetchComments,
    enabled: !!flowerId,
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
      toast.error(error.response?.data?.message || "❌ Failed to update comment!");
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
      toast.error(error.response?.data?.message || "❌ Failed to delete comment!");
    },
  });

  const handleCommentSubmit = () => {
    if (!canComment) {
      toast.error("❌ You must order this flower to comment!");
      return;
    }
    addCommentMutation.mutate({ flower: flowerId, body: newComment });
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

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-center mb-8">Customer Reviews</h3>

      <div id="commentSection" className="hidden mt-8 p-6 bg-gray-50 rounded-lg">
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

      {commentsLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
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
                    {new Date(comment.created_on).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
              disabled={editCommentMutation.isPending || !editCommentText.trim()}
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

export default CommentSection;