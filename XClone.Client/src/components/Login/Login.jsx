//import { useNavigate } from 'react-router-dom'
//import { useState } from 'react'

//function Login() {
//    const [email, setEmail] = useState('')
//    const [password, setPassword] = useState('')
//    const navigate = useNavigate()

//    const handleLogin = async () => {
//        try {
//            const response = await fetch('https://localhost:7152/api/auth/login', {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ email, password }),
//            })

//            const data = await response.json()
//            if (response.status === 200) {
//                localStorage.setItem("token", data.token)
//                navigate('/feed')
//            } else if (response.status === 401) {
//                alert('Invalid credentials. Please register first.');
//            } else {
//                alert('Login failed. Please try again.');
//            }
//        } catch (err) {
//            alert('Login failed', err)
//        }
//    }

//    const handleNavigateToRegister = () => {
//        navigate('/register')
//    }

//    return (
//        <div>
//            <h2>Login</h2>
//            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
//            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
//            <button onClick={handleLogin}>Login</button>
//            <p>
//                Don't have an account?{' '}
//                <button onClick={handleNavigateToRegister}>Register here</button>
//            </p>
//        </div>
//    )
//}

//export default Login


import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Login.css' // Make sure the CSS file is linked

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleLogin = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            if (response.status === 200) {
                localStorage.setItem("token", data.token)
                navigate('/feed')
            } else if (response.status === 401) {
                alert('Invalid credentials. Please register first.');
            } else {
                alert('Login failed. Please try again.');
            }
        } catch (err) {
            alert('Login failed', err)
        }
    }

    const handleNavigateToRegister = () => {
        navigate('/register')
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="login-input"
                />
                <button onClick={handleLogin} className="login-button">Login</button>
                <p className="register-text">
                    Don't have an account?{' '}
                    <button onClick={handleNavigateToRegister} className="register-button">Register here</button>
                </p>
            </div>
        </div>
    )
}

export default Login

