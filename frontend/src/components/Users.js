import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: ''
    });
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (!formData.name) {
          newErrors.name = 'Name is required';
          valid = false;
        } else if(formData.name.length > 20) {
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
        setErrors(newErrors);
        return valid;
      };
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        const response = await axios.get('/api/users');
        setUsers(response.data);
    };

    const createUser = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response  = await axios.post('/api/users', formData);
            console.log(response.data);
            setFormData({
                name: '',
                email: '',
                password: '',
            })
        }
        fetchUsers();
    };

    const updateUser = async (id) => {
        console.log('update', id, formData);
        await axios.put(`/api/users/${id}`, formData);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
        })
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
    };

    const startEditing = (user) => {
        setEditingUser(user._id);
        setFormData({
            name: user.name,  // Ensure this sets the correct user ID
            email: user.email,  // Ensure this sets the correct user ID
            password: user.email  // Ensure this sets the correct user ID
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
                            <td colSpan={3} style={{textAlign :'center'}}>Data not found</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
        </div>

    );
};

export default Users;
