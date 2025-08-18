import { useEffect, useState } from "react";

const ImageSlider = () => {
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

  return (
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
  );
};

export default ImageSlider;
