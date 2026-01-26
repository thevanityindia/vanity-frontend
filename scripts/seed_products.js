// scripts/seed_products.js
// Usage: UPDATE the token below, then run `node scripts/seed_products.js`

const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzNlYWY1ZmM0ZGZjNGJkOTMwMGRiZCIsImVtYWlsIjoiYWRtaW5AdGhldmFuaXR5LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2OTI1NzczNCwiZXhwIjoxNzY5Mjg2NTM0fQ.OoTu5XJmwn0edIWHR4QRNqcQS7I6C1ouxFRRVlQQSjI'; // <--- PLEASE UPDATE THIS
const API_URL = 'http://localhost:5000/api/admin/products';

const products = [
    {
        id: Math.floor(Math.random() * 1000000) + 1,
        name: "Butterfly Crystal Hair Claw - Purple",
        description: "Elegant purple hair claw features delicate crystalline butterfly accents with rhinestone details. Perfect for adding a touch of sparkle to any hairstyle.",
        price: "499",
        category: "Hair Accessories",
        stock: 50,
        images: [{ imageUrl: "/products/butterfly-claw-purple.jpg" }],
        isPublic: true,
        brand: "The Vanity",
        sku: "HC-PUR-BUTTERFLY"
    },
    {
        id: Math.floor(Math.random() * 1000000) + 2,
        name: "Gold Bow & Black Heart Earrings",
        description: "Chic gold-tone bow stud earrings featuring a dangling black heart charm with gold trim. A perfect mix of classic elegance and cute charm.",
        price: "399",
        category: "Earrings",
        stock: 50,
        images: [{ imageUrl: "/products/bow-heart-earrings.jpg" }],
        isPublic: true,
        brand: "The Vanity",
        sku: "ER-GOLD-BOW-HEART"
    },
    {
        id: Math.floor(Math.random() * 1000000) + 3,
        name: "Rectangular Acetate Hair Claw - Pink",
        description: "Minimalist rectangular hair claw in a translucent pink finish. Secure grip for daily wear with a modern aesthetic.",
        price: "299",
        category: "Hair Accessories",
        stock: 30,
        images: [{ imageUrl: "/products/rect-claw-pink.jpg" }],
        isPublic: true,
        brand: "The Vanity",
        sku: "HC-RECT-PINK"
    },
    {
        id: Math.floor(Math.random() * 1000000) + 4,
        name: "Gold Double Loop Knot Earrings",
        description: "Sophisticated gold-tone earrings featuring a double loop knot design. Versatile enough for office wear or evening outings.",
        price: "449",
        category: "Earrings",
        stock: 40,
        images: [{ imageUrl: "/products/gold-knot-earrings.jpg" }],
        isPublic: true,
        brand: "The Vanity",
        sku: "ER-GOLD-KNOT"
    },
    {
        id: Math.floor(Math.random() * 1000000) + 5,
        name: "Rectangular Acetate Hair Claw - Blue",
        description: "Cool blue translucent rectangular hair claw. Strong hold and durable material, perfect for thick hair.",
        price: "299",
        category: "Hair Accessories",
        stock: 30,
        images: [{ imageUrl: "/products/rect-claw-blue.jpg" }],
        isPublic: true,
        brand: "The Vanity",
        sku: "HC-RECT-BLUE"
    }
];

async function seedProducts() {
    if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
        console.error('❌ Please update the ADMIN_TOKEN in the script before running!');
        console.log('👉 You can find your token in the Admin Dashboard: Inspect Element -> Application -> Local Storage -> adminToken');
        process.exit(1);
    }

    console.log(`Starting seed for ${products.length} products to ${API_URL}...`);

    for (const product of products) {
        try {
            console.log(`Adding ${product.name}...`);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Added: ${product.name}`);
            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = await response.text();
                }
                console.error(`❌ Failed to add ${product.name}: ${response.status}`);
                console.error(JSON.stringify(errorData, null, 2));
            }
        } catch (err) {
            console.error(`❌ Error adding ${product.name}:`, err);
        }
    }
    console.log('Done!');
}

seedProducts();
