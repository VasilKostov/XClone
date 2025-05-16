//import { useState } from 'react'
//import Login from './components/Login.jsx'
//import Register from './components/Register.jsx'

//function App() {
//    const [showLogin, setShowLogin] = useState(true)

//    return (
//        <div style={{ textAlign: 'center', padding: '2rem' }}>
//            <h1>XClone Auth</h1>
//            <div style={{ marginBottom: '1rem' }}>
//                <button onClick={() => setShowLogin(true)} style={{ marginRight: '1rem' }}>
//                    Login
//                </button>
//                <button onClick={() => setShowLogin(false)}>Register</button>
//            </div>
//            {showLogin ? <Login /> : <Register />}
//        </div>
//    )
//}

//export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Feed from './components/Feed/Feed.jsx'
import Profile from './components/Profile/Profile.jsx'
import Post from './components/Post/Post.jsx'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/post" element={<Post />} />
            </Routes>
        </Router>
    )
}

export default App

