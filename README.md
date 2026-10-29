# 234774_LyPhongNha - Hệ Thống Quản Lý Món Ăn

## 1. Mô tả đề tài
Ứng dụng web quản lý món ăn (Thêm, Xem danh sách, Xem chi tiết, Cập nhật, Xóa, Tìm kiếm món ăn theo từ khóa) kết nối cơ sở dữ liệu đám mây MongoDB Atlas, đóng gói bằng Docker và triển khai trên Render.

- **Sinh viên thực hiện:** Lý Phong Nha
- **MSSV:** 234774

## 2. Công nghệ sử dụng
- **Backend:** Node.js, Express.js, Mongoose
- **Frontend:** React (Vite)
- **Cơ sở dữ liệu:** MongoDB Atlas (234774_LyPhongNha / collection foods)
- **Đóng gói & Triển khai:** Docker, Docker Hub, Render

## 3. Cấu trúc dự án
- backend/: Chứa mã nguồn Backend API (Node.js + Express)
- frontend/: Chứa mã nguồn giao diện Frontend (React)
- .gitignore: Loại trừ các tệp nhạy cảm (.env) và thư viện (node_modules)
- README.md: Tài liệu hướng dẫn dự án

## 4. Hướng dẫn cài đặt và chạy chương trình
### Chạy Backend:
cd backend && npm install && npm start

### Chạy Frontend:
cd frontend && npm install && npm run dev
