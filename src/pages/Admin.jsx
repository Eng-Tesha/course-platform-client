import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';


const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', price: '', instructor: '', category: '', isPublished: true
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchCourses(); }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await API.put(`/courses/${editCourse._id}`, form);
        alert('Course updated successfully');
      } else {
        await API.post('/courses', form);
        alert('Course created successfully');
      }
      setShowForm(false);
      setEditCourse(null);
      setForm({ title: '', description: '', price: '', instructor: '', category: '', isPublished: true });
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      price: course.price,
      instructor: course.instructor,
      category: course.category,
      isPublished: course.isPublished
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await API.delete(`/courses/${courseId}`);
      alert('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',fontSize:'18px',color:'#666'}}>Loading...</div>;

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#fff',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <h2 style={{margin:0,color:'#4f46e5',fontSize:'22px'}}>LearnHub Admin</h2>
        <div style={{display:'flex',gap:'12px'}}>
          <button style={{padding:'0.5rem 1rem',backgroundColor:'#fff',color:'#4f46e5',border:'1px solid #4f46e5',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <span style={{color:'#333',fontSize:'14px',alignSelf:'center'}}>Hello, {user?.name}</span>
        </div>
      </div>

      <div style={{maxWidth:'1000px',margin:'2rem auto',padding:'0 1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h3 style={{margin:0,fontSize:'20px',color:'#1a1a2e'}}>Manage Courses</h3>
          <button style={{padding:'0.75rem 1.5rem',backgroundColor:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}} onClick={() => { setShowForm(true); setEditCourse(null); setForm({ title:'', description:'', price:'', instructor:'', category:'', isPublished:true }); }}>
            + Add New Course
          </button>
        </div>

        {showForm && (
          <div style={{backgroundColor:'#fff',borderRadius:'12px',padding:'2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',marginBottom:'1.5rem'}}>
            <h3 style={{margin:'0 0 1.5rem',fontSize:'18px',color:'#1a1a2e'}}>{editCourse ? 'Edit Course' : 'Add New Course'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333',fontSize:'14px'}}>Title</label>
                  <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="text" placeholder="Course title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                </div>
                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333',fontSize:'14px'}}>Instructor</label>
                  <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="text" placeholder="Instructor name" value={form.instructor} onChange={(e) => setForm({...form, instructor: e.target.value})} required />
                </div>
                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333',fontSize:'14px'}}>Price (TZS)</label>
                  <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="number" placeholder="50000" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
                </div>
                <div>
                  <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333',fontSize:'14px'}}>Category</label>
                  <input style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box'}} type="text" placeholder="e.g. Programming" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
                </div>
              </div>
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block',marginBottom:'0.5rem',fontWeight:'500',color:'#333',fontSize:'14px'}}>Description</label>
                <textarea style={{width:'100%',padding:'0.75rem',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',boxSizing:'border-box',minHeight:'100px'}} placeholder="Course description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
              </div>
              <div style={{marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <input type="checkbox" id="published" checked={form.isPublished} onChange={(e) => setForm({...form, isPublished: e.target.checked})} />
                <label htmlFor="published" style={{fontWeight:'500',color:'#333',fontSize:'14px'}}>Published</label>
              </div>
              <div style={{display:'flex',gap:'1rem'}}>
                <button style={{padding:'0.75rem 2rem',backgroundColor:'#4f46e5',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}} type="submit">
                  {editCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button style={{padding:'0.75rem 2rem',backgroundColor:'#fff',color:'#666',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}} type="button" onClick={() => { setShowForm(false); setEditCourse(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{backgroundColor:'#fff',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{backgroundColor:'#f8f9fa'}}>
                <th style={{padding:'1rem',textAlign:'left',fontSize:'14px',color:'#555',fontWeight:'500',borderBottom:'1px solid #eee'}}>Title</th>
                <th style={{padding:'1rem',textAlign:'left',fontSize:'14px',color:'#555',fontWeight:'500',borderBottom:'1px solid #eee'}}>Category</th>
                <th style={{padding:'1rem',textAlign:'left',fontSize:'14px',color:'#555',fontWeight:'500',borderBottom:'1px solid #eee'}}>Price</th>
                <th style={{padding:'1rem',textAlign:'left',fontSize:'14px',color:'#555',fontWeight:'500',borderBottom:'1px solid #eee'}}>Status</th>
                <th style={{padding:'1rem',textAlign:'left',fontSize:'14px',color:'#555',fontWeight:'500',borderBottom:'1px solid #eee'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td style={{padding:'1rem',fontSize:'14px',color:'#333'}}>{course.title}</td>
                  <td style={{padding:'1rem',fontSize:'14px',color:'#666'}}>{course.category}</td>
                  <td style={{padding:'1rem',fontSize:'14px',color:'#4f46e5',fontWeight:'500'}}>TZS {course.price.toLocaleString()}</td>
                  <td style={{padding:'1rem'}}>
                    <span style={{padding:'0.25rem 0.75rem',borderRadius:'20px',fontSize:'12px',fontWeight:'500',backgroundColor: course.isPublished ? '#d1fae5' : '#fee2e2',color: course.isPublished ? '#065f46' : '#991b1b'}}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{padding:'1rem',display:'flex',gap:'0.5rem'}}>
                    <button style={{padding:'0.4rem 0.75rem',backgroundColor:'#ede9fe',color:'#4f46e5',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}} onClick={() => handleEdit(course)}>Edit</button>
                    <button style={{padding:'0.4rem 0.75rem',backgroundColor:'#fee2e2',color:'#991b1b',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}} onClick={() => handleDelete(course._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
