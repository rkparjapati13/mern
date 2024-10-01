import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, createPost } from './action'; // Adjust the import path
import CommentsSection from '../comment'; // Adjust the import path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import imageLink from '../../user.png';
import moment from 'moment';

const Post = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the posts and error states from Redux
  const { posts, error } = useSelector((state) => {
    return state.post
  });
  
  // Form state for post creation
  const [formData, setFormData] = useState({ content: '' });
  const [errors, setErrors] = useState({ content: '' });

  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts from API using Redux action
  }, [dispatch]);

  const formatDate = (date) => moment(date).format('YYYY MMM DD HH:mm');

  const handleChange = (e) => {
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
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createPost(formData)); // Dispatch Redux action to create post
      setFormData({ content: '' });
    }
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

      {/* Error handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Post listing */}
      {posts?.length > 0 && posts.map((post, index) => (
        <article className="post" key={index}>
          <header className="post-header">
            <h2>{post.title}</h2>
          </header>
          <section className="post-top">
            <div className="post-avatar">
              <figure>
                <img src={imageLink} alt="User" />
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
            <p>{post.content}</p>
          </section>
          <CommentsSection postId={post._id} />
        </article>
      ))}
    </div>
  );
};

export default Post;
