import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import Loader from "../../../ConstData/Loader";
import { baseUrl } from "../../../constants/env.constants";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();

  const fetchProfile = async () => {
    if (!userId) return null;
    const response = await axios.get(`${baseUrl}/user/user_detail/${userId}/`);
    return response.data;
  };

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: fetchProfile,
    onError: () => {
      toast.error("Failed to fetch profile data");
    },
    onSuccess: (data) => {
      if (!data || typeof data !== "object") {
        toast.error("User not found!");
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile) => {
      const token = localStorage.getItem("auth_token");
      const response = await axios.put(
        `${baseUrl}/user/user_detail/${userId}/`,
        updatedProfile,
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
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["profile", userId]);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile!");
    },
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "first_time_using_cloudinary");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/daasda9rp/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;

      if (imageUrl) {
        toast.success("Image uploaded successfully!");

        const updatedProfile = {
          profile: {
            profile_img: imageUrl,
          },
        };
        updateProfileMutation.mutate(updatedProfile);
      } else {
        toast.error("Image upload failed!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      profile: {
        profile_img: profile.profile_img,
      },
    };

    updateProfileMutation.mutate(updatedProfile);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">Error loading profile data.</p>
    );
  }

  if (!profile) {
    return <p className="text-center text-gray-600">No profile data found.</p>;
  }

  return (
    <section>
      <div className="pt-24">
        <Helmet>
          <title>Profile</title>
        </Helmet>
        <h1 className="text-3xl font-bold text-center">
          Welcome {profile.username}
        </h1>
        <div className="flex justify-center items-center mt-6">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
            <form
              encType="multipart/form-data"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col items-center">
                <img
                  src={profile.profile_img}
                  alt="Profile"
                  className="w-52 h-52 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  className="mt-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <label className="label font-semibold">Username</label>
                <input
                  type="text"
                  className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                  name="username"
                  value={profile.username}
                  onChange={(e) =>
                    profile({ ...profile, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label font-semibold">First Name</label>
                  <input
                    type="text"
                    className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                    name="first_name"
                    value={profile.first_name}
                    onChange={(e) =>
                      profile({ ...profile, first_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label font-semibold">Last Name</label>
                  <input
                    type="text"
                    className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                    name="last_name"
                    value={profile.last_name}
                    onChange={(e) =>
                      profile({ ...profile, last_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label font-semibold">Email</label>
                <input
                  type="email"
                  className="input focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 w-full"
                  name="email"
                  value={profile.email}
                  onChange={(e) =>
                    profile({ ...profile, email: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
