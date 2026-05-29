import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error('Failed to fetch course:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await API.get('/enroll/my-enrollments');
      const isEnrolled = res.data.some((e) => e.course._id === id);
      setEnrolled(isEnrolled);
    } catch (err) {
      console.error('Failed to check enrollment:', err);
    }
  };

  const handleEnroll = () => {
    alert('Payment feature coming soon!');
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',fontSize:'18px',color:'#666'}}>Loading...</div>;
  if (!course) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',fontSize:'18px',color:'#666'}}>Course not found.</div>;

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#fff',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <h2 style={{margin:0,color:'#4f46e5',fontSize:'22px',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>LearnHub</h2>
        <button style={{padding:'0.5rem 1rem',backgroundColor:'#fff',color:'#4f46e5',border:'1px solid #4f46e5',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      <div style={{maxWidth:'900px',margin:'2rem auto',padding:'0 1rem'}}>
        <div style={{backgroundColor:'#fff',borderRadius:'12px',padding:'2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',marginBottom:'1.5rem'}}>
          <span style={{backgroundColor:'#ede9fe',color:'#4f46e5',padding:'0.25rem 0.75rem',borderRadius:'20px',fontSize:'12px',fontWeight:'500'}}>{course.category}</span>
          <h1 style={{margin:'1rem 0 0.5rem',fontSize:'28px',color:'#1a1a2e'}}>{course.title}</h1>
          <p style={{color:'#666',fontSize:'16px',lineHeight:'1.6',margin:'0 0 1.5rem'}}>{course.description}</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <p style={{margin:'0 0 0.25rem',color:'#888',fontSize:'14px'}}>Instructor</p>
              <p style={{margin:0,fontWeight:'500',color:'#333'}}>{course.instructor}</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{margin:'0 0 0.25rem',color:'#888',fontSize:'14px'}}>Price</p>
              <p style={{margin:0,fontSize:'24px',fontWeight:'700',color:'#4f46e5'}}>TZS {course.price.toLocaleString()}</p>
            </div>
          </div>
          <div style={{marginTop:'1.5rem'}}>
            {enrolled ? (
              <button style={{padding:'0.75rem 2rem',backgroundColor:'#10b981',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px',cursor:'pointer'}} onClick={() => navigate(`/learn/${id}`)}>
                Go to Course →
              </button>
            ) : (
              <button style={{padding:'0.75rem 2rem',backgroundColor:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px',cursor:'pointer'}} onClick={handleEnroll}>
                Enroll Now
              </button>
            )}
          </div>
        </div>

        <div style={{backgroundColor:'#fff',borderRadius:'12px',padding:'2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
          <h2 style={{margin:'0 0 1.5rem',fontSize:'20px',color:'#1a1a2e'}}>Course Content</h2>
          {course.modules.map((module, index) => (
            <div key={index} style={{marginBottom:'1rem',border:'1px solid #eee',borderRadius:'8px',overflow:'hidden'}}>
              <div style={{backgroundColor:'#f8f9fa',padding:'1rem',fontWeight:'500',color:'#333'}}>
                Module {index + 1}: {module.title}
              </div>
              {module.lessons.map((lesson, lIndex) => (
                <div key={lIndex} style={{padding:'0.75rem 1rem',borderTop:'1px solid #eee',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <span style={{color:'#4f46e5',fontSize:'18px'}}>▶</span>
                  <span style={{color:'#444',fontSize:'14px'}}>{lesson.title}</span>
                  <span style={{marginLeft:'auto',color:'#888',fontSize:'13px'}}>{lesson.duration}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
