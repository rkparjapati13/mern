import React, { useState, useEffect } from 'react';
import imageLink from '../user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import api from '../services/api'; // Assuming you have an `api` service configured for axios
import {io} from 'socket.io-client';

// const socket = io('http://localhost:5000');
const CommentsSection = ({ postId }) => {
    // console.log('asdfasdfasdfasdfasdfasdasdasdfsdf', postId);
    const [commentList, setComments] = useState([]);
    const [formData, setFormData] = useState({
        post: '',
        text: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false); // To track submission state
    useEffect(() => {
        fetchComments(postId);
         // Listen for real-time comments from the server
        //  socket.on('receive_comment', (newComment) => {
        //     // Only update comments if the comment belongs to the current post
        //     if (newComment.post._id == postId) {
        //         // fetchComments(postId);
        //         setComments((prevComments) => [newComment, ...prevComments]);
        //     }
        // });

        // // // Cleanup when the component is unmounted
        // return () => {
        //     socket.off('receive_comment');
        // };
    }, [postId]);

    const fetchComments = async (postId) => {
        try {
            const response = await api.get(`/comments/post/${postId}`);
            console.log(response.data);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const createComment = async (e) => {
        e.preventDefault();
        if (!formData.text.trim()) return; // Prevent empty comments
        setIsSubmitting(true); // Disable the button while submitting
        try {
            const response = await api.post('/comments', formData);
            if (response.status === 201) {
                // socket.emit('new_comment', response.data);
                setFormData({ ...formData, text: '' }); // Clear the text field
                // fetchComments(postId); // Fetch comments again to update the list
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setIsSubmitting(false); // Re-enable the button
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            post: postId,
            text: e.target.value
        });
    };

    const formatDate = (date) => {
        return moment(date).format('YYYY MMM DD HH:mm');
    };

    let commentsElm = [];

    commentsElm = [
        ...commentsElm,
        (
            <div className="comment-input" key="input">
                <div className="post-avatar">
                    <figure>
                        <img src={imageLink} alt="User Avatar" />
                    </figure>
                </div>
                <textarea
                    className="text-comment"
                    placeholder="Write your comment here..."
                    value={formData.text}
                    onChange={handleInputChange}
                />
                <button
                    className="send-button"
                    onClick={createComment}
                    disabled={isSubmitting || !formData.text.trim()} // Disable when submitting or empty
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        ),
    ];

    commentList.forEach((comment, index) => {
        commentsElm = [
            ...commentsElm,
            (
                <div className="comment-container" key={comment._id || index}>
                    <div className="comment-top">
                        <div className="post-avatar">
                            <figure>
                                <img src={imageLink} alt="User Avatar" />
                            </figure>
                        </div>
                        <div className="post-identifier">
                            <p>
                                <i className="far fa-user"></i>
                                <a href="#" className="post-author-link margin-left-half">
                                    {comment?.user?.name}
                                </a>
                            </p>
                            <p>
                                <small>
                                    <i className="far fa-clock"></i>
                                    <time className="margin-left-half" dateTime={comment?.createdAt}>
                                        {comment?.createdAt ? formatDate(comment.createdAt) : ''}
                                    </time>
                                </small>
                            </p>
                        </div>
                    </div>
                    <div className="comment-content">{comment.text}</div>
                </div>
            ),
        ];
    });

    return <section className="post-comments">{commentsElm}</section>;
};

export default CommentsSection;
