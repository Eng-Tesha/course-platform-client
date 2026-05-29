import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Learn = () => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [], progressPercent: 0 });
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
      if (res.data.modules[0]?.lessons[0]) {
        setActiveLesson(res.data.modules[0].lessons[0]);
      }
    } catch (err) {
      console.error('Failed to fetch course:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await API.get(`/progress/${id}`);
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  const markComplete = async (lessonId) => {
    try {
      const res = await API.post('/progress/mark', {
        courseId: id,
        lessonId
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to mark lesson:', err);
    }
  };

  const isCompleted = (lessonId) => {
    return progress.completedLessons.includes(lessonId);
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',fontSize:'18px',color:'#666'}}>Loading...</div>;
  if (!course) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',fontSize:'18px',color:'#666'}}>Course not found.</div>;

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#fff',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <h2 style={{margin:0,color:'#4f46e5',fontSize:'22px',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>LearnHub</h2>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{color:'#666',fontSize:'14px'}}>Progress: {progress.progressPercent}%</span>
          <div style={{width:'150px',height:'8px',backgroundColor:'#e2e8f0',borderRadius:'4px'}}>
            <div style={{width:`${progress.progressPercent}%`,height:'100%',backgroundColor:'#4f46e5',borderRadius:'4px',transition:'width 0.3s'}}></div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:'0',minHeight:'calc(100vh - 64px)'}}>
        <div style={{backgroundColor:'#fff',borderRight:'1px solid #eee',overflowY:'auto'}}>
          <div style={{padding:'1rem',borderBottom:'1px solid #eee'}}>
            <h3 style={{margin:0,fontSize:'16px',color:'#1a1a2e'}}>{course.title}</h3>
          </div>
          {course.modules.map((module, mIndex) => (
            <div key={mIndex}>
              <div style={{padding:'0.75rem 1rem',backgroundColor:'#f8f9fa',fontWeight:'500',fontSize:'13px',color:'#555',borderBottom:'1px solid #eee'}}>
                Module {mIndex + 1}: {module.title}
              </div>
              {module.lessons.map((lesson, lIndex) => (
                <div
                  key={lIndex}
                  style={{padding:'0.75rem 1rem',borderBottom:'1px solid #f0f0f0',cursor:'pointer',backgroundColor: activeLesson?._id === lesson._id ? '#ede9fe' : '#fff',display:'flex',alignItems:'center',gap:'0.5rem'}}
                  onClick={() => setActiveLesson(lesson)}
                >
                  <span style={{fontSize:'16px'}}>{isCompleted(lesson._id) ? '✅' : '▶'}</span>
                  <span style={{fontSize:'13px',color:'#444'}}>{lesson.title}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{padding:'2rem'}}>
          {activeLesson ? (
            <div>
              <h2 style={{margin:'0 0 1rem',fontSize:'22px',color:'#1a1a2e'}}>{activeLesson.title}</h2>
              <div style={{position:'relative',paddingBottom:'56.25%',height:0,borderRadius:'12px',overflow:'hidden',backgroundColor:'#000',marginBottom:'1.5rem'}}>
                <iframe
                  style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <button
                style={{padding:'0.75rem 2rem',backgroundColor: isCompleted(activeLesson._id) ? '#10b981' : '#4f46e5',color:'#fff',border:'none',borderRadius:'8px',fontSize:'16px',cursor:'pointer'}}
                onClick={() => markComplete(activeLesson._id)}
                disabled={isCompleted(activeLesson._id)}
              >
                {isCompleted(activeLesson._id) ? '✅ Completed' : 'Mark as Complete'}
              </button>
            </div>
          ) : (
            <p style={{color:'#666'}}>Select a lesson to start learning.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;
