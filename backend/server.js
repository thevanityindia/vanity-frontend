const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Trigger restart
const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_super_secret_key_for_jwt'; // In production, use environment variable

// Database Connection Status
let isDbConnected = false;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thevanity')
    .then(() => {
        console.log('MongoDB Connected');
        isDbConnected = true;
    })
    .catch(err => {
        console.log('MongoDB Connection Failed (Running in Demo Mode):', err.message);
        console.log('Using in-memory data for products.');
        isDbConnected = false;
    });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store for demo purposes (Use MongoDB/SQL in production)
const otpStore = new Map();
const users = []; // Simple user store

// In-memory products array - starts empty, only shows products added via admin
const inMemoryProducts = [];

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 2. Send OTP Endpoint
console.log('Registering route: /api/auth/send-otp');
app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Login OTP - The Vanity India',
        text: `Your OTP for login is: ${otp}. It expires in 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// 3. Verify OTP Endpoint
app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore.get(email) === otp) {
        // Clear OTP after successful use
        otpStore.delete(email);

        // Find or create user
        let user = users.find(u => u.email === email);
        if (!user) {
            user = { id: Date.now().toString(), email, name: email.split('@')[0] };
            users.push(user);
        }

        // Generate Token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ success: true, token, user, message: 'Login successful' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
});

// 4. Get All Products
app.get('/api/products', async (req, res) => {
    if (!isDbConnected) {
        // Return only products added via admin interface
        return res.json(inMemoryProducts);
    }

    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    if (!isDbConnected) {
        const product = inMemoryProducts.find(p => p.id == id);
        if (product) return res.json(product);
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const product = await Product.findOne({ id: id });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Product
app.post('/api/products', async (req, res) => {
    const { brand, name, price, image, category, subcategory, description } = req.body;

    if (!isDbConnected) {
        // Add to in-memory array
        const newProduct = {
            id: Date.now(),
            brand, name, price, image, category, subcategory, description
        };
        inMemoryProducts.push(newProduct);
        return res.json({ success: true, product: newProduct });
    }

    try {
        const newProduct = new Product({
            id: Date.now(), // Generate a unique ID
            brand,
            name,
            price,
            image,
            category,
            subcategory,
            description
        });
        await newProduct.save();
        res.json({ success: true, product: newProduct });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get Category Statistics
app.get('/api/products/stats/categories', async (req, res) => {
    if (!isDbConnected) {
        // Calculate stats from in-memory products
        const stats = inMemoryProducts.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        return res.json(stats);
    }

    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const result = {};
        stats.forEach(stat => {
            result[stat._id || 'Uncategorized'] = stat.count;
        });
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    if (!isDbConnected) {
        const index = inMemoryProducts.findIndex(p => p.id == id);
        if (index !== -1) {
            inMemoryProducts.splice(index, 1);
            return res.json({ success: true, message: 'Product deleted' });
        }
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    try {
        await Product.deleteOne({ id: id });
        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Clear all products (for testing purposes)
app.delete('/api/products/clear', async (req, res) => {
    if (!isDbConnected) {
        inMemoryProducts.length = 0; // Clear in-memory array
        return res.json({ success: true, message: 'All products cleared' });
    }

    try {
        await Product.deleteMany({});
        res.json({ success: true, message: 'All products cleared from database' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Product database starts empty - add products via admin interface');
});
