# 234774_LyPhongNha - Hệ Thống Quản Lý Món Ăn (Food Management)

## 1. Giới thiệu đề tài
Ứng dụng web quản lý danh sách món ăn (Thêm, Xem danh sách, Xem chi tiết, Cập nhật, Xóa, Tìm kiếm theo từ khóa) kết nối cơ sở dữ liệu đám mây MongoDB Atlas, đóng gói bằng Docker và triển khai trên Render.

- **Sinh viên thực hiện:** Lý Phong Nha
- **MSSV:** 234774

## 2. Công nghệ sử dụng
- **Backend:** Node.js, Express.js, Mongoose, CORS, Dotenv
- **Frontend:** React 18, Vite, Fetch API
- **Database:** MongoDB Atlas (`234774_LyPhongNha` / collection `foods`)
- **Đóng gói & Triển khai:** Docker, Docker Hub, Render

## 3. Cấu trúc dự án
- `backend/`: Mã nguồn Backend API (`src/models/Food.js`, `src/seed.js`, `src/server.js`, `Dockerfile`, `.env.example`)
- `frontend/`: Mã nguồn giao diện React (`src/App.jsx`, `src/App.css`, `src/main.jsx`, `Dockerfile`, `nginx.conf`, `.env.example`)
- `.gitignore`: Loại trừ `node_modules` và `.env`
- `README.md`: Tài liệu hướng dẫn và bảng thông tin nộp bài

## 4. Hướng dẫn cài đặt và chạy chương trình (Local)
### 4.1. Chạy Backend API
    cd backend
    npm install
    npm start
- Backend chạy tại: http://localhost:5000 (Health check: http://localhost:5000/health)

### 4.2. Chạy Frontend React
    cd frontend
    npm install
    npm run dev
- Frontend chạy tại: http://localhost:5173

## 5. Hướng dẫn chạy bằng Docker
### 5.1. Chạy Backend bằng Docker
    cd backend
    docker build -t lyphongnha234774/backend:latest .
    docker run -d -p 5000:5000 -e PORT=5000 -e MONGODB_URI="your_mongodb_atlas_uri" --name food-backend lyphongnha234774/backend:latest

### 5.2. Chạy Frontend bằng Docker
    cd frontend
    docker build --build-arg VITE_API_URL=http://localhost:5000 -t lyphongnha234774/frontend:latest .
    docker run -d -p 3000:80 --name food-frontend lyphongnha234774/frontend:latest

## 6. Địa chỉ triển khai trên Render
- **URL Frontend:** https://web-234774.onrender.com
- **URL Backend API:** https://api-234774.onrender.com
- **Health Check:** https://api-234774.onrender.com/health

## 7. Bảng thông tin nộp bài

| Trường thông tin | Nội dung cung cấp |
|---|---|
| `Link_GitHub` | https://github.com/lyphongnha23474-arch/234774_LyPhongNha |
| `Link_Docker_Backend` | https://hub.docker.com/r/lyphongnha234774/backend |
| `Link_Docker_Frontend` | https://hub.docker.com/r/lyphongnha234774/frontend |
| `Link_Render_App` | https://web-234774.onrender.com |
| `Link_Render_API` | https://api-234774.onrender.com |
| `Link_Data_MongoDB` | Database: `234774_LyPhongNha`, Collection: `foods` |
