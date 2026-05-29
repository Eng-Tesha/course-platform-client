import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', { name, email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#fff',padding:'2rem',borderRadius:'12px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',width:'100%',maxWidth:'400px'}}>
        <h2 style={{margin:'0 0 0.5rem',fontSize:'24px',color:'#1a1a2e'}}>Create Account</h2>
        <p style={{margin:'0 0 1.5rem',color:'#666'}}>Join LearnHub today</p>
        {error && <p style={{backgroundColor:'#ffe0e0',color:'#cc0000',padding:'0.75rem',borderRadius:'8px',marginBottom:'1rem',fontSize:'14px'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333'}}>Full Name</label>
            <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333'}}>Email</label>
            <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333'}}>Password</label>
            <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button style={{width:'100%',padding:'0.75rem',backgroundColor: loading ? '#a5a3e8' : '#4f46e5',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px',cursor: loading ? 'not-allowed' : 'pointer',marginTop:'0.5rem'}} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.5rem',color:'#666',fontSize:'14px'}}>
          Already have an account?{' '}
          <Link to="/login" style={{color:'#4f46e5',textDecoration:'none',fontWeight:'500'}}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
