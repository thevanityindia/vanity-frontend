import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../../config';
import './ContentManager.css';

const ContentManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        isPublished: true,
        tags: ''
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE_URL}/api/blogs/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                content: blog.content,
                excerpt: blog.excerpt,
                image: blog.image || '',
                isPublished: blog.isPublished,
                tags: blog.tags.join(', ')
            });
        } else {
            setEditingBlog(null);
            setFormData({ title: '', content: '', excerpt: '', image: '', isPublished: true, tags: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingBlog
                ? `${API_BASE_URL}/api/blogs/${editingBlog._id}`
                : `${API_BASE_URL}/api/blogs`;
            const method = editingBlog ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingBlog ? 'Blog updated' : 'Blog published');
                fetchBlogs();
                setShowModal(false);
            } else {
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Blog deleted');
            fetchBlogs();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="content-manager">
            <div className="manager-header">
                <h1>Content Management</h1>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <FiPlus /> New Blog Post
                </button>
            </div>

            <div className="blogs-grid">
                {blogs.map(blog => (
                    <div key={blog._id} className="blog-card-admin">
                        <div className="blog-img">
                            {blog.image ? <img src={blog.image} alt={blog.title} /> : <div className="placeholder"><FiImage /></div>}
                            <span className={`status-badge ${blog.isPublished ? 'published' : 'draft'}`}>
                                {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                        </div>
                        <div className="blog-details">
                            <h3>{blog.title}</h3>
                            <p className="meta">{new Date(blog.publishedAt).toLocaleDateString()}</p>
                            <p className="excerpt">{blog.excerpt || blog.content.substring(0, 100)}...</p>
                            <div className="actions">
                                <button className="btn-icon" onClick={() => handleOpenModal(blog)}><FiEdit /></button>
                                <button className="btn-icon delete" onClick={() => handleDelete(blog._id)}><FiTrash2 /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <h2>{editingBlog ? 'Edit Post' : 'New Post'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://"
                                />
                            </div>
                            <div className="form-group">
                                <label>Excerpt (Short summary)</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Content (HTML supported)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    rows="10"
                                    required
                                    className="content-editor"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="beauty, skincare, tips"
                                />
                            </div>
                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublished}
                                        onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                                    />
                                    Publish Immediately
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
