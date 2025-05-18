/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    profile_img: "",
  });

  const fetchProfile = () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/user/user_detail/${userId}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Profile Data (After Update):", data);
        if (data && typeof data === "object") {
          setProfile({
            ...data,
            profile_img: data.profile_img || "",
          });
        } else {
          toast.error("User not found!");
        }
      })
      .catch(() => toast.error("Failed to fetch profile data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
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

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(`${baseUrl}/user/user_detail/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        fetchProfile();
      } else {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);
        toast.error(errorData.message || "Failed to update profile!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <section>
      <div className="pt-24">
        <Helmet>
          <title>Profile</title>
        </Helmet>
        {loading ? (
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
                  <button type="submit" className="btn btn-primary w-full">
                    Update Profile
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
