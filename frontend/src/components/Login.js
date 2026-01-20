import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Page badalne ke liye tool

  // Jab user type karega
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Jab button dabayega
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Checking credentials...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Login Successful!
        setMessage('✅ Login Successful! Redirecting...');
        
        // User ki jankari browser me save karein (Local Storage)
        localStorage.setItem('userInfo', JSON.stringify(data));

        // 1 second baad Home page par bhej dein
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // Login Failed
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Server Error. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>🔑 Login</h2>
      
      {message && <p style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>{message}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label><strong>Username:</strong></label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label><strong>Password:</strong></label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          Login Now
        </button>

      </form>
    </div>
  );
};

export default Login;