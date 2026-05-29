import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [courses, setCourses]   = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    try {
      const res = await API.get(`/courses?search=${e.target.value}`);
      setCourses(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div style={styles.loading}>Loading courses...</div>;

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>LearnHub</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hello, {user?.name}</span>
          {user?.role === 'admin' && (
            <button style={styles.adminBtn} onClick={() => navigate('/admin')}>
              Admin Panel
            </button>
          )}
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={styles.searchContainer}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Course grid */}
      <div style={styles.grid}>
        {courses.length === 0 ? (
          <p style={styles.empty}>No courses found.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              style={styles.card}
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <div style={styles.cardHeader}>
                <span style={styles.category}>{course.category}</span>
              </div>
              <h3 style={styles.cardTitle}>{course.title}</h3>
              <p style={styles.cardDesc}>
                {course.description.substring(0, 80)}...
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.instructor}>By {course.instructor}</span>
                <span style={styles.price}>TZS {course.price.toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  navbar: {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  logo: {
    margin: 0,
    color: '#4f46e5',
    fontSize: '22px'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  welcome: {
    color: '#333',
    fontSize: '14px'
  },
  adminBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#fff',
    color: '#e53e3e',
    border: '1px solid #e53e3e',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  searchContainer: {
    padding: '2rem 2rem 0',
    maxWidth: '600px'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    padding: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    marginBottom: '0.75rem'
  },
  category: {
    backgroundColor: '#ede9fe',
    color: '#4f46e5',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardTitle: {
    margin: '0.75rem 0 0.5rem',
    fontSize: '16px',
    color: '#1a1a2e'
  },
  cardDesc: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0 0 1rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  instructor: {
    color: '#888',
    fontSize: '13px'
  },
  price: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: '14px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  },
  empty: {
    color: '#888',
    fontSize: '16px'
  }
};

export default Dashboard;