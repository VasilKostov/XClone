import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Post.css";

const Post = () => {
    const { state } = useLocation();  // Get the state passed from Feed
    const { postId } = state || {};  // Destructure userId from the state
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const modalRef = useRef();
    const [modalPost, setModalPost] = useState("");
    const [loading, setLoading] = useState(true);

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
        const fetchPost = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
            const response = await fetch(`${apiUrl}/api/posts/getpost`, {
                method: "POST",  // Assuming it's a POST request
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(postId),
            });

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            const data = await response.json();
            setUser(data.user);
            setPost(data.post);
            setLoading(false);
        };

        fetchPost();
    }, [apiUrl, navigate, postId]);

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
    return (<>
        {loading ? (
            <div>Loading...</div>  // Show loading message or spinner
        ) : (
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
                            <section
                                className="post-creation"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}
                            >
                                <button className="button-back"
                                    onClick={() => navigate("/feed")}
                                    onMouseDown={(e) => e.preventDefault()} // Prevent focus outline
                                    aria-label="Go back"
                                >
                                    ←
                                </button>
                                <h2 style={{ margin: 0 }}>Post</h2>
                            </section>

                        <div className="post-cardv2">
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
                    </main>

                    <div className="empty-column"></div>
                </div>

                {showModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content" ref={modalRef}>
                            <button className="modal-close-button" onClick={handleCloseModal}>
                                ×
                            </button>
                            <div style={{ paddingTop: "20px", paddingLeft: "20px" }}>
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
        )}
    </>
    );
};

export default Post;
