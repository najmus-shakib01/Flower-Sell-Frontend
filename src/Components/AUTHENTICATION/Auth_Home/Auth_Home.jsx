import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../../ConstData/Loader";
import { baseUrl } from "../../../constants/env.constants";
import BehindTheScenesAndCareTips from "./BehindTheScenesAndCareTips";
import FloralArrangementIdeas from "./FloralArrangementIdeas";
import FlowerFilter from "./FlowerFilter";
import ImageSlider from "./ImageSlider";
import SeasonalFlowers from "./SeasonalFlowers";

const Auth_Home = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const navigate = useNavigate();

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
  const fetchFlowers = async () => {
    const response = await axios.get(`${baseUrl}/flower/flower_all/`);
    return response.data;
  };


  const {
    data: flowers,
    isLoading: flowersLoading,
  } = useQuery({
    queryKey: ["flowers"],
    queryFn: fetchFlowers,
    onError: () => {
      toast.error("Failed to fetch flowers");
    },
  });

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
    if (filter === "All") {
      setFilteredFlowers(flowers);
    } else {
      setFilteredFlowers(
        flowers.filter(
          (flower) => flower.category.toLowerCase() === filter.toLowerCase()
        )
      );
    }
  };

  // Handle add to cart
  const handleAddToCart = (flower) => {
    addToCartMutation.mutate(flower);
  };

  useEffect(() => {
    if (flowers) {
      setFilteredFlowers(flowers);
    }
  }, [flowers]);

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

        {/*Flower Category Filter*/}
        <section>
          <h1 className="text-center text-3xl font-bold">Our Flowers</h1>
          {/*  */}
          <div className="container mt-6">
            <FlowerFilter
              filters={filters}
              selectedFilter={selectedFilter}
              handleFilterClick={handleFilterClick}
              totalFlowers={filteredFlowers.length}
            />
          </div>
        </section>

        {/* Our Flower Listing */}
        <section>
          {flowersLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8 lg:grid-cols-3 gap-8">
              {filteredFlowers
                .sort((a, b) => a.id - b.id)
                .map((flower) => (
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
        </section>
      </section>
    </>
  );
};

export default Auth_Home;
