import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Blog.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                console.log('Fetching blogs from:', `${API_BASE_URL}/api/blogs`);
                const res = await fetch(`${API_BASE_URL}/api/blogs`);
                const data = await res.json();
                console.log('Blog API response:', data);

                if (data.success) {
                    setBlogs(data.data);
                    console.log('Blogs loaded:', data.data.length);
                } else {
                    setError('Failed to load blogs');
                    console.error('API returned success: false');
                }
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="blog-page">
                <div className="loading-spinner">Loading blogs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-page">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Error Loading Blogs</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-page">
            <header className="blog-header">
                <h1>The Vanity Edit</h1>
                <p>Beauty tips, trends, and expert advice.</p>
            </header>

            {blogs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>No Blog Posts Yet</h2>
                    <p>Check back soon for beauty tips and expert advice!</p>
                </div>
            ) : (
                <div className="blog-grid-container">
                    {blogs.map(blog => (
                        <Link to={`/blogs/${blog.slug}`} key={blog._id} className="blog-card">
                            <div className="blog-card-image">
                                <img src={blog.image || '/assets/logo.jpg'} alt={blog.title} />
                            </div>
                            <div className="blog-card-content">
                                <span className="blog-date">{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                <h2>{blog.title}</h2>
                                <p>{blog.excerpt}</p>
                                <span className="read-more">Read More &rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList;
