import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axios.get(
        `${baseUrl}/user/user_detail/${userId}/`
      );
      return response.data;
    },
    onError: () => {
      toast.error("Failed to fetch profile data");
    },
  });

  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    profile_img: "",
  });

  useEffect(() => {
    if (profileData) {
      setProfile({
        username: profileData.username || "",
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        profile_img: profileData.profile_img || "",
      });
    }
  }, [profileData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile) => {
      const token = localStorage.getItem("auth_token");
      const response = await axios.put(
        `${baseUrl}/user/user_detail/${userId}/`,
        {
          username: updatedProfile.username,
          first_name: updatedProfile.first_name,
          last_name: updatedProfile.last_name,
          email: updatedProfile.email,
          profile: {
            profile_img: updatedProfile.profile_img,
          },
        },
        {
          headers: {
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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  return (
    <section className="pt-28 mb-12">
      <Helmet>
        <title>Profile</title>
      </Helmet>

      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Welcome back,{" "}
              <span className="text-indigo-600">{profile.username}</span>
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Manage your profile information
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex flex-col items-center justify-center">
                <div className="relative group">
                  <img
                    key={profile.profile_img}
                    src={`${profile.profile_img}?t=${new Date().getTime()}`}
                    alt="Profile"
                    className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-indigo-100">{profile.email}</p>
              </div>

              <div className="md:w-2/3 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        updateProfileMutation.isLoading
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
