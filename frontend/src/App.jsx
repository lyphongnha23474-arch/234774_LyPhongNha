import React, { useState, useEffect } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const initialForm = {
  foodId: '',
  name: '',
  category: '',
  cuisine: '',
  ingredients: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: ''
};

export default function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword
        ? `${API_BASE}/api/foods?search=${encodeURIComponent(keyword)}`
        : `${API_BASE}/api/foods`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi tải danh sách món ăn');
      setFoods(data);
    } catch (err) {
      setError('Không thể kết nối Backend: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        ingredients: form.ingredients
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      };

      const url = editingId ? `${API_BASE}/api/foods/${editingId}` : `${API_BASE}/api/foods`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Thao tác thất bại');

      setMessage(editingId ? 'Cập nhật món ăn thành công!' : 'Thêm món ăn mới thành công!');
      setForm(initialForm);
      setEditingId(null);
      fetchFoods(search);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (food) => {
    setEditingId(food._id);
    setForm({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine,
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : '',
      price: food.price,
      quantity: food.quantity,
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${name}"?`)) return;
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/foods/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể xóa món ăn');
      setMessage('Đã xóa món ăn thành công!');
      fetchFoods(search);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetail = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/foods/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không tải được chi tiết');
      setSelectedFood(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <header>
        <div>
          <h2 style={{ margin: 0 }}>Hệ Thống Quản Lý Món Ăn</h2>
          <small>MSSV: 234774 - Lý Phong Nha | Backend API: {API_BASE}</small>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm (tên món, loại món, vùng miền - VD: phở)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary">Tìm kiếm</button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setSearch('');
            fetchFoods('');
          }}
        >
          Tất cả
        </button>
      </form>

      <div className="layout">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{editingId ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mã món ăn (foodId) *</label>
              <input
                required
                value={form.foodId}
                onChange={(e) => setForm({ ...form, foodId: e.target.value })}
                placeholder="VD: FD004"
              />
            </div>
            <div className="form-group">
              <label>Tên món ăn (name) *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Bánh Mì Thịt Nướng"
              />
            </div>
            <div className="form-group">
              <label>Loại món ăn (category) *</label>
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="VD: Món khô / Món nước"
              />
            </div>
            <div className="form-group">
              <label>Ẩm thực / Vùng miền (cuisine) *</label>
              <input
                required
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                placeholder="VD: Miền Nam"
              />
            </div>
            <div className="form-group">
              <label>Nguyên liệu (ingredients, cách nhau dấu phẩy)</label>
              <input
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                placeholder="VD: Bánh mì, Thịt nướng, Đồ chua"
              />
            </div>
            <div className="form-group">
              <label>Giá bán VNĐ (price) *</label>
              <input
                type="number"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Số lượng hiện có (quantity) *</label>
              <input
                type="number"
                min="0"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Đường dẫn hình ảnh (imageUrl)</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Mô tả món ăn (description)</label>
              <textarea
                rows="2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-success">
                {editingId ? 'Lưu cập nhật' : 'Thêm món ăn'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          {loading ? (
            <div className="card">Đang tải dữ liệu món ăn...</div>
          ) : foods.length === 0 ? (
            <div className="card">Không tìm thấy món ăn nào phù hợp.</div>
          ) : (
            <div className="food-grid">
              {foods.map((food) => (
                <div key={food._id} className="food-item">
                  <img
                    src={food.imageUrl || 'https://placehold.co/400x250?text=Food'}
                    alt={food.name}
                  />
                  <div className="food-body">
                    <h4 className="food-title">[{food.foodId}] {food.name}</h4>
                    <div>
                      <span className="badge">{food.category}</span>
                      <span className="badge">{food.cuisine}</span>
                    </div>
                    <div className="price">{Number(food.price).toLocaleString('vi-VN')} đ</div>
                    <small style={{ color: '#475569' }}>Số lượng: {food.quantity}</small>
                    <div className="actions">
                      <button className="btn-primary" onClick={() => handleViewDetail(food._id)}>
                        Chi tiết
                      </button>
                      <button className="btn-warning" onClick={() => handleEdit(food)}>
                        Sửa
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(food._id, food.name)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedFood && (
        <div className="modal-backdrop" onClick={() => setSelectedFood(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Chi tiết món ăn: {selectedFood.name}</h3>
            <p><strong>Mã món ăn (foodId):</strong> {selectedFood.foodId}</p>
            <p><strong>Loại món ăn:</strong> {selectedFood.category}</p>
            <p><strong>Vùng miền / Ẩm thực:</strong> {selectedFood.cuisine}</p>
            <p><strong>Giá bán:</strong> {Number(selectedFood.price).toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Số lượng hiện có:</strong> {selectedFood.quantity}</p>
            <p><strong>Nguyên liệu:</strong> {(selectedFood.ingredients || []).join(', ') || 'Chưa cập nhật'}</p>
            <p><strong>Mô tả:</strong> {selectedFood.description || 'Không có mô tả'}</p>
            <button className="btn-secondary" onClick={() => setSelectedFood(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
