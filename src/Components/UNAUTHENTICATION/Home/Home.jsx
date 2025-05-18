import { Helmet } from "react-helmet-async";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const fetchFlowers = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/flower/flower_all/`);
    console.log("Flower Data : ", data);
    return data;
  } catch (err) {
    console.log("Error fetching flowers : ", err);
  }
};

const Home = () => {
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

  // Fetch Flowers using React Query
  const {
    data: flowers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["flowers"],
    queryFn: fetchFlowers,
  });

  return (
    <>
      <Helmet>
        <title>Flower Sell</title>
      </Helmet>
      <div className="container mx-auto max-w-screen-xl px-6 py-3">
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
                className="card card-compact bg-base-600 shadow-xl rounded-md"
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
                className="card card-compact bg-base-600 shadow-xl rounded-md"
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
        {/* Our Flower Section */}
        <section>
          <h1 className="text-3xl mt-6 text-center font-bold">Our Flower</h1>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <p className="text-center text-red-500">Error loading flowers.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 lg:grid-cols-3 gap-8">
              {flowers.map((flower) => (
                <div
                  key={flower.id}
                  className="card bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <figure>
                    <img
                      src={flower.image}
                      alt={flower.title}
                      className="w-full h-52 object-cover"
                    />
                  </figure>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{flower.title}</h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {flower.description.slice(0, 40)}.....
                    </p>
                    <p className="text-lg font-semibold line-clamp-2 mt-2 text-primary">
                      <b>৳</b>
                      {flower.price}
                    </p>
                    <p className="text-lg mt-2 btn btn-primary w-40 whitespace-nowrap">
                      {flower.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
