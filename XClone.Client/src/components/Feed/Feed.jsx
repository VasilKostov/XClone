import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import "./Feed.css"; // Import the CSS for styling

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    // Fetch posts on initial render
    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiUrl}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status == 401) {
                navigate('/login')
            }
            else {
                const data = await response.json();

                setUser(data.user);
                setPosts(data.posts);
            }
        };

        fetchPosts();
    }, []);

    const textareaRef = useRef(); // Reference for the textarea

    // Handle post submission
    const handlePostSubmit = async () => {
        if (!newPost.trim()) return;

        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: newPost }),
        });

        if (response.ok) {
            setNewPost(""); // Clear the input field
            const updatedPosts = await fetch(`${apiUrl}/api/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json());

            // Reset the textarea height to match the 2 rows after posting
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"; // Reset
                textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Fit content
            }

            setUser(updatedPosts.user);
            setPosts(updatedPosts.posts); // Update the posts
        }
    };

    return (
        <div className="container">
            <div className="pre-sidebar">
                <div className="sidebar">
                    <div className="sidebar-top">
                        <button className="sidebar-button-x">
                            <svg
                                className="x-logo"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                width="20"
                                height="20"
                            >
                                <path d="M5.23 3L10.6 10.28 4 20h4.77l4.02-5.8 4.75 5.8H20L13.97 12.2 20 3h-4.7l-3.68 5.3L7.6 3H5.23z" />
                            </svg>
                        </button>
                        <button className="sidebar-button" onClick={() => navigate('/feed')}>
                            🏠 Home
                        </button>
                        <button className="sidebar-button" onClick={() => navigate('/profile')}>
                            👤 Profile
                        </button>
                    </div>
                    <div className="sidebar-bottom" onClick={() => navigate('/profile')}>
                        <div className="post-avatar"></div>
                        <div className="post-name-email">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="posts">
                <div className="post-creation">
                    <h2>Feed</h2>
                    <div className="post-creation-header">
                        <div className="post-avatar"></div>
                        <div className="post-input-wrapper">
                            <textarea
                                ref={textareaRef} // Added the ref here
                                value={newPost}
                                onChange={(e) => {
                                    setNewPost(e.target.value);
                                    e.target.style.height = "auto"; // Reset the height
                                    e.target.style.height = e.target.scrollHeight + "px"; // Set new height based on content
                                }}
                                placeholder="What's on your mind?"
                                rows="1"
                                cols="50"
                            />
                            <div className="button-wrapper">
                                <button
                                    className={`post-button ${newPost.trim() ? 'enabled' : ''}`}
                                    onClick={handlePostSubmit}
                                    disabled={!newPost.trim()}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {posts.map((post, index) => (
                    <div key={index} className="post-card">
                        <div className="post-header">
                            <div className="post-avatar"></div>
                            <div className="post-info">
                                <div className="post-name-email">
                                    <span className="post-name">{post.name}</span>
                                    <span className="post-email">{post.email}</span>
                                </div>
                                <div className="post-content">{post.content}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="empty-column">
            </div>
        </div>
    );
};

export default Feed;
