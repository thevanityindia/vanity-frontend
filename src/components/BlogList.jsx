import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Blog.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/blogs`);
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="blog-page">
            <header className="blog-header">
                <h1>The Vanity Edit</h1>
                <p>Beauty tips, trends, and expert advice.</p>
            </header>

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
        </div>
    );
};

export default BlogList;
