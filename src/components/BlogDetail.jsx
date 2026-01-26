import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Blog.css';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`);
                const data = await res.json();
                if (data.success) {
                    setBlog(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return <div className="loading-spinner"></div>;
    if (!blog) return <div className="not-found">Blog not found</div>;

    return (
        <div className="blog-detail-page">
            <div className="blog-article">
                <header className="article-header">
                    <span className="category-tag">{blog.tags[0] || 'Beauty'}</span>
                    <h1>{blog.title}</h1>
                    <div className="meta-info">
                        <span>By {blog.author}</span>
                        <span>•</span>
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    </div>
                </header>

                {blog.image && (
                    <div className="article-hero-image">
                        <img src={blog.image} alt={blog.title} />
                    </div>
                )}

                <div className="article-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

                <div className="article-footer">
                    <Link to="/blogs" className="back-link">&larr; Back to all articles</Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
