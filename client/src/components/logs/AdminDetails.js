import { useState, useEffect } from "react";
import constant from "../../constant";
const AdminDetails = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      const userId = localStorage.getItem("userId");
      console.log(userId);
      if (userId) {
        try {
          const response = await fetch(
            `${constant.apiUrl}/auth/users/${userId}`
          );
          const result = await response.json();
          if (response.ok) {
            setUserDetails(result);
          } else {
            setError(result.message);
          }
        } catch (err) {
          setError("An error occurred while fetching user details.");
        }
      } else {
        setError("User ID not found in local storage.");
      }
    };

    fetchAdminData();
  }, []);

  return { userDetails, error };
};

export default AdminDetails;
