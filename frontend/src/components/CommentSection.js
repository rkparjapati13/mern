import React, { useState, useEffect } from 'react';
import imageLink from '../user.png';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';


const CommentsSection = (props) => {

    const { postId } = props;    
    const [commentList, setComments] = useState([]);


    useEffect(() => {
        fetchComments(postId);
    }, []);
    const fetchComments = async (postId) => {
        
        const response = await axios.get(`/api/comments/post/${postId}`);
        setComments(response.data);
    };
    console.log('commentList',commentList);
    const formatDate = (date) => {
        return moment(date).format('YYYY MMM DD HH:mm');
    };
    let commentsElm = (
        <div className="spinner-container">
            <span className="spinner"></span>
        </div>
    );

    if (commentList.length > 0) {
        commentsElm = [];

        commentsElm = [
            ...commentsElm,
            (
                <div className="comment-input" key="input">
                    <div className="post-avatar">
                        <figure>
                            <img src={imageLink} />
                        </figure>
                    </div>
                    <textarea
                        className="text-comment"
                        placeholder="Write your comment here..."
                    ></textarea>
                    <button
                        className="send-button"
                        onClick={() => {
                            console.error(
                                "This thing will not work even if you click this: " +
                                "Please try to 'mouseover' or 'hover' on the button " +
                                "to see the purpose of this pen."
                            );
                        }}
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
                    <div className="comment-container" key={index}>
                        <div className="comment-top">
                            <div className="post-avatar">
                                <figure>
                                    <img src={imageLink} />
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
                                        <time className="margin-left-half" date={comment?.createdAt}>
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
    }


    return <section className="post-comments">{commentsElm}</section>;
};

export default CommentsSection;
