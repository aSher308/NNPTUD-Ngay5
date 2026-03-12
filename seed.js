/**
 * Seed script: Import data from utils/data.js into MongoDB Atlas
 * Run: node seed.js
 */
const mongoose = require('mongoose');
const slugify = require('slugify');
const categoryModel = require('./schemas/categories');
const productModel = require('./schemas/products');
const { dataCategories, dataProducts } = require('./utils/data');

const ATLAS_URI = 'mongodb+srv://manhcuucon_db_user:PUzM6UjSBbWXdJ41@cluster0.htkdoiw.mongodb.net/NNPTUD-C5';

async function seed() {
    try {
        await mongoose.connect(ATLAS_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Clear existing data
        await categoryModel.deleteMany({});
        await productModel.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // --- Seed Categories ---
        // Build a map: old id -> new MongoDB _id
        const categoryIdMap = {};
        let catCount = 0;

        for (const cat of dataCategories) {
            // Skip categories with empty names
            if (!cat.name || cat.name.trim() === '') continue;

            try {
                const newCat = await categoryModel.create({
                    name: cat.name,
                    slug: cat.slug || slugify(cat.name, { lower: true, strict: true }),
                    image: cat.image || 'https://placeimg.com/640/480/tech',
                    isDeleted: false
                });
                categoryIdMap[cat.id] = newCat._id;
                catCount++;
            } catch (err) {
                // Skip duplicates
                if (err.code === 11000) {
                    console.log(`⚠️  Skipped duplicate category: "${cat.name}"`);
                    // Find the existing one to map the id
                    const existing = await categoryModel.findOne({ name: cat.name });
                    if (existing) categoryIdMap[cat.id] = existing._id;
                } else {
                    console.error(`❌ Error inserting category "${cat.name}":`, err.message);
                }
            }
        }
        console.log(`📁 Inserted ${catCount} categories`);

        // --- Seed Products ---
        let prodCount = 0;
        const seenTitles = new Set();

        for (const prod of dataProducts) {
            // Skip products with duplicate titles
            if (seenTitles.has(prod.title)) continue;
            seenTitles.add(prod.title);

            // Map the old category id to the new MongoDB ObjectId
            const catId = prod.category ? categoryIdMap[prod.category.id] : null;
            if (!catId) {
                console.log(`⚠️  Skipped product "${prod.title}" - category id ${prod.category?.id} not found`);
                continue;
            }

            try {
                await productModel.create({
                    title: prod.title,
                    slug: prod.slug || slugify(prod.title, { lower: true, strict: true }),
                    price: prod.price || 0,
                    description: prod.description || '',
                    category: catId,
                    images: prod.images || ['https://placeimg.com/640/480/any'],
                    isDeleted: false
                });
                prodCount++;
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`⚠️  Skipped duplicate product: "${prod.title}"`);
                } else {
                    console.error(`❌ Error inserting product "${prod.title}":`, err.message);
                }
            }
        }
        console.log(`📦 Inserted ${prodCount} products`);

        console.log('\n🎉 Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
