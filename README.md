# Hướng dẫn cho Chương Trình Web Bán Sách Trực Tuyến

## Mô tả chương trình

Chương trình này là một trang web bán sách trực tuyến, với sự tương tác của ba loại người dùng: Khách (guest), Khách hàng (customer), và Quản trị viên hệ thống (admin).

### Chức năng của Người dùng không có tài khoản (guest):
- Xem danh sách sản phẩm từ cơ sở dữ liệu.
- Xem chi tiết của từng sản phẩm.
- Chọn mua sản phẩm và thêm vào giỏ hàng.
- Xem giỏ hàng, chỉnh sửa số lượng sản phẩm.
- Đăng ký tài khoản với thông tin cần thiết.

### Chức năng của Người dùng có tài khoản (customer):
- Tất cả các chức năng của khách.
- Thực hiện thanh toán và đặt hàng.

### Chức năng của Quản trị viên hệ thống (admin):
- Tất cả các chức năng của khách hàng.
- Quản lý hệ thống.

## Hướng dẫn cài đặt

### Backend (thư mục BE):
1. Mở terminal và chạy `cd BE` để di chuyển vào thư mục backend.
2. Chạy `npm install` để cài đặt các thư viện.
3. Chạy `npm start` để khởi động server.

### Frontend (thư mục fe):
1. Mở terminal và chạy `cd fe` để di chuyển vào thư mục frontend.
2. Chạy `npm install` để cài đặt các thư viện.
3. Chạy `npm start` để chạy giao diện chương trình.

Hoặc sử dụng Docker:
1. Tải và cài đặt Docker.
2. Chạy `docker-compose up -d` trong terminal để khởi chạy Docker.
3. Truy cập vào localhost:3000 trên trình duyệt.

### Tài khoản mặc định
- **Admin**: Email: tthanhphuc753@gmail.com, Password: 123456
- **Client**: Email: tthanhphuc752@gmail.com, Password: 123456

Với các bước trên, bạn đã có thể chạy chương trình một cách hoàn thiện.
