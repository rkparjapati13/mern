import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getUsersAsync, createUserAsync, deleteUserAsync, updateUserAsync } from "../store/slices/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.users?.users);
  const loading = useSelector((state) => state?.users?.loading);

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
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

  // Create user
  const createUser = async () => {
    if (validateForm()) {
      try {
        dispatch(createUserAsync(formData));
        toast.success('User created successfully!');
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } catch (error) {
        toast.error("Failed to create user.");
      }
    }
  };

  // Update user
  const updateUser = async (id, formData) => {
    if (validateForm()) {
      try {
        dispatch(updateUserAsync(id, formData));
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        toast.success('User updated successfully');
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user.");
      }
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      dispatch(deleteUserAsync(id));
      toast.success('User deleted successfully');
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
      password: "password",
    });
  };

  // Separate handlers for create and update button
  const handleCreateUser = (e) => {
    e.preventDefault();
    createUser();
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    updateUser(editingUser, formData);
  };

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

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
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="3" className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {users?.length > 0 ? (
              users.map((user) => (
                <tr key={user?._id}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>
                    <button onClick={() => startEditing(user)}>Edit</button>
                    <button onClick={() => deleteUser(user?._id)}>Delete</button>
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
        )}
      </table>
    </div>
  );
};

export default Users;
