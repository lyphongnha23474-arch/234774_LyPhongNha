require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Food = require('./models/Food');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

function parseIngredients(ingredients) {
  if (Array.isArray(ingredients)) return ingredients.map(i => String(i).trim()).filter(Boolean);
  if (typeof ingredients === 'string') return ingredients.split(',').map(i => i.trim()).filter(Boolean);
  return [];
}

// Endpoint kiem tra trang thai hoat dong cua backend
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ status: 'OK', database: dbState, timestamp: new Date() });
});

// 1. Lay danh sach mon an & 6. Tim kiem mon an theo tu khoa (?search=...)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let foods = await Food.find({}).sort({ createdAt: -1 });
    if (search && search.trim() !== "") {
      const rm = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
      const kw = rm(search.trim());
      foods = foods.filter(f => [f.foodId, f.name, f.category, f.cuisine, f.description].some(v => rm(v).includes(kw)));
    }
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Loi may chu khi lay danh sach mon an', error: err.message });
  }
});

// 2. Xem thong tin mot mon an
app.get('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const food = mongoose.Types.ObjectId.isValid(id)
      ? await Food.findById(id)
      : await Food.findOne({ foodId: id });

    if (!food) {
      return res.status(404).json({ message: 'Khong tim thay mon an' });
    }
    res.status(200).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Loi khi lay thong tin mon an', error: err.message });
  }
});

// 3. Them mon an moi
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    if (!foodId || !name || !category || !cuisine || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Vui long nhap day du: foodId, name, category, cuisine, price, quantity' });
    }
    if (Number(price) < 0 || Number(quantity) < 0 || isNaN(Number(price)) || isNaN(Number(quantity))) {
      return res.status(400).json({ message: 'Gia ban va so luong phai la so khong am hop le' });
    }

    const existing = await Food.findOne({ foodId: String(foodId).trim() });
    if (existing) {
      return res.status(409).json({ message: `Ma mon an '${foodId}' da ton tai` });
    }

    const newFood = await Food.create({
      foodId: String(foodId).trim(),
      name: String(name).trim(),
      category: String(category).trim(),
      cuisine: String(cuisine).trim(),
      ingredients: parseIngredients(ingredients),
      price: Number(price),
      quantity: Number(quantity),
      description: description || '',
      imageUrl: imageUrl || ''
    });

    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: 'Du lieu khong hop le', error: err.message });
  }
});

// 4. Cap nhat thong tin mon an
app.put('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { foodId, name, category, cuisine, ingredients, price, quantity, description, imageUrl } = req.body;

    const currentFood = mongoose.Types.ObjectId.isValid(id)
      ? await Food.findById(id)
      : await Food.findOne({ foodId: id });

    if (!currentFood) {
      return res.status(404).json({ message: 'Khong tim thay mon an de cap nhat' });
    }

    if (foodId && String(foodId).trim() !== currentFood.foodId) {
      const duplicate = await Food.findOne({ foodId: String(foodId).trim() });
      if (duplicate) {
        return res.status(409).json({ message: `Ma mon an '${foodId}' da ton tai` });
      }
      currentFood.foodId = String(foodId).trim();
    }

    if (price !== undefined && (Number(price) < 0 || isNaN(Number(price)))) {
      return res.status(400).json({ message: 'Gia ban khong hop le' });
    }
    if (quantity !== undefined && (Number(quantity) < 0 || isNaN(Number(quantity)))) {
      return res.status(400).json({ message: 'So luong khong hop le' });
    }

    if (name !== undefined) currentFood.name = String(name).trim();
    if (category !== undefined) currentFood.category = String(category).trim();
    if (cuisine !== undefined) currentFood.cuisine = String(cuisine).trim();
    if (ingredients !== undefined) currentFood.ingredients = parseIngredients(ingredients);
    if (price !== undefined) currentFood.price = Number(price);
    if (quantity !== undefined) currentFood.quantity = Number(quantity);
    if (description !== undefined) currentFood.description = description;
    if (imageUrl !== undefined) currentFood.imageUrl = imageUrl;

    const updated = await currentFood.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Loi cap nhat mon an', error: err.message });
  }
});

// 5. Xoa mon an
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = mongoose.Types.ObjectId.isValid(id)
      ? await Food.findByIdAndDelete(id)
      : await Food.findOneAndDelete({ foodId: id });

    if (!deleted) {
      return res.status(404).json({ message: 'Khong tim thay mon an de xoa' });
    }
    res.status(200).json({ message: 'Xoa mon an thanh cong', food: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Loi khi xoa mon an', error: err.message });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Da ket noi MongoDB Atlas thanh cong!');
    app.listen(PORT, () => console.log(`Backend API dang chay tai http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Loi ket noi MongoDB Atlas:', err.message);
    app.listen(PORT, () => console.log(`Backend API chay (chua ket noi DB) tai cong ${PORT}`));
  });
