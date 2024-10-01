import React, { useState, useEffect } from 'react';
import imageLink from '../../user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsRequest, createCommentRequest } from './action';

const CommentsSection = ({ postId }) => {
    const dispatch = useDispatch();
    const { comments, loading } = useSelector((state) => state.comments); // Access Redux state
    
    const [formData, setFormData] = useState({ text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

    // Fetch comments when postId changes
    useEffect(() => {
        dispatch(fetchCommentsRequest(postId));
    }, [dispatch, postId]);

    const createComment = (e) => {
        e.preventDefault();
        if (!formData.text.trim()) return; // Prevent empty comments
        setIsSubmitting(true); // Disable the button while submitting
        // Dispatch the create comment action
        dispatch(createCommentRequest(formData));

        setFormData({ text: '' }); // Clear the text field after submission
    };

    const handleInputChange = (e) => {
        setFormData({ text: e.target.value, post:postId }); // Update text only
    };

    const formatDate = (date) => {
        return moment(date).format('YYYY MMM DD HH:mm');
    };

    return (
        <section className="post-comments">
            <div className="comment-input">
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
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                comments[postId]?.map((comment) => (
                    <div className="comment-container" key={comment._id}>
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
                                        {comment.user.name}
                                    </a>
                                </p>
                                <p>
                                    <small>
                                        <i className="far fa-clock"></i>
                                        <time className="margin-left-half" dateTime={comment.createdAt}>
                                            {formatDate(comment.createdAt)}
                                        </time>
                                    </small>
                                </p>
                            </div>
                        </div>
                        <div className="comment-content">{comment.text}</div>
                    </div>
                ))
            )}
        </section>
    );
};

export default CommentsSection;
