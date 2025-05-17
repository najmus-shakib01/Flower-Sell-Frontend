import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";

const Add_Flower = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const imageFile = formData.get("imageInput");

    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", imageFile);
      cloudinaryData.append("upload_preset", "first_time_using_cloudinary");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/daasda9rp/image/upload",
        {
          method: "POST",
          body: cloudinaryData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const cloudinaryResult = await cloudinaryResponse.json();
      const imageUrl = cloudinaryResult.secure_url;

      const flowerData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        stock: parseInt(formData.get("stock")),
        image: imageUrl,
      };

      const response = await fetch(`${baseUrl}/flower/flower_all/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flowerData),
      });

      if (!response.ok) {
        throw new Error("Failed to add flower");
      }
      toast.success("Flower Add Successfully!");
      navigate("/admin_flower_show");
    } catch (error) {
      console.error("Error adding flower:", error);
      toast.error("Failed to add flower. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin | Add Flower</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center text-gray-800 pt-28">
        Add A New Flower
      </h1>
      <div className="container max-w-screen-xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <img
            className="object-cover rounded-lg w-full"
            src="./image/add.png"
            alt="Add Image"
          />
        </div>
        {/* Post Form */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
          {/* Form Section */}
          <div className="w-full">
            <form
              id="create-post-form"
              className="space-y-6"
              encType="multipart/form-data"
              method="post"
              onSubmit={handleSubmit}
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 block w-full px-4 py-2 input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  placeholder="Flower Name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="mt-1 block w-full px-4 py-2 input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  placeholder="Flower Description"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="mt-1 block w-full px-4 py-2 input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  placeholder="Flower Price"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  htmlFor="imageInput"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="imageInput"
                  name="imageInput"
                  className="mt-1 block w-full px-4 py-2 input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  className="mt-1 block w-full px-4 py-2 input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  placeholder="Flower Category"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  className="mt-1 block w-full px-4 py-2 input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                  placeholder="Flower Stock"
                  required
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 btn btn-accent"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Flower;
