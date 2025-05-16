import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();  // Get the state passed from Feed
    const { userId } = state || {};  // Destructure userId from the state
    const [posts, setPosts] = useState([]);
    const [modalPost, setModalPost] = useState("");
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [sameProfile, setSameProfile] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const modalRef = useRef();
    const [editName, setEditName] = useState("");
    const [editProfilePicture, setEditProfilePicture] = useState(null);

    const handleOpenEditModal = () => setShowEditModal(true);
    

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

            if (!userId) return navigate("/feed");  // If no userId, go back to feed
            const fetchPosts = async () => {

                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const response = await fetch(`${apiUrl}/api/profile/getprofile`, {
                    method: "POST",  // Assuming it's a POST request
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(userId),  // Pass userId in the request body
                });

                if (response.status === 401) {
                    navigate("/login");
                    return;
                }
                if (response.status === 404) {
                    navigate("/feed");
                    return;
                }

                if (response.status === 200) {
                    const data = await response.json();
                    setUser(data.user);
                    setPosts(data.posts);
                    setProfile(data.profile);
                    setSameProfile(data.sameUser);

                    setEditName(data.profile.name);
                    setEditProfilePicture(null);
                }
                setLoading(false); // Once data is fetched, set loading to false
            };

            fetchPosts();
            handleCloseModal();
        }
    }
    useEffect(() => {
        if (!userId) return navigate("/feed");  // If no userId, go back to feed
        const fetchPosts = async () => {

            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

            const response = await fetch(`${apiUrl}/api/profile/getprofile`, {
                method: "POST",  // Assuming it's a POST request
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userId),  // Pass userId in the request body
            });

            if (response.status === 401) {
                navigate("/login");
                return;
            }
            if (response.status === 404) {
                navigate("/feed");
                return;
            }

            if (response.status === 200) {
                const data = await response.json();
                setUser(data.user);
                setPosts(data.posts);
                setProfile(data.profile);
                setSameProfile(data.sameUser);

                setEditName(data.profile.name);
                setEditProfilePicture(null);
            }
            setLoading(false); // Once data is fetched, set loading to false
        };

        fetchPosts();
    }, [apiUrl, userId, navigate]);
    //function arrayBufferToBase64(buffer) {
    //    let binary = '';
    //    const bytes = new Uint8Array(buffer);
    //    const len = bytes.byteLength;
    //    for (let i = 0; i < len; i++) {
    //        binary += String.fromCharCode(bytes[i]);
    //    }
    //    return window.btoa(binary);
    //}
    const handleEditProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const formData = new FormData();
        formData.append("name", editName);
        if (editProfilePicture) {
            formData.append("profilePicture", editProfilePicture);
        }

        const response = await fetch(`${apiUrl}/api/profile/editprofile`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            setShowEditModal(false);

            // Refresh profile after successful update
            const refreshed = await fetch(`${apiUrl}/api/profile/getprofile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userId),
            });

            if (refreshed.ok) {
                const data = await refreshed.json();
                setUser(data.user);
                setPosts(data.posts);
                setProfile(data.profile);
                setSameProfile(data.sameUser);

                // Reset edit fields
                setEditName(data.profile.name);
                setEditProfilePicture(null);
            }
        }
    };

    const handleProfileNavigation = (e, userId) => {
        e.stopPropagation(); // prevent card click
        navigate("/profile", { state: { userId } });
    };
    return (
        <>
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
                            <section className="profile">
                                <button className="profile-avatar" onClick={() => handleProfileNavigation(profile.id)}></button>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h2>{profile.name}</h2>
                                        {sameProfile && < button className="sidebar-button-edit" onClick={handleOpenEditModal}>Edit Profile</button>}
                                    </div>
                                    <h3 style={{ color: "grey" }}>{profile.email}</h3>
                                    <h4 style={{ color: "grey" }}>Joined {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                                        month: "short",
                                        year: "numeric"
                                    })}</h4>
                                </div>
                                </section>
                                {posts.map((post, index) => (
                                    <div key={index} className="post-card" onClick={() => navigate("/post", { state: { postId: post.id } })}>
                                        <div className="post-header">
                                            <button className="post-avatar" onClick={(e) => handleProfileNavigation(e, post.userId)}></button>

                                            <div className="post-info">
                                                <div className="post-name-email">
                                                    <span className="post-name" onClick={(e) => handleProfileNavigation(e, post.userId)} style={{ cursor: "pointer" }}>
                                                        {post.name}
                                                    </span>
                                                    <span className="post-email" onClick={(e) => handleProfileNavigation(e, post.userId)} style={{ cursor: "pointer", color: "grey" }}>
                                                        {post.email}
                                                    </span>
                                                </div>
                                                <div className="post-content">{post.content}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {/*{posts.map((post, index) => (*/}
                            {/*    <div key={index} className="post-card">*/}
                            {/*        <div className="post-header">*/}
                            {/*            <button className="post-avatar" onClick={() => handleProfileNavigation(post.userId)}></button>*/}
                            {/*            <div className="post-info">*/}
                            {/*                <div className="post-name-email">*/}
                            {/*                    <span className="post-name">{post.name}</span>*/}
                            {/*                    <span className="post-email">{post.email}</span>*/}
                            {/*                </div>*/}
                            {/*                <div className="post-content">{post.content}</div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*))}*/}
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

                    {showEditModal && (
                        <div className="modal-backdrop">
                            <div className="modal-content" ref={modalRef}>
                                <button className="modal-close-button" onClick={() => setShowEditModal(false)}>×</button>
                                <h2 style={{ color: "white", marginBottom: "15px" }}>Edit Profile</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Name"
                                        style={{ padding: "10px", borderRadius: "6px" }}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditProfilePicture(e.target.files[0])}
                                        style={{ padding: "10px", borderRadius: "6px", backgroundColor: "#fff" }}
                                    />
                                    <button
                                        onClick={handleEditProfile}
                                        style={{
                                            backgroundColor: "#fff",
                                            color: "#000",
                                            padding: "10px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </>
            )}
        </>
    );
};

export default Profile;
