import { Helmet } from "react-helmet-async";
import { baseUrl } from "../../../constants/env.constants";
import Loader from "../../../ConstData/Loader";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const User = () => {
  const token = localStorage.getItem("auth_token");

  const fetchUsers = async () => {
    const { data } = await axios.get(`${baseUrl}/user/user_all/`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return data;
  };

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: !!token,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center pt-28">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>User List</title>
      </Helmet>
      <h2 className="text-3xl font-bold mb-4 text-center pt-28">User List</h2>
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Profile
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  User ID
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Username
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  First Name
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Last Name
                </th>
                <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={user.profile_img}
                      alt="Profile"
                      className="w-14 h-14 md:w-20 md:h-20 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {user.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {user.first_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {user.last_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {user.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
