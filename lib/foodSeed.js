const CATEGORIES_SEED = [
  ['بيتزا 🍕', 'pizzas', 'بيتزا'],
  ['برجر 🍔', 'burgers', 'برجر'],
  ['حلويات 🍰', 'desserts', 'حلويات'],
  ['مشروبات 🥤', 'drinks', 'مشروبات'],
  ['مأكولات بحرية 🦐', 'seafoods', 'مأكولات بحرية'],
  ['مشويات 🥩', 'steaks', 'مشويات'],
  ['دجاج مقلي 🍗', 'fried-chicken', 'دجاج مقلي'],
  ['ساندوتشات 🥪', 'sandwiches', 'ساندوتشات'],
  ['أيس كريم 🍦', 'ice-cream', 'أيس كريم'],
  ['شوكولاتة 🍫', 'chocolates', 'شوكولاتة'],
  ['مشاوي (BBQ) 🍖', 'bbqs', 'مشاوي'],
  ['خبز (Breads) 🥖', 'breads', 'خبز'],
  ['لحم خنزير (Porks) 🥓', 'porks', 'لحم خنزير'],
  ['سجق (Sausages) 🌭', 'sausages', 'سجق'],
  ['Best Food ⭐', 'best-foods', 'أفضل الأطعمة']
];

const CATEGORY_FALLBACK_IMAGES = {
  desserts: 'https://goldbelly.imgix.net/uploads/showcase_media_asset/image/132029/german-chocolate-killer-brownie-tin-pack.5ebc34160f28767a9d94c4da2e04c4b9.jpg?ixlib=react-9.0.2&auto=format&ar=1%3A1'
};

const FOOD_API_BASE = 'https://free-food-menus-api-two.vercel.app';

// Imports the food API categories and their products into MongoDB. Used both by
// the admin seed endpoint and by the startup auto-seed.
async function seedFoodData({ Category, Product }) {
  for (const [nameEn, key, nameAr] of CATEGORIES_SEED) {
    const apiUrl = `${FOOD_API_BASE}/${key}`;
    let category = await Category.findOne({ apiUrl });
    if (!category) {
      const first = await fetch(apiUrl).then(r => r.json()).then(d => d[0]).catch(() => null);
      category = await Category.create({
        nameEn, nameAr, apiUrl,
        imageUrl: first?.img || CATEGORY_FALLBACK_IMAGES[key] || '',
        isActive: true
      });
    }
    if ((await Product.countDocuments({ category: category._id })) > 0) continue;
    const data = await fetch(apiUrl).then(r => r.json()).catch(() => []);
    const bulk = data.map(p => ({
      name: p.name || p.dsc || nameEn, description: p.dsc || '',
      price: Number(p.price) || 0, originalPrice: Number(p.price) || 0,
      category: category._id, imageUrl: p.img || '',
      inStock: true, featured: false, onSale: false,
      rating: Number(p.rate) || 0, reviewsCount: 0, reviews: [], sourceApi: apiUrl
    }));
    if (bulk.length) await Product.insertMany(bulk);
  }
}

module.exports = { CATEGORIES_SEED, CATEGORY_FALLBACK_IMAGES, seedFoodData };
