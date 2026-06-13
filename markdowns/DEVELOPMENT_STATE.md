# 🌤️ Weather Flow - Development State & Handoff Context

Tệp tin này ghi lại toàn bộ tiến độ, kiến trúc, cấu trúc thư mục, luồng dữ liệu thật, các thuật toán đồ thị, cử chỉ vuốt mượt mà, và ngữ cảnh định tuyến của dự án tính đến thời điểm hiện tại. Nó đóng vai trò là một tài liệu handoff giúp lập trình viên hoặc AI trợ lý trong phiên tiếp theo nắm bắt nhanh chóng hiện trạng dự án.

---

## 🛠️ Công nghệ & Cấu hình (Tech Stack)

*   **Framework:** React Native + Expo (SDK v54.0.34) + Expo Router.
*   **Styling:** Tailwind CSS (NativeWind v4) tích hợp font chữ Switzer chủ đạo, sử dụng border mỏng màu trắng mờ (`border-white/20`) để phân tách các lưới bám sát thiết kế Dribbble.
*   **Data Fetching:** Axios Instance kết nối trực tiếp với OpenWeather API.
*   **Animation & Haptics:** 
    *   `react-native-reanimated` (~4.1.1) xử lý các diễn hoạt mượt mà trên UI thread (vuốt chuyển trang, trượt capsule tab, đổi màu overlay).
    *   `expo-haptics` (~15.0.8) phản hồi rung xúc giác khi kết thúc cử chỉ chuyển trang.
*   **Dependency Alignment:** Đã đồng bộ `babel-preset-expo` về phiên bản tương thích với SDK 54 (`~54.0.0`) để tránh xung đột biên dịch.

---

## 📂 Cấu trúc Thư mục Dự án Hiện tại (FSD Pattern)

