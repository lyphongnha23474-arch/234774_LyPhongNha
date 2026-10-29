require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const sampleFoods = [
  {
    foodId: 'FD001',
    name: 'Phở Bò Tái Lăn',
    category: 'Món nước',
    cuisine: 'Miền Bắc',
    ingredients: ['Bánh phở', 'Thịt bò', 'Hành lá', 'Nước dùng xương'],
    price: 55000,
    quantity: 50,
    description: 'Phở bò truyền thống Hà Nội với thịt bò xào tái lăn thơm lừng.',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600'
  },
  {
    foodId: 'FD002',
    name: 'Bún Bò Huế',
    category: 'Món nước',
    cuisine: 'Miền Trung',
    ingredients: ['Bún sợi to', 'Bắp bò', 'Giò heo', 'Chả cua', 'Sả ớt'],
    price: 60000,
    quantity: 40,
    description: 'Bún bò chuẩn vị Cố đô với nước dùng đậm đà hương sả và mắm ruốc.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600'
  },
  {
    foodId: 'FD003',
    name: 'Cơm Tấm Sườn Bì Chả',
    category: 'Món khô',
    cuisine: 'Miền Nam',
    ingredients: ['Gạo tấm', 'Sườn nướng', 'Bì heo', 'Chả trứng', 'Nước mắm ngọt'],
    price: 50000,
    quantity: 65,
    description: 'Cơm tấm Sài Gòn đặc trưng với sườn nướng mật ong mềm ngon.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600'
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Da ket noi MongoDB Atlas: 234774_LyPhongNha');
    for (const item of sampleFoods) {
      await Food.findOneAndUpdate({ foodId: item.foodId }, item, { upsert: true, new: true });
    }
    console.log('Da them thanh cong 3 ban ghi mon an mau vao collection foods!');
    process.exit(0);
  } catch (err) {
    console.error('Loi ket noi hoac them du lieu:', err.message);
    process.exit(1);
  }
}

seedDB();
