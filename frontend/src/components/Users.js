import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';


const Users = () => {
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        role: ''
    });
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = 'Name is required';
            valid = false;
        } else if (formData.name.length > 20) {
            newErrors.name = 'Name should not exceed 20 characters.';
            valid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            newErrors.name = 'Name can only contain letters and spaces.';
            valid = false;
        }


        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }
        if (!formData.role) {
            newErrors.role = 'Role is required';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };
    const [editingUser, setEditingUser] = useState(null);
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name == 'email') {
            setFormData((prevData) => ({
                ...prevData,
                ['password']: value,
            }));
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };
    const fetchUsers = async () => {
        const response = await api.get('/users');
        setUsers(response.data);
    };

    const createUser = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await api.post('/users', formData);
            console.log(response.data);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: ''
            })
        }
        fetchUsers();
    };

    const updateUser = async (id) => {
        console.log('update', id, formData);
        await api.put(`/users/${id}`, formData);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: ''
        })
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await api.delete(`/users/${id}`);
        fetchUsers();
    };

    const startEditing = (user) => {
        setEditingUser(user._id);
        setFormData({
            name: user.name,  // Ensure this sets the correct user ID
            email: user.email,  // Ensure this sets the correct user ID
            password: user.email,  // Ensure this sets the correct user ID
            role: user.role
        });
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
            {user && user.role === 'SuperAdmin' ? (
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value=""> --- Select a role --- </option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>
            ) : (
                <input type="text" value="User" name="role" disabled />
            )}
            {errors.role && <div className="error-message">{errors.role}</div>}
            <button className="submit-btn" onClick={editingUser ? () => updateUser(editingUser) : createUser}>
                {editingUser ? 'Update User' : 'Add User'}
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
                    {users.length > 0 ? users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => startEditing(user)}>Edit</button>
                                <button onClick={() => deleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}>Data not found</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
        </div>

    );
};

export default Users;
