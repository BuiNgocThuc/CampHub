# CAMPHUB - HỆ THỐNG CHO THUÊ DỤNG CỤ CẮM TRẠI MÔ HÌNH P2P

**Đồ án Khóa luận Tốt nghiệp - Ngành Công nghệ Thông tin**
**Trường Đại học Sài Gòn**

## 1. TỔNG QUAN DỰ ÁN

CampHub là nền tảng thương mại điện tử hoạt động dựa trên mô hình kinh tế chia sẻ (Sharing Economy), cụ thể là mô hình ngang hàng (Peer-to-Peer). Dự án tập trung giải quyết bài toán kết nối giữa người có nhu cầu thuê và người sở hữu dụng cụ cắm trại nhàn rỗi, đồng thời cung cấp giải pháp quản lý rủi ro trong giao dịch thuê tài sản cá nhân.

Hệ thống được thiết kế để đảm bảo tính minh bạch, an toàn trong thanh toán và hỗ trợ quy trình xử lý tranh chấp (hư hỏng, mất mát tài sản) dựa trên bằng chứng số.

## 2. THÔNG TIN NHÓM THỰC HIỆN

| STT | Họ và Tên | MSSV | Vai trò |
|:---:|:---|:---:|:---|
| 1 | **Bùi Ngọc Thức** | 3121410491 | Backend & Frontend Developer, System Architect |
| 2 | **Lê Diệp Minh Nhân** | 3122410276 | Tester, UI/UX Designer |

**Giảng viên hướng dẫn:** ThS. Phan Nguyệt Minh

## 3. KIẾN TRÚC VÀ CÔNG NGHỆ

Hệ thống được xây dựng theo kiến trúc Client-Server, tách biệt hoàn toàn giữa Frontend và Backend, giao tiếp thông qua chuẩn RESTful API.

### 3.1. Backend (Server-side)
Mã nguồn: `be_camphub`

* **Ngôn ngữ:** Java (JDK 17)
* **Framework chính:** Spring Boot 3.x
* **Cơ sở dữ liệu:**
    * **PostgreSQL:** Quản lý dữ liệu quan hệ (Người dùng, Đơn hàng, Sản phẩm, Giao dịch).
    * **MongoDB:** Lưu trữ dữ liệu phi cấu trúc (Lịch sử tin nhắn Chat, Thông báo hệ thống).
* **Bảo mật:** Spring Security kết hợp JSON Web Token (JWT) và OAuth2.
* **Giao tiếp thời gian thực:** WebSocket (giao thức STOMP) cho tính năng chat và thông báo.
* **Quản lý Build:** Maven.
* **Công cụ khác:** Lombok, Hibernate/JPA, ModelMapper.

### 3.2. Frontend (Client-side)
Mã nguồn: `fe_camphub`

* **Framework:** Next.js 14 (App Router Architecture).
* **Ngôn ngữ:** TypeScript.
* **Giao diện (UI):** TailwindCSS kết hợp Material UI (MUI).
* **Quản lý trạng thái:** React Query (TanStack Query) và Zustand.
* **Xử lý Form:** React Hook Form kết hợp Zod Validation.
* **Lưu trữ Media:** Tích hợp Cloudinary API để quản lý hình ảnh sản phẩm và bằng chứng tranh chấp.

## 4. CÁC CHỨC NĂNG CHÍNH

### Phân hệ Người dùng (End-User)
1.  **Quản lý tài khoản & Xác thực:** Đăng ký, đăng nhập, xác thực email, quản lý hồ sơ cá nhân.
2.  **Thương mại điện tử:** Tìm kiếm sản phẩm (theo bộ lọc đa tiêu chí), quản lý giỏ hàng, quy trình đặt thuê (Booking).
3.  **Quản lý tài sản (Dành cho chủ đồ):** Đăng tải sản phẩm, quản lý kho hàng, phê duyệt hoặc từ chối yêu cầu thuê.
4.  **Hệ thống giao tiếp:** Chat trực tuyến 1-1 giữa người thuê và chủ đồ (real-time).
5.  **Quy trình thuê khép kín:**
    * Thanh toán và đặt cọc (Mô phỏng ví điện tử).
    * Xác nhận giao nhận hàng (Check-in/Check-out).
    * Đánh giá và phản hồi chất lượng sau giao dịch.
6.  **Xử lý sự cố:** Tạo yêu cầu trả hàng, báo cáo hư hỏng và khiếu nại bồi thường.

### Phân hệ Quản trị (Administrator)
1.  **Dashboard thống kê:** Theo dõi chỉ số kinh doanh, số lượng người dùng và lưu lượng giao dịch.
2.  **Kiểm duyệt nội dung:** Phê duyệt sản phẩm mới đăng tải để đảm bảo chất lượng nội dung trên sàn.
3.  **Giải quyết tranh chấp (Dispute Resolution):**
    * Tiếp nhận hồ sơ khiếu nại từ người dùng.
    * Xem xét bằng chứng (hình ảnh/video) từ cả hai phía.
    * Đưa ra phán quyết hoàn tiền hoặc trừ tiền cọc dựa trên chính sách.
4.  **Quản lý danh mục:** Cấu hình danh mục sản phẩm và các loại hình hư tổn (Damage Types).

## 5. HƯỚNG DẪN CÀI ĐẶT VÀ TRIỂN KHAI

### Yêu cầu tiên quyết
* Java Development Kit (JDK) 17 trở lên.
* Node.js phiên bản 18 trở lên (khuyến nghị bản LTS).
* PostgreSQL và MongoDB đã được cài đặt và đang hoạt động.

### Bước 1: Cấu hình và chạy Backend
1.  Di chuyển vào thư mục backend:
    ```bash
    cd be_camphub
    ```
2.  Cấu hình thông tin kết nối cơ sở dữ liệu và Cloudinary trong file `src/main/resources/application.yaml`.
3.  Cài đặt các thư viện phụ thuộc và khởi chạy ứng dụng:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    Backend sẽ khởi chạy tại cổng mặc định `8080`.

### Bước 2: Cấu hình và chạy Frontend
1.  Di chuyển vào thư mục frontend:
    ```bash
    cd fe_camphub
    ```
2.  Tạo file môi trường `.env` (tham khảo cấu trúc từ `.env.example` nếu có) để cấu hình `NEXT_PUBLIC_API_URL`.
3.  Cài đặt các gói thư viện:
    ```bash
    npm install
    # hoặc
    yarn install
    ```
4.  Khởi chạy môi trường phát triển:
    ```bash
    npm run dev
    ```
    Frontend sẽ truy cập được tại địa chỉ `http://localhost:3000`.

---
© 2025 Khoa Công nghệ Thông tin - Trường Đại học Sài Gòn.
