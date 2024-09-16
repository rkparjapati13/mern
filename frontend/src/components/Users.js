import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useApiCall } from "../services/api";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const { apiCall } = useApiCall();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Form validation function
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (formData.name.length > 20) {
      newErrors.name = "Name should not exceed 20 characters.";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces.";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Set password to "password" when the email changes
    if (name === "email") {
      setFormData((prevData) => ({
        ...prevData,
        password: "password",
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await apiCall("get", "/api/users");
      if (response && response.users) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // if (error.response && error.response.status === 401) {
      //   alert("Your session has expired. Please log in again.");
      // } else {
      //   alert("An error occurred while fetching users.");
      // }
      navigate('/login');

    }
  };

  // Create user
  const createUser = async () => {
    if (validateForm()) {
      try {
        const response = await apiCall("post", "/api/users", formData);
        toast.success(response.message);
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        fetchUsers();
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error("Failed to create user.");
      }
    }
  };

  // Update user
  const updateUser = async (id) => {
    if (validateForm()) {
      try {
        const response = await apiCall("put", `/api/users/${id}`, formData);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        toast.success(response.message);
        fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user.");
      }
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      const response = await apiCall("delete", `/api/users/${id}`);
      toast.success(response.message);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  // Start editing user
  const startEditing = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.email,
    });
  };

  // Separate handlers for create and update button
  const handleCreateUser = (e) => {
    e.preventDefault();
    createUser();
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    updateUser(editingUser);
  };

  return (
    <div>
      <h2>Users</h2>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <div className="error-message">{errors.name}</div>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <div className="error-message">{errors.email}</div>}
      <button
        className="submit-btn"
        onClick={editingUser ? handleUpdateUser : handleCreateUser}
      >
        {editingUser ? "Update User" : "Add User"}
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => startEditing(user)}>Edit</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                Data not found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
