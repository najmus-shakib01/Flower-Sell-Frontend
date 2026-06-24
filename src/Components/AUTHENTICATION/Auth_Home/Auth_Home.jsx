import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../../ConstData/Loader";
import { baseUrl } from "../../../constants/env.constants";
import BehindTheScenesAndCareTips from "./BehindTheScenesAndCareTips";
import FloralArrangementIdeas from "./FloralArrangementIdeas";
import FlowerFilter from "./FlowerFilter";
import ImageSlider from "./ImageSlider";
import SeasonalFlowers from "./SeasonalFlowers";

const Auth_Home = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const setCurrentPage = (newPage) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      if (typeof newPage === "function") {
        nextParams.set("page", newPage(currentPage).toString());
      } else {
        nextParams.set("page", newPage.toString());
      }
      return nextParams;
    });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Flower filtering
  const filters = [
    "All",
    "Calla Lilies",
    "Carnations",
    "Daisies",
    "Gardenias",
    "Delphiniums",
    "Zinnias",
    "Alstroemeria",
    "Buttercups",
    "Queen Anne’s",
  ];

  // Fetch flowers
  const fetchFlowers = async ({ queryKey }) => {
    const [, page, category, search] = queryKey;
    const response = await axios.get(
      `${baseUrl}/flower/flower_all/?page=${page}&category=${category}&search=${search}`
    );
    return response.data;
  };

  const {
    data,
    isLoading: flowersLoading,
  } = useQuery({
    queryKey: ["flowers", currentPage, selectedFilter, searchQuery],
    queryFn: fetchFlowers,
    onError: () => {
      toast.error("Failed to fetch flowers");
    },
  });

  const flowersList = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 6);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (flower) => {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `${baseUrl}/flower/cart/`,
        {
          flower: flower.id,
          title: flower.title,
          price: flower.price,
          description: flower.description,
          stock: flower.stock,
          category: flower.category,
          image: flower.image,
          quantity: 1,
        },
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
      toast.success("Flower added to cart successfully!");
      queryClient.invalidateQueries(["cart"]);
      navigate("/cart");
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data?.message || "Product Already Added to Your Cart!"
      );
    },
  });

  // Handle filter click
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter.toLowerCase());
    setCurrentPage(1);
  };

  // Handle add to cart
  const handleAddToCart = (flower) => {
    addToCartMutation.mutate(flower);
  };

  return (
    <>
      <Helmet>
        <title>Flower Sell</title>
      </Helmet>

      <section className="container mx-auto max-w-screen-xl px-6 py-3">
        {/* Slide Section */}
        <section className="mt-24">
          <ImageSlider />
        </section>

        {/* Seasonal Flowers Section */}
        <section>
          <SeasonalFlowers />
        </section>

        {/* Floral Arrangement Ideas */}
        <section>
          <FloralArrangementIdeas />
        </section>

        {/* Behind The Scenes &  */}
        <section>
          <BehindTheScenesAndCareTips />
        </section>

        {/* Search Bar Section */}
        <section className="mt-8 flex justify-center">
          <div className="w-full max-w-md flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-300">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search flowers by name..."
              className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="text-gray-400 hover:text-gray-600 font-bold px-2"
              >
                ✕
              </button>
            )}
          </div>
        </section>

        {/*Flower Category Filter*/}
        <section>
          <h1 className="text-center text-3xl font-bold mt-12">Our Flowers</h1>
          {/*  */}
          <div className="container mt-6">
            <FlowerFilter
              filters={filters}
              selectedFilter={selectedFilter}
              handleFilterClick={handleFilterClick}
              totalFlowers={totalCount}
            />
          </div>
        </section>

        {/* Our Flower Listing */}
        <section>
          {flowersLoading ? (
            <Loader />
          ) : (
            <>
              {flowersList.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-500 font-medium">No flowers found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8 lg:grid-cols-3 gap-8">
                  {flowersList.map((flower) => (
                    <div
                      key={flower.id}
                      className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl  hover:-translate-y-2"
                    >
                      <figure>
                        <img
                          src={flower.image}
                          alt={flower.title}
                          className="w-full h-56 object-cover"
                        />
                      </figure>
                      <div className="p-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {flower.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {flower.description.slice(0, 60)}...
                        </p>
                        <p className="text-gray-600 text-md mt-2">
                          <span className="font-semibold">In Stock:</span>{" "}
                          {flower.stock}
                        </p>
                        <p className="text-xl font-semibold mt-2 text-blue-600">
                          ৳{flower.price}
                        </p>
                        <p className="text-sm font-semibold mt-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg w-max">
                          {flower.category}
                        </p>
                        <div className="flex gap-3 mt-5">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300"
                            onClick={() =>
                              navigate(`/flower_details/?flower_id=${flower.id}`)
                            }
                          >
                            Details
                          </button>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300"
                            onClick={() => handleAddToCart(flower)}
                          >
                            <span>Add To Cart</span>
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Pagination Section */}
        {!flowersLoading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 mb-8 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              ❮
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 font-bold rounded-lg transition-colors duration-200 ${
                  currentPage === pageNum
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              ❯
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Auth_Home;
