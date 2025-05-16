import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Feed.css";

const Feed = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const modalRef = useRef();
    const [modalPost, setModalPost] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);
    const textareaRef = useRef();

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
            const response = await fetch(`${apiUrl}/api/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            const data = await response.json();
            setUser(data.user);
            setPosts(data.posts);
        };

        fetchPosts();
    }, [apiUrl, navigate]);

    const handlePostSubmit = async () => {
        if (!newPost.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const response = await fetch(`${apiUrl}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: newPost }),
        });

        if (response.ok) {
            setNewPost("");

            const updated = await fetch(`${apiUrl}/api/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());

            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }

            setUser(updated.user);
            setPosts(updated.posts);
        }
    };

    const handlePostModalSubmit = async () => {
        if (!modalPost.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");
        const response = await fetch(`${apiUrl}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: modalPost }),
        });

        if (response.ok) {
            setModalPost("");

            const updated = await fetch(`${apiUrl}/api/posts`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());

            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }

            setUser(updated.user);
            setPosts(updated.posts);
            handleCloseModal();
        }
    };

    const handleProfileNavigation = (userId) => {
        navigate("/profile", { state: { userId } });
    };
    return (
        <>
            <div className="sidebar">
                <div className="pre-sidebar">
                    <div className="sidebar-top">
                        <button className="sidebar-button-x" onClick={() => navigate("/feed")}>
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
                        <button className="sidebar-button" onClick={() => navigate("/feed")}>
                            🏠 Home
                        </button>
                        <button className="sidebar-button" onClick={() => handleProfileNavigation(user.id)}>
                            👤 Profile
                        </button>
                        <button className="sidebar-button-post" style={{ backgroundColor: "white", color: "black" }} onClick={handleOpenModal}>
                            Post
                        </button>

                    </div>
                    <div className="sidebar-bottom" onClick={() => handleProfileNavigation(user.id)}>
                        <div className="post-avatar"></div>
                        <div className="post-name-email">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <main className="posts">
                    <section className="post-creation">
                        <h2>Feed</h2>
                        <div className="post-creation-header">
                            <button className="post-avatar" onClick={() => handleProfileNavigation(user.id)}></button>
                            <div className="post-input-wrapper">
                                <textarea
                                    ref={textareaRef}
                                    value={newPost}
                                    onChange={(e) => {
                                        setNewPost(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    placeholder="What's on your mind?"
                                    rows="1"
                                    cols="50"
                                />
                                <div className="button-wrapper">
                                    <button className={`post-button ${newPost.trim() ? "enabled" : ""}`} onClick={handlePostSubmit} disabled={!newPost.trim()}                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {posts.map((post, index) => (
                        <div key={index} className="post-card">
                            <div className="post-header">
                                <button className="post-avatar" onClick={() => handleProfileNavigation(post.userId)}></button>
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
                </main>

                <div className="empty-column"></div>
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content" ref={modalRef}>
                        <button className="modal-close-button" onClick={handleCloseModal}>
                            ×
                        </button>
                        <div style={{ paddingTop: "20px", paddingLeft: "20px"} }>
                            <div className="post-creation-header">
                                <button className="post-avatar" onClick={() => handleProfileNavigation(user.id)}></button>
                                <div className="post-input-wrapper">
                                    <textarea
                                        ref={textareaRef}
                                        value={modalPost}
                                        onChange={(e) => {
                                            setModalPost(e.target.value);
                                            e.target.style.height = "auto";
                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                        }}
                                        placeholder="What's on your mind?"
                                        rows="1"
                                        cols="50"
                                    />
                                    <div className="button-wrapper">
                                        <button
                                            className={`post-button ${modalPost.trim() ? "enabled" : ""}`}
                                            onClick={handlePostModalSubmit}
                                            disabled={!modalPost.trim()}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Feed;
