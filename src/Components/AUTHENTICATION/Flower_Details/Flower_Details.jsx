import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";
import CommentSection from "./CommentSection";
import OrderSection from "./OrderSection";
import PaymentSection from "./PaymentSection";

const Flower_Details = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("flower_id");
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");

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
    return data;
  };

  const { data: orderCheckData } = useQuery({
    queryKey: ["orderCheck", id],
    queryFn: checkOrderStatus,
    enabled: !!id && !!loggedInUser,
  });

  const canComment = orderCheckData?.can_comment;
  const orderStatus = orderCheckData?.order_status;

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

                <OrderSection flower={flower} orderStatus={orderStatus} />

                <PaymentSection flowerId={id} canComment={canComment} orderStatus={orderStatus} />

                <button
                  onClick={() =>
                    document.getElementById("commentSection").classList.toggle("hidden")
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  Leave a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CommentSection flowerId={id} loggedInUser={loggedInUser} />
    </div>
  );
};

export default Flower_Details;