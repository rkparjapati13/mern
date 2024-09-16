import React, { useState, useEffect } from 'react';
import { useApiCall } from "../services/api";
import { toast } from 'react-toastify';

const Comments = () => {
    const { apiCall } = useApiCall();

    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        post: '',
        text: '',
        user: ''
    });
    const [errors, setErrors] = useState({
        post: '',
        text: ''
    });
    const [editingComment, setEditingComment] = useState(null);

    useEffect(() => {
        fetchComments();
        fetchPosts();
    }, []);
    
    const validateForm = () => {
        let valid = true;
        const newErrors = {};
        if (!formData.post) {
            newErrors.post = 'Please select a post';
            valid = false;
        }

        if (!formData.text) {
            newErrors.text = 'Comment is required';
            valid = false;
        }
        setErrors(newErrors);
        console.log(valid, errors);

        return valid;
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
        if (name == 'post') {
            const selectedOption = e.target.selectedOptions[0]; // Get the selected option element
            const userId = selectedOption.getAttribute('data-user');
            setFormData((prevData) => ({
                ...prevData,
                ['user']: userId,
            }));
        }
    };
    const fetchPosts = async () => {
        const response = await apiCall("get", "/api/posts");
        setPosts(response.posts);
    };

    const fetchComments = async () => {
        const response = await apiCall("get", "/api/comments");
        setComments(response.comments);
    };

    const createComment = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await apiCall("post", '/api/comments', formData);
            if (response.status == 201) {
                console.log(response.data);
                setFormData({
                    post: '',
                    text: '',
                    user: ''
                })
            }
        }

        fetchComments();
    };

    const updateComment = async (id) => {
        if (!validateForm()) return false;
        await apiCall("put", `/api/comments/${id}`, formData);
        setEditingComment(null);
        setFormData({
            post: '',
            text: '',
            user: ''
        })
        fetchComments();
    };

    const deleteComment = async (id) => {
        const response = await apiCall("delete", `/api/comments/${id}`);
        toast.success(response.message);
        fetchComments();
    };

    const startEditing = (comment) => {
        setEditingComment(comment._id);
        setFormData({
            user: comment.post.user._id,
            post: comment.post._id,
            text: comment.text
        });
    };

    return (
        <div className="comments-form">
            <h2>Comments</h2>

            <div className="form-group">
                <label htmlFor="post">Post:</label>
                <select name="post" value={formData.post} onChange={handleChange} className={errors.post ? 'error' : ''}>
                    <option value="">Select Post</option>
                    {posts.map((post) => (
                        <option key={post._id} value={post._id} data-user={post.user._id}>
                            {post.title}
                        </option>
                    ))}
                </select>
                {errors.post && <div className="error-message">{errors.post}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="comment">Comment:</label>
                <textarea
                    placeholder="Write your comment here..."
                    value={formData.text}
                    name="text"
                    onChange={handleChange}
                    className={errors.textarea ? 'error' : ''}
                />
                {errors.text && <div className="error-message">{errors.text}</div>}
            </div>

            <button className="submit-button" onClick={editingComment ? () => updateComment(editingComment) : createComment}>
                {editingComment ? 'Update Comment' : 'Add Comment'}
            </button>

            <ul className="comments-list">
                {comments.map((comment) => (
                    <li key={comment._id} className="comment-item">
                        <h4>{comment.post.content}</h4>
                        <p>Commented on: {comment.text}</p>
                        <button className="edit-button" onClick={() => startEditing(comment)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteComment(comment._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default Comments;