Dự án tuân thủ chặt chẽ cấu trúc **Feature-Sliced Design (FSD)** thu gọn bên trong thư mục [src](file:///D:/FPT/SU26/MMA301/Projects/Asm2_SE191034_WeatherApp/src):

```text
.
├── .env                              # API Key & Endpoint thực tế
├── tailwind.config.js                # Định nghĩa font Switzer, màu nền và hệ màu pastel
├── babel.config.js                   # Cấu hình Babel NativeWind v4 & Reanimated plugin
├── metro.config.js                   # Tích hợp NativeWind CSS bundler
├── global.css                        # Import directives của Tailwind
├── nativewind-env.d.ts               # Khai báo kiểu TypeScript cho Tailwind class
├── tsconfig.json                     # TypeScript config
├── assets
│   └── images
│       ├── bg
│       │   ├── bg-day.png            # Ảnh nền ban ngày
│       │   └── bg-night.png           # Ảnh nền ban đêm
│       ├── moon.png                  # Ảnh bề mặt mặt trăng 3D dùng ở Welcome Screen
│       └── icons
│           └── w_*.png               # Bộ 12 ảnh 3D thời tiết đã làm sạch và tối ưu kích thước
├── markdowns
│   ├── MappingIcon.md                # Bảng mapping mã thời tiết của OpenWeather
│   └── DEVELOPMENT_STATE.md          # Tài liệu hiện trạng dự án (File này)
└── src
    ├── app
    │   ├── _layout.tsx               # Root Stack Navigator, cấu hình tắt strict log Reanimated
    │   ├── index.tsx                 # Entry-point chuyển hướng tự động sang /welcome
    │   ├── welcome.tsx               # Welcome / Onboarding Screen (Gọi API thật tải TP.HCM)
    │   ├── search.tsx                # City Search Screen (Chứa Grid 2 cột gợi ý Realtime)
    │   └── detail.tsx                # Weather Detail Screen (Vuốt ngang chuyển trang, Reanimated overlay)
    │
    ├── features
    │   ├── weather-search            # Feature 1: Tìm kiếm & Vùng nhập liệu địa điểm
    │   │   ├── components
    │   │   │   ├── SearchInputField.tsx
    │   │   │   └── ErrorMessage.tsx
    │   │   └── hooks
    │   │       └── useCitySearch.ts  # Tìm kiếm qua API thật + Tải đề xuất địa lý địa phương
    │   │
    │   └── weather-display           # Feature 2: Hiển thị thông số thời tiết chi tiết
    │       ├── components
    │       │   ├── CurrentMetricsGrid.tsx # Lưới thông số (chia thành 2 hàng Top và Bottom)
    │       │   ├── HourlyTimeline.tsx     # Trục thời gian ngang 24 giờ liên tục
    │       │   ├── ForecastList.tsx       # FlatList hiển thị 5 ngày dự báo (Hàng Today kích thước nhân đôi)
    │       │   ├── PressureGauge.tsx      # Đồng hồ đo áp suất mmHg với kim xoay tương ứng
    │       │   └── SunsetGraph.tsx        # Đồ thị quỹ đạo mặt trời biểu diễn dạng Sin toán học
    │       └── hooks
    │           └── useWeatherData.ts      # Xử lý bóc tách forecast 5 ngày & nội suy tuyến tính 24 giờ
    │
    ├── shared
    │   ├── components
    │   │   ├── WeatherIcon3D.tsx     # Component dùng chung giải mã OpenWeather Code -> Ảnh 3D
    │   │   └── ui
    │   │       └── Button.tsx        # Nút nhấn dùng chung có hỗ trợ trạng thái Loading
    │   ├── services
    │   │   └── api.ts                # Khởi tạo Axios Instance
    │   └── theme
    │       └── colors.ts             # Định nghĩa mã màu pastel và mã màu nền của hệ thống
    │
    └── types
        └── index.ts                  # Định nghĩa TypeScript cho OpenWeather API
```

---

## 🚀 Luồng Dữ liệu Thật (Real Live Data Flow)

Ứng dụng đã được loại bỏ hoàn toàn 100% cơ chế mock data hoặc độ trễ mạng giả lập.
1.  **Welcome Screen (`welcome.tsx`):**
    *   Khi nhấn "GET STARTED", ứng dụng gọi trực tiếp hàm API `searchCity("Ho Chi Minh")` để lấy dữ liệu thực tế thời gian thực.
    *   Trong quá trình tải, nút bấm chuyển sang trạng thái quay `ActivityIndicator` của React Native.
    *   Nếu thành công, dữ liệu được truyền sang `detail.tsx` thông qua tham số định tuyến. Nếu thất bại (ví dụ: mất mạng hoặc chưa cấu hình API Key), ứng dụng hiển thị cảnh báo đỏ và tự động chuyển hướng sang màn hình tìm kiếm `search.tsx`.
2.  **Search Screen (`search.tsx`):**
    *   Không còn các thông số thời tiết giả lập cứng bên cạnh New York, London, v.v. Tất cả mọi truy cập đều yêu cầu thực hiện tìm kiếm thật để lấy dữ liệu mới nhất.
3.  **Detail Screen (`detail.tsx`):**
    *   Các chi tiết thời tiết của thành phố hiện tại cùng với biểu đồ 24 giờ và dự báo 5 ngày kế tiếp đều được truy xuất động thông qua vĩ độ (`lat`) và kinh độ (`lon`) thực tế từ OpenWeather API.

---

## 🎨 Tinh chỉnh UI/UX & Các Thuật toán Mới

### 1. Cử chỉ vuốt ngang mượt mà (Swipe-to-Switch Paging)
*   Màn hình chi tiết (`detail.tsx`) đã thay thế các nút bấm chuyển tab Current/Forecast cứng nhắc bằng `Animated.ScrollView` có tính năng `pagingEnabled`.
*   **Trượt thanh Capsule Indicator:** Sử dụng `useAnimatedScrollHandler` để bắt vị trí cuộn `scrollX` theo thời gian thực trên UI thread. Thanh capsule nền mờ (`bg-white/15`) trượt mượt mà 1-to-1 theo ngón tay người dùng thông qua phép nội suy vị trí `translateX` từ `0` đến `88`.
*   **Làm mờ nhãn chữ:** Độ mờ (opacity) của hai chữ nhãn "Current" và "Forecast" tự động mờ dần từ `1.0` xuống `0.5` hoặc ngược lại dựa trên vị trí trang.
*   **Chuyển sắc hình nền (Overlay Morphing):** Lớp phủ tối của hình nền được nội suy màu động (`interpolateColor`) trong khi vuốt:
    *   *Ban ngày:* Đi từ màu xanh trời dương trong mờ (`rgba(60, 108, 196, 0.8)`) sang đen sâu (`rgba(0, 0, 0, 0.7)`).
    *   *Ban đêm:* Đi từ tối nhẹ (`rgba(0, 0, 0, 0.45)`) sang đen sâu (`rgba(0, 0, 0, 0.7)`).
*   **Rung phản hồi xúc giác (Haptic Feedback):** Khi trang cuộn dừng hẳn (`onMomentumEnd`), `expo-haptics` kích hoạt hiệu ứng rung nhẹ (`Haptics.selectionAsync()`) tạo cảm giác vật lý chân thực.

### 2. Đồ thị quỹ đạo Mặt trời Sin toán học (`SunsetGraph.tsx`)
*   Thay thế hình vòng cung bán nguyệt nét đứt tĩnh bằng đường cong quỹ đạo Sin chính xác.
*   **Tính toán tiến trình (`progress` từ `0` đến `1`):** 
    *   Hàm phân tích mốc thời gian hiện tại (`dt`), bình minh (`sunrise`) và hoàng hôn (`sunset`).
    *   *Ban ngày (Chiều):* Điểm giữa trưa tương ứng `progress = 0.0` (mặt trời cao nhất), hoàng hôn tương ứng `progress = 0.5` (mặt trời chạm chân trời).
    *   *Ban đêm:* Di chuyển xuống dưới sâu chạm điểm sâu nhất lúc nửa đêm tương ứng `progress = 1.0`.
*   **Dựng quỹ đạo mượt mà:** Vẽ từ 60 phân đoạn thẳng View nhỏ xíu ghép nối tiếp. Độ xoay (`rotate`) của mỗi phân đoạn được tính toán chính xác bằng đạo hàm bậc nhất của sóng hình Sin tại điểm đó để đường quỹ đạo trơn tru không bị răng cưa:
    $$\text{derivative} = -A \cdot \cos(\theta) \cdot \frac{\pi}{W}$$
*   **Hiệu ứng mờ dần (Gradient Fade):** Độ mờ giảm dần từ trái sang phải ($0.9 \rightarrow 0.2$) thể hiện quá trình chuyển đổi ngày - đêm. Mặt trời được thêm hiệu ứng phát sáng tròn mạnh và vòng hào quang (`halo`) bao quanh.

### 3. Đề xuất tìm kiếm thời gian thực dạng Grid 2 cột (Real-time Suggestions Grid)
*   Tích hợp OpenWeather Geocoding API (`https://api.openweathermap.org/geo/1.0/direct`) để tự động tìm kiếm vị trí ngay khi người dùng gõ phím.
*   **Cơ chế chống spam (Debounce):** Thiết lập độ trễ 300ms sau khi người dùng dừng gõ mới kích hoạt cuộc gọi API nhằm tối ưu tài nguyên và tránh bị giới hạn lượt gọi (Rate-limit).
*   **Bố cục Bento Grid:** Thay thế giao diện menu thả xuống (dropdown) che mất thanh tìm kiếm bằng bố cục lưới 2 cột (`flex-row flex-wrap justify-between w-[48%]`) cố định h-24 đặt trực tiếp dưới thanh tìm kiếm. Lưới này hiển thị tên thành phố, bang, mã quốc gia và nút mũi tên chuyển tiếp đồng bộ với phong cách bento của màn hình chi tiết.
*   **Tránh xung đột trạng thái:** Sử dụng cờ ref `shouldFetch` để ngăn việc đề xuất kích hoạt lại sau khi người dùng đã bấm chọn đề xuất hoặc nhấn nút tìm kiếm.

### 4. Nội suy 24 giờ liên tục cho Hourly Timeline
*   OpenWeather API miễn phí chỉ cung cấp dự báo 3 giờ một lần. Để trục Hourly hiển thị mượt mà 24 cột cách nhau đúng 1 giờ đồng hồ, hook `useWeatherData.ts` thực hiện **nội suy tuyến tính (Linear Interpolation)**:
    *   Xác định 2 mốc dự báo gốc liền kề bao quanh giờ mục tiêu.
    *   Tính toán tỉ lệ khoảng cách thời gian và nội suy nhiệt độ thực tế theo công thức tuyến tính.
    *   Lấy hình ảnh icon và điều kiện thời tiết của mốc gốc gần nhất làm đại diện.
*   Lớp bao bọc `HourlyTimeline.tsx` được giải phóng khỏi lớp bề rộng cố định `w-full` để cuộn ngang mượt mà, không bị giới hạn kích thước viewport.

### 5. Cải tiến cấu trúc lưới Forecast 5 ngày (`ForecastList.tsx`)
*   **Hàng "Today" đặc biệt:** Có chiều cao gấp đôi (`h-[140px]`) so với các dòng khác, bố cục chia đôi 50/50:
    *   *Nửa bên trái:* Biểu diễn ngày dạng rút gọn (`dd/month` - vd: "12 Jun"), nhãn chữ to "Today", nhiệt độ lớn Max-Min.
    *   *Nửa bên phải:* Icon thời tiết 3D dạng lớn lấp đầy toàn bộ diện tích (`w-full h-full`).
*   **Các hàng ngày kế tiếp:** Được chia tỷ lệ cột cố định: 1/3 bên trái hiển thị tên ngày trong tuần (`dayName`), 2/3 còn lại dành cho việc hiển thị căn giữa icon và nhiệt độ Max-Min lệch phải.

---

## ⚡ Kiểm thử & Khởi chạy (Running & Testing)

Mã nguồn hiện tại đã được cấu hình chặt chẽ, loại bỏ hoàn toàn mock data dư thừa, và đạt độ tương thích cao.
Để chạy thử nghiệm ứng dụng với Metro Bundler đã được làm sạch bộ nhớ cache:

```bash
npx expo start -c
```
