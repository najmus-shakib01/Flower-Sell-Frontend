import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../../ConstData/Loader";
import { baseUrl } from "../../../constants/env.constants";

const Auth_Home = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const navigate = useNavigate();

  //slide flower
  const images = ["/demp.png", "/calimg5.png", "/calimg11.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const goToPreviousSlide = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? images.length - 1 : currentIndex - 1);
  };

  const goToNextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

  // Seasonal Flowers Data
  const seasonal_flowers = [
    {
      id: 1,
      src: "/spring_flower.jpg",
      title: "Spring Blooms",
      desc: "Explore vibrant flowers that flourish in spring.",
    },
    {
      id: 2,
      src: "/summer_flower.jpg",
      title: "Summer Radiance",
      desc: "Enjoy the colors of summer with these beautiful flowers.",
    },
    {
      id: 3,
      src: "/autumn_flower.jpg",
      title: "Autumn Hues",
      desc: "Discover the rich tones of autumn blooms.",
    },
    {
      id: 4,
      src: "/winter_flower.jpg",
      title: "Winter Whites",
      desc: "Find the elegance of winter flowers.",
    },
  ];

  // Floral Arrangement Ideas
  const floral_arrangement_ideas = [
    {
      id: 1,
      src: "/wedding_arrangement.jpg",
      title: "Wedding Centerpiece",
      desc: "Elegant floral arrangements for your special day.",
    },
    {
      id: 2,
      src: "/home_decoration.jpg",
      title: "Home Decoration",
      desc: "Add beauty to your home with these ideas.",
    },
    {
      id: 3,
      src: "/table_setting.jpg",
      title: "Table Settings",
      desc: "Beautiful centerpieces for your dining table.",
    },
  ];

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

  // Fetch care tips
  const fetchCareTips = async () => {
    const response = await axios.get(`${baseUrl}/flower/care_tips/`);
    return response.data;
  };

  const {
    data: flowers,
    isLoading: flowersLoading,
    isError: flowersError,
  } = useQuery({
    queryKey: ["flowers"],
    queryFn: fetchFlowers,
    onError: () => {
      toast.error("Failed to fetch flowers");
    },
  });

  const {
    data: careTips,
    isLoading: careTipsLoading,
    isError: careTipsError,
  } = useQuery({
    queryKey: ["careTips"],
    queryFn: fetchCareTips,
    onError: () => {
      toast.error("Failed to fetch care tips");
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

  if (flowersLoading || careTipsLoading) {
    return <Loader />;
  }

  if (flowersError || careTipsError) {
    return <p className="text-center text-red-500">Error loading data.</p>;
  }

  return (
    <>
      <Helmet>
        <title>Flower Sell</title>
      </Helmet>

      <section className="container mx-auto max-w-screen-xl px-6 py-3">
        {/* Slide Section */}
        <section className="mt-24">
          <div className="w-full max-w-7xl mx-auto relative mt-8">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={images[currentIndex]}
                alt="Slide"
                className="w-full h-96 transition duration-500"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                onClick={goToPreviousSlide}
                className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-r hover:bg-opacity-75"
              >
                ❮
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button
                onClick={goToNextSlide}
                className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-l hover:bg-opacity-75"
              >
                ❯
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                    currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Flowers Section */}
        <section>
          <h1 className="text-3xl mt-6 text-center font-bold">
            Seasonal Flowers
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {seasonal_flowers.map((seasonal_flowers) => (
              <div
                key={seasonal_flowers.id}
                className="card card-compact bg-white shadow-xl rounded-md"
              >
                <figure>
                  <img
                    src={seasonal_flowers.src}
                    alt={seasonal_flowers.title}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{seasonal_flowers.title}</h2>
                  <p>{seasonal_flowers.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floral Arrangement Ideas */}
        <section>
          <h1 className="text-3xl mt-6 text-center font-bold">
            Floral Arrangement Ideas
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-8">
            {floral_arrangement_ideas.map((floral_arrangement_ideas) => (
              <div
                key={floral_arrangement_ideas.id}
                className="card card-compact bg-white shadow-xl rounded-md"
              >
                <figure>
                  <img
                    src={floral_arrangement_ideas.src}
                    alt={floral_arrangement_ideas.title}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {floral_arrangement_ideas.title}
                  </h2>
                  <p>{floral_arrangement_ideas.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Behind The Scenes */}
        <section>
          <div className="bg-[#dbf7f9] rounded-lg">
            <div className="max-w-5xl mx-auto text-center px-6 mt-9 p-5">
              <h2 className="text-3xl font-bold text-gray-800">
                Behind The Scenes
              </h2>
              <div className="flex gap-10 flex-col md:flex-row items-center mt-9">
                <img
                  src="/flower_preparation2.jpg"
                  alt="Flower Preparation"
                  className="w-full md:w-1/2 h-64 rounded-lg"
                />
                <div className="md:w-1/2 text-gray-700">
                  <p className="text-lg">
                    See how our beautiful flowers are prepared and arranged
                    before they reach you. We take great care in selecting the
                    freshest blooms and creating stunning arrangements for every
                    occasion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flower Care Tips */}
        <section>
          <div className="max-w-screen-xl mx-auto py-3">
            <h2 className="text-center text-3xl font-bold">Flower Care Tips</h2>
            <p className="text-center text-gray-700 mb-8">
              Learn how to take care of your flowers with expert tips.
            </p>

            {careTipsLoading ? (
              <Loader />
            ) : (
              <div style={{ lineHeight: "30px" }}>
                {careTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold text-primary">
                      🌿 {tip.plant_name}
                    </h3>
                    <p>
                      <b>Symptoms : </b> {tip.symptoms}
                    </p>
                    <p>
                      <b>Revival Steps : </b> {tip.revival_steps}
                    </p>
                    <p>
                      <b>Recommended Fertilizer : </b>{" "}
                      {tip.recommended_fertilizer}
                    </p>
                    <p>
                      <b>Watering Caution : </b> {tip.watering_caution}
                    </p>
                    <p>
                      <b>Sunlight Adjustment : </b> {tip.sunlight_adjustment}
                    </p>
                    <p>
                      <b>Sunlight Needs : </b> {tip.sunlight_needs}
                    </p>
                    <p>
                      <b>Recommended Water Frequency : </b>{" "}
                      {tip.recommended_water_frequency}
                    </p>
                    <p>
                      <b>Created At : </b>{" "}
                      {new Date(tip.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <b>Updated At : </b>{" "}
                      {new Date(tip.updated_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 italic">
                      <b>Special Notes : </b>{" "}
                      {tip.special_notes || "No special notes"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Our Flower */}
        <section>
          <h1 className="text-center text-3xl font-bold">Our Flowers</h1>
          {/* Flower Category Filter */}
          <div className="container mt-6">
            <div className="bg-gray-200 text-black rounded-2xl shadow-xl p-6">
              <h3 className="text-center text-2xl font-bold text-gray-700 mb-4">
                Flower Filter
              </h3>
              <ul className="flex flex-wrap justify-center gap-3 px-4 py-4">
                {filters.map((filter) => (
                  <li
                    key={filter}
                    className={`px-5 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm md:text-base font-[var(--e-global-typography-accent-font-family)] text-[var(--e-global-typography-accent-font-size)] uppercase leading-[var(--e-global-typography-accent-line-height)] tracking-[var(--e-global-typography-accent-letter-spacing)] border border-[var(--e-global-color-d49ac81)] ${
                      selectedFilter === filter.toLowerCase()
                        ? "bg-gradient-to-r from-[#b47cfd] to-[#ff7fc2] text-white shadow-[inset_-25px_0px_20px_-10px_#FFB07B] scale-105"
                        : "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-white"
                    }`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter}
                  </li>
                ))}
              </ul>
              <div className="text-center mt-3">
                <b className="text-gray-800 text-lg">
                  Total Flowers: {filteredFlowers.length}!
                </b>
              </div>
            </div>
          </div>

          {/* Flower Listing */}
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
