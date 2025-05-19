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
    <section>
      <div className="pt-24">
        <Helmet>
          <title>Profile</title>
        </Helmet>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-center">
              Welcome {profile.username}
            </h1>
            <div className="flex justify-center items-center mt-6 p-6">
              <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
                <form
                  encType="multipart/form-data"
                  className="space-y-4"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col items-center">
                    <img
                      key={profile.profile_img}
                      src={`${profile.profile_img}?t=${new Date().getTime()}`}
                      alt="Profile"
                      className="w-60 h-60 object-cover rounded-full mx-auto"
                    />
                  </div>
                  <div>
                    <label className="label font-semibold">Username</label>
                    <input
                      type="text"
                      className="input input-bordered w-full bg-gray-300"
                      name="username"
                      value={profile.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label font-semibold">First Name</label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-gray-300"
                        name="first_name"
                        value={profile.first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="label font-semibold">Last Name</label>
                      <input
                        type="text"
                        className="input input-bordered w-full bg-gray-300"
                        name="last_name"
                        value={profile.last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label font-semibold">Email</label>
                    <input
                      type="email"
                      className="input input-bordered w-full bg-gray-300"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={updateProfileMutation.isLoading}
                  >
                    {updateProfileMutation.isLoading
                      ? "Updating..."
                      : "Update Profile"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
