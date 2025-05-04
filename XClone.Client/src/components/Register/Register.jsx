import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Login/Login.css' // Make sure you import the same CSS file

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleRegister = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()
            if (response.status === 200) {
                localStorage.setItem("token", data.token)
                navigate('/feed')
            } else if (response.status === 401) {
                alert('Invalid credentials. Please register first.');
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (err) {
            alert('Registration failed:', err)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="login-input"
                />
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
                <button onClick={handleRegister} className="login-button">Register</button>
            </div>
        </div>
    )
}

export default Register