# 🌤️ Weather Flow - Development State & Handoff Context

Tệp tin này ghi lại toàn bộ tiến độ, kiến trúc, cấu trúc thư mục, các tài nguyên 3D đã được tạo ra, và ngữ cảnh định tuyến của dự án tính đến thời điểm hiện tại. Nó đóng vai trò là một tài liệu handoff giúp lập trình viên hoặc AI trợ lý trong phiên tiếp theo nắm bắt nhanh chóng hiện trạng dự án.

---

## 🛠️ Công nghệ & Cấu hình (Tech Stack)

*   **Framework:** React Native + Expo (SDK v54.0.34) + Expo Router.
*   **Styling:** Tailwind CSS (NativeWind v4) tích hợp font chữ Switzer chủ đạo, sử dụng border mỏng màu trắng mờ (`border-white/20`) để phân tách các lưới bám sát thiết kế Dribbble.
*   **Data Fetching:** Axios Instance.
*   **Dependency Alignment:** Đã đồng bộ `babel-preset-expo` về phiên bản tương thích với SDK 54 (`54.0.11`) để tránh xung đột biên dịch.

---

## 📂 Cấu trúc Thư mục Dự án Hiện tại (FSD Pattern)

Dự án đã được dọn sạch hoàn toàn các thư mục mẫu mặc định ở gốc (`/app`, `/components`, `/constants`, `/hooks`) và chuyển đổi sang mô hình cấu trúc **Feature-Sliced Design (FSD)** thu gọn bên trong thư mục [src](file:///D:/FPT/SU26/MMA301/Projects/Asm2_SE191034_WeatherApp/src):

```text
.
├── .env                              # API Key & Endpoint
├── tailwind.config.js                # Định nghĩa font Switzer, màu nền và hệ màu pastel
├── babel.config.js                   # Cấu hình Babel NativeWind v4
├── metro.config.js                   # Tích hợp NativeWind CSS bundler
├── global.css                        # Import directives của Tailwind
├── nativewind-env.d.ts               # Khai báo kiểu TypeScript cho Tailwind class
├── tsconfig.json                     # TypeScript config
├── assets
│   └── images
│       ├── moon.png                  # Ảnh bề mặt mặt trăng 3D dùng ở Welcome Screen
│       └── w_*.png                   # Trọn bộ 12 ảnh 3D thời tiết tương ứng mã OpenWeather
├── markdowns
│   ├── MappingIcon.md                # Bảng mapping mã thời tiết của OpenWeather
│   └── DEVELOPMENT_STATE.md          # Tài liệu ngữ cảnh hiện tại (File này)
└── src
    ├── app
    │   ├── _layout.tsx               # Root Stack Navigator không viền, import global.css
    │   ├── index.tsx                 # Entry-point chuyển hướng tự động sang /welcome
    │   ├── welcome.tsx               # Welcome / Onboarding Screen
    │   ├── search.tsx                # City Search Screen & Danh sách gợi ý nhanh vị trí
    │   └── detail.tsx                # Weather Detail Screen (Chuyển tab Current / Forecast)
    │
    ├── features
    │   ├── weather-search            # Feature 1: Tìm kiếm & Vùng nhập liệu địa điểm
    │   │   ├── components
    │   │   │   ├── SearchInputField.tsx
    │   │   │   └── ErrorMessage.tsx
    │   │   └── hooks
    │   │       └── useCitySearch.ts  # Tìm kiếm động + Hỗ trợ Mock data cho TP.HCM, NY...
    │   │
    │   └── weather-display           # Feature 2: Hiển thị thông số thời tiết chi tiết
    │       ├── components
    │       │   ├── CurrentMetricsGrid.tsx # Lưới thông số (chia thành 2 hàng Top và Bottom)
    │       │   ├── HourlyTimeline.tsx     # Trục thời gian ngang dùng 3D Weather Icons
    │       │   ├── ForecastList.tsx       # FlatList hiển thị 10 ngày dự báo dạng dòng kèm 3D Icons
    │       │   └── PressureGauge.tsx      # Đồng hồ đo áp suất mmHg với kim xoay tương ứng
    │       └── hooks
    │           └── useWeatherData.ts      # Xử lý bóc tách forecast data / trả về mock chi tiết
    │
    ├── shared
    │   ├── components
    │   │   ├── WeatherIcon3D.tsx     # Component dùng chung giải mã OpenWeather Code -> Ảnh 3D
    │   │   └── ui
    │   │       ├── Button.tsx        # Nút "GET STARTED" outline bám sát Dribbble
    │   │       └── GridBox.tsx       # Container bọc ô lưới phân cách chỉ trắng mờ
    │   ├── services
    │   │   └── api.ts                # Khởi tạo Axios Instance
    │   └── theme
    │       └── colors.ts             # Định nghĩa mã màu pastel và mã màu nền của hệ thống
    │
    └── types
        └── index.ts                  # Định nghĩa TypeScript cho OpenWeather API
```

---

## 🎨 Trọn bộ Asset 3D & Component `WeatherIcon3D`

Để tái hiện lại giao diện 3D lung linh như Dribbble, chúng tôi đã sinh ra 12 ảnh 3D chuyên biệt và xây dựng component dùng chung [WeatherIcon3D.tsx](file:///D:/FPT/SU26/MMA301/Projects/Asm2_SE191034_WeatherApp/src/shared/components/WeatherIcon3D.tsx). 

*(Lưu ý: Tất cả các ảnh w_*.png và ảnh moon.png đều đã được xử lý tách nền đen thành nền trong suốt transparent bằng thuật toán khử viền và làm mềm cạnh. Đặc biệt, bộ 12 icon thời tiết mới từ grid 4x3 template.png đã được tự động cắt nhỏ và làm sạch nền bàn cờ (checkerboard) về transparent hoàn hảo bằng thuật toán BFS flood-fill, sau đó nén về kích thước 128x128 (~5KB - 16KB mỗi file) và thay thế đồng bộ trong assets/images/icons/ để đạt tốc độ render tức thì).*

| Mã OpenWeather | Tình trạng | Asset 3D được hiển thị |
| :--- | :--- | :--- |
| `01d` / `01n` | Trời quang đãng | Mặt trời thủy tinh vàng óng `w_01d.png` / Mặt trăng gốm sứ sáng `w_01n.png` |
| `02d` / `02n` | Có mây rải rác | Mặt trời nấp sau mây 3D `w_02d.png` / Mặt trăng nấp sau mây 3D `w_02n.png` |
| `03d` / `03n` | Nhiều mây | Đám mây bông xốp trắng `w_03d.png` |
| `04d` / `04n` | Mây u ám | Đám mây xám nặng trĩu u ám `w_04d.png` |
| `09d` / `09n` | Mưa rào | Đám mây xám kèm hạt mưa bong bóng thủy tinh `w_09d.png` |
| `10d` / `10n` | Mưa thường | Mây mưa có nắng chiếu `w_10d.png` / Mây mưa có trăng đêm `w_10n.png` |
| `11d` / `11n` | Mưa dông, sấm sét | Mây đen kèm tia sét nổi 3D `w_11d.png` |
| `13d` / `13n` | Tuyết rơi | Đám mây xốp trắng rơi bông tuyết 3D `w_13d.png` |
| `50d` / `50n` | Sương mù | Các dải sương mù xám khói `w_50d.png` |

---

## 🔄 Luồng Điều hướng & Thiết kế Giao diện (Navigation Flow)

1.  **Welcome Screen (`welcome.tsx`):**
    *   Màn hình đầu tiên người dùng nhìn thấy khi mở ứng dụng.
    *   Sử dụng thẻ `<ImageBackground>` kết xuất ảnh nền tối `bg-night.png` mượt mà, bao bọc toàn bộ khung nội dung.
    *   Ở đáy là hình bán cầu mặt trăng 3D cực lớn (`moon.png`) và nút "GET STARTED" viền mảnh chữ hoa.
2.  **Weather Detail Screen (`detail.tsx`):**
    *   Sử dụng thẻ `<ImageBackground>` tự động thay đổi luân phiên giữa `bg-day.png` và `bg-night.png` dựa trên ký tự hậu tố biểu tượng thời tiết (Day/Night) trả về từ API (ví dụ: `01d` trả về ngày, `13n` trả về đêm).
    *   **Tab Current:**
        *   Thời gian Ngày: Áp dụng lớp phủ xanh dương trong mờ (`bg-weather-bgBlue/80`) trên ảnh nền `bg-day.png` để tạo màu trời xanh ngát bám sát Dribbble.
        *   Thời gian Đêm: Áp dụng lớp phủ tối nhẹ (`bg-black/40`) để tạo bầu không khí đêm tĩnh mịch.
    *   **Tab Forecast:** Áp dụng lớp phủ tối sâu (`bg-black/70`) trên ảnh nền đêm để tạo sắc đen tối giản `#0C0B17` đúng tinh thần Dribbble, trong khi các đám mây chìm của background vẫn hiện ẩn hiện tinh tế.
3.  **City Search Screen (`search.tsx`):**
    *   Tự động phát hiện sáng/tối theo thời gian giờ hiện tại của thiết bị (Ban ngày: 6:00 - 18:00, Ban đêm: 18:00 - 6:00 hôm sau) để hiển thị `bg-day.png` hoặc `bg-night.png` tương ứng.
    *   Sử dụng lớp phủ giảm sáng dịu nhẹ (`bg-black/30`) đảm bảo văn bản trắng độ tương phản cao luôn rõ nét và dễ đọc.

---

## 🧪 Hệ thống Dữ liệu Mẫu (Fallback Mock Database)

Để ứng dụng luôn hoạt động hoàn hảo ngay cả khi không có mạng hoặc chưa nhập API Key, các hook (`useCitySearch`, `useWeatherData`) chứa cơ chế tự nhận diện và cung cấp dữ liệu mô phỏng cực kỳ chi tiết:
*   Nếu gõ tìm kiếm **"New York"**, app sẽ trả về chính xác số liệu trên ảnh Dribbble để nhà thiết kế hoặc giảng viên đánh giá trực tiếp:
    *   Nhiệt độ: `-17°` (Feels like `-23°`, Max `-14°`, Min `-19°`).
    *   Gió: `3 m/s` (Tây Bắc, giật tới `5 m/s`).
    *   Áp suất: `760 mmHg` (Đồng hồ quay đúng chuẩn).
    *   Dự báo 10 ngày: Khớp chuẩn xác chuỗi ngày và nhiệt độ chênh lệch trên màn hình mẫu.
*   Hỗ trợ tương tự cho **TP.HCM** (32°C, có mây ấm), **Hanoi** (26°C), **London** (12°C mưa), **Tokyo** (8°C trời quang).

---

## ⚡ Kiểm thử & Khởi chạy (Running & Testing)

Mã nguồn hiện tại đã được cấu hình chặt chẽ và không có bất cứ lỗi biên dịch TypeScript nào.
Để chạy thử nghiệm ứng dụng với Metro Bundler đã được làm sạch bộ nhớ cache:

```bash
npx expo start -c
```
