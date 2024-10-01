import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import CommentsSection from './CommentSection'; // Adjust the import path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import imageLink from '../user.png';
import moment from 'moment';
import {io} from 'socket.io-client';
// const socket = io('http://localhost:5000');

const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({content: ''});
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        content: '',
    });
    useEffect(() => {
        fetchPosts();
        // socket.on('receive_post', (newPost) => {
        //     // Only update comments if the comment belongs to the current post
        //     if (newPost._id) {
        //         // fetchPosts();
        //         setPosts((prevPosts) => [newPost, ...prevPosts]);
        //     }
        // });

        // // // Cleanup when the component is unmounted
        // return () => {
        //     socket.off('receive_post');
        // };
    }, []);
    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (error) {
            if (error.status == 403) {
                navigate('/');
            }
        }
        
    };
    const formatDate = (date) => {
        return moment(date).format('YYYY MMM DD HH:mm');
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
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (!formData.content) {
            newErrors.content = 'Content is required';
            valid = false;
        }
        setErrors(newErrors);
        console.log(valid, errors);
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await api.post('/posts', formData);
            if (response.status == 201) {
                console.log(response.data);
                // socket.emit('new_post', response.data);
                setFormData({
                    content: '',
                })
            }
        }

        fetchPosts();
    };

    return (
        <div className="post-page">
            <div className="post-create-card">
                <h2>Create a Post</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        rows="4"
                        placeholder="What's on your mind?"
                        value={formData.content}
                        name="content"
                        onChange={handleChange}
                        className={errors.content ? 'error' : ''}
                    />
                    {errors.content && <div className="error-message">{errors.content}</div>}
                    <button type="submit" className="post-button">Post</button>
                </form>
            </div>

            {/* <div className="posts-display">
                <h2>Posts</h2>
                {posts.length === 0 ? (
                    <p>No posts yet!</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <p>{post.content}</p>
                        </div>
                    ))
                )}
            </div> */}
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
        </div>
    );
};

export default PostPage;
