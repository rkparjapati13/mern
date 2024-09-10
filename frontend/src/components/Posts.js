// src/components/Posts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentsSection from './CommentSection'; // Adjust the import path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import imageLink from '../user.png';
import moment from 'moment';

const Posts = () => {

    const formatDate = (date) => {
        return moment(date).format('YYYY MMM DD HH:mm');
    };

    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        user: '',
    });
    const [errors, setErrors] = useState({
        title: '',
        content: '',
        user: '',
    });
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, []);
    const fetchPosts = async () => {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
    };
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (!formData.title) {
            newErrors.title = 'Title is required';
            valid = false;
        }

        if (!formData.content) {
            newErrors.content = 'Content is required';
            valid = false;
        }

        if (!formData.user) {
            newErrors.user = 'Select a user';
            valid = false;
        }
        setErrors(newErrors);
        console.log(valid, errors);

        return valid;
    };
    const fetchUsers = async () => {
        const response = await axios.get('/api/users');
        setUsers(response.data);
    };
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };
    const createPost = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await axios.post('/api/posts', formData);
            if (response.status == 201) {
                console.log(response.data);
                setFormData({
                    title: '',
                    content: '',
                    user: '',
                })
            }
        }

        fetchPosts();
    };

    const updatePost = async (id) => {
        if (!validateForm()) return false;
        await axios.put(`/api/posts/${id}`, formData);
        setEditingPost(null);
        setFormData({
            title: '',
            content: '',
            user: '',
        })
        fetchPosts();
    };

    const deletePost = async (id) => {
        await axios.delete(`/api/posts/${id}`);
        fetchPosts();
    };

    const startEditing = (post) => {
        setEditingPost(post._id);
        console.log(post);
        setFormData({
            user: post.user._id,
            title: post.title,
            content: post.content,
        });
    };

    return (
        <>
            <div className="post-form">
                <h2>Posts</h2>
                <div className="form-group">
                    <label htmlFor="user">User:</label>
                    <select name="user" value={formData.user} onChange={handleChange} className={errors.user ? 'error' : ''}>
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    {errors.user && <div className="error-message">{errors.user}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        name="title"
                        onChange={handleChange}
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        placeholder="Content"
                        value={formData.content}
                        name="content"
                        onChange={handleChange}
                        className={errors.content ? 'error' : ''}
                    />
                    {errors.content && <div className="error-message">{errors.content}</div>}
                </div>

                <button className="submit-button" onClick={editingPost ? () => updatePost(editingPost) : createPost}>
                    {editingPost ? 'Update Post' : 'Add Post'}
                </button>

                <ul className="post-list">
                    {posts.map((post) => (
                        <li key={post._id} className="post-item">
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <button className="edit-button" onClick={() => startEditing(post)}>Edit</button>
                            <button className="delete-button" onClick={() => deletePost(post._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            {posts?.length > 0 && posts.map((post, index) => (
                <article className="post" key={index}>
                    <header className="post-header">
                        <h2>{post.title}</h2>
                    </header>
                    <section className="post-top">
                        <div className="post-avatar">
                            <figure>
                                <img src={imageLink} />
                            </figure>
                        </div>
                        <div className="post-identifier">
                            <p>
                                <FontAwesomeIcon icon={faUser} />
                                <a href="#" className="post-author-link margin-left-half">
                                    {post.user.name}
                                </a>
                            </p>
                            <p>
                                <small>
                                    <FontAwesomeIcon icon={faClock} />
                                    <time className="margin-left-half" date={post?.createdAt}>
                                        {post?.createdAt ? formatDate(post.createdAt) : ''}
                                    </time>
                                </small>
                            </p>
                        </div>
                    </section>
                    <section className="post-content">
                        <p>
                            {post.content}
                        </p>
                    </section>
                    <CommentsSection postId={post._id} />
                </article>
            ))}
        </>

    );
};

export default Posts;
