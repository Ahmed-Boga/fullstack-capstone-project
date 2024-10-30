import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const { setUserName } = useAppContext();
  const [statusMessage, setStatusMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name = sessionStorage.getItem("name");

      if (authtoken && email && name) {
        const storedUserDetails = { name, email };
        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setStatusMessage("Failed to load profile.");
    }
  };

  const handleEdit = () => setEditMode(true);

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/app/login");
        return;
      }

      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "Email": email,
        },
        body: JSON.stringify(updatedDetails),
      });

      if (response.ok) {
        setUserName(updatedDetails.name);
        sessionStorage.setItem("name", updatedDetails.name);
        setUserDetails(updatedDetails);
        setEditMode(false);
        setStatusMessage("Profile updated successfully!");

        setTimeout(() => {
          setStatusMessage("");
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatusMessage("Update failed. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p><b>Email:</b> {userDetails.email}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
      {statusMessage && (
        <span className="status-message">{statusMessage}</span>
      )}
    </div>
  );
};

export default Profile;
