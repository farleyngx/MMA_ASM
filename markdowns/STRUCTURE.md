# 🌤️ High-Contrast Weather App Project Specification (FSD Pattern)

---

## 🛠️ Tech Stack & Architecture Pattern

- **Framework:** React Native (Expo Router)

- **Styling:** Tailwind CSS (NativeWind v4) với font chữ Switzer chủ đạo, sử dụng border mỏng màu trắng để phân chia các khối lưới (Grid).

- **Architecture Pattern:** Feature-Sliced Design (FSD) - Scaled Down (Tổ chức theo luồng tính năng lớn.

- **Data Fetching & State:** Axios + React Hooks + Expo Context/Router Params.

---

## 📂 Complete Directory Tree Structure

```text
.
├── .env                          # Lưu trữ API Key và Endpoint bí mật
├── tailwind.config.js            # Định nghĩa font Switzer và palette màu #0c0b17, #3c6cc4
├── package.json
├── assets
│   ├── images                    # Ảnh nền; ảnh .png transparent đám mây/mặt trời/mặt trăng,... hỗ trợ render UI
└── src
    ├── app
    │   ├── _layout.tsx           # Cấu hình Fonts, Root Navigation Stack
    │   ├── welcome.tsx           # Welcome / Onboarding Screen
    │   ├── search.tsx            # City Search Screen (Màn hình nhập tên thành phố)
    │   └── detail.tsx            # Weather Detail Screen (Chứa 2 Tab: Current & 5-Day Forecast)
    │
    ├── features
    │   ├── weather-search        # Feature 1: Tìm kiếm và xử lý nhập liệu địa điểm
    │   │   ├── components
    │   │   │   ├── SearchInputField.tsx # Ô nhập tên thành phố
    │   │   │   └── ErrorMessage.tsx     # Banner hiển thị lỗi 404 hoặc mất mạng
    │   │   └── hooks
    │   │       └── useCitySearch.ts     # Hook quản lý fetch data khi nhấn Tìm kiếm
    │   │
    │   └── weather-display       # Feature 2: Hiển thị thông số chi tiết
    │       ├── components
    │       │   ├── CurrentMetricsGrid.tsx # Lưới thông số (Temperature, Wind, Pressure, Sunset)
    │       │   ├── HourlyTimeline.tsx     # Trục thời gian ngang (Now, 11 AM, 12 AM...)
    │       │   ├── ForecastList.tsx       # Danh sách FlatList 5 ngày
    │       │   └── PressureGauge.tsx      # Vòng tròn hiển thị áp suất (760 mmHg)
    │       └── hooks
    │           └── useWeatherData.ts      # Hook bóc tách data, chuyển đổi độ C, tính toán UV/Sunset
    │
    ├── shared
    │   ├── components            # UI Components nguyên bản, không chứa nghiệp vụ
    │   │   └── ui
    │   │       ├── Button.tsx        # Nút "GET STARTED" viền mảnh chữ hoa
    │   │       └── GridBox.tsx       # Khung viền bọc các khối thông số (Bám sát layout kẻ chỉ trắng)
    │   ├── services
    │   │   └── api.ts            # Cấu hình Axios Instance (Base URL, Timeout)
    │   └── theme
    │       └── colors.ts         # Mã màu chuẩn chỉnh: #0C0B17 (Dark), #3C6CC4 (Blue)
    │
    └── types
        └── index.ts              # Định nghĩa cấu trúc dữ liệu OpenWeather API
```

---

## 📄 File Templates & Core Logic

1. Configuration & Theme Setup
   **.env**

```bash
EXPO_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
EXPO_PUBLIC_WEATHER_API_KEY=...
```

**src/shared/theme/colors.ts**

```tsx
export const colors = {
  weather: {
    bgDark: "#0C0B17", // Màu nền đen sâu (Welcome & Forecast)
    bgBlue: "#3C6CC4", // Màu nền xanh dương (New York Current Screen)
    textWhite: "#FEFEFE", // Chữ trắng tinh độ tương phản cao
    borderWhite: "rgba(254, 254, 254, 0.4)", // Đường chỉ line kẻ lưới trắng mờ
  },
};
```

---

2. Services & Hooks Layer
   **src/shared/services/api.ts**

```tsx
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEATHER_API_URL,
  timeout: 10000,
});
```

**src/features/weather-search/hooks/useCitySearch.ts**

Xử lý gọi API động khi nhập tên thành phố và bắt lỗi hệ thống/mất mạng.

```tsx
import { useState } from "react";
import { apiClient } from "../../../shared/services/api";

export const useCitySearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/weather", {
        params: {
          q: cityName,
          units: "metric",
          appid: process.env.EXPO_PUBLIC_WEATHER_API_KEY,
        },
      });
      setLoading(false);
      return response.data; // Trả về dữ liệu thành phố để truyền qua trang Detail
    } catch (err: any) {
      setLoading(false);
      if (!err.response) {
        setError("Không có kết nối Internet. Vui lòng kiểm tra mạng.");
      } else if (err.response.status === 404) {
        setError("Không tìm thấy thành phố này. Vui lòng nhập lại chính xác.");
      } else {
        setError("Đã xảy ra lỗi hệ thống khi lấy dữ liệu.");
      }
      return null;
    }
  };

  return { searchCity, loading, error, setError };
};
```

---

3. Feature Components Layer (Bám sát thiết kế giao diện dạng lưới)

**src/features/weather-display/components/CurrentMetricsGrid.tsx**
Tái tạo lại cấu trúc chia khối lưới không viền, ngăn cách bằng border mỏng bám sát màn hình New York

```tsx
import React from "react";
import { View, Text } from "react-native";
import { PressureGauge } from "./PressureGauge";

interface CurrentMetricsGridProps {
  data: any; // Raw data từ OpenWeather
}

export const CurrentMetricsGrid: React.FC<CurrentMetricsGridProps> = ({
  data,
}) => {
  return (
    <View className="flex-row flex-wrap border-t border-white/20">
      {/* Khối Nhiệt độ */}
      <View className="w-1/2 p-4 border-r border-b border-white/20">
        <Text className="text-xs text-white/60 uppercase">Temperature</Text>
        <Text className="text-5xl font-light text-white mt-2">
          {Math.round(data.main.temp)}°
        </Text>
        <Text className="text-xs text-white/60 mt-1">
          Feels like {Math.round(data.main.feels_like)}°
        </Text>
      </View>

      {/* Khối Gió */}
      <View className="w-1/2 p-4 border-b border-white/20">
        <Text className="text-xs text-white/60 uppercase">Wind</Text>
        <Text className="text-4xl font-light text-white mt-3">
          {data.wind.speed} <Text className="text-base">m/s</Text>
        </Text>
        <Text className="text-xs text-white/60 mt-1">
          Direction: {data.wind.deg}°
        </Text>
      </View>

      {/* Khối Áp suất kèm Đồng hồ đo */}
      <View className="w-1/2 p-4 border-r border-white/20">
        <Text className="text-xs text-white/60 uppercase">Pressure</Text>
        <Text className="text-3xl font-light text-white mt-2">
          {data.main.pressure} <Text className="text-sm">hPa</Text>
        </Text>
        <View className="mt-2 items-center">
          <PressureGauge value={data.main.pressure} />
        </View>
      </View>

      {/* Khối Hoàng hôn */}
      <View className="w-1/2 p-4">
        <Text className="text-xs text-white/60 uppercase">Sunset</Text>
        <Text className="text-2xl font-light text-white mt-4">
          {new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
};
```

4. Router Pages Layer
   **src/app/detail.tsx (Màn hình Chi tiết)**
   Nhận data từ trang tìm kiếm, cho phép chuyển đổi linh hoạt hoặc cuộn để xem dự báo 5 ngày (5 DAY LIMIT FREE API).

```tsx
import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-router-native";
import { useLocalSearchParams } from "expo-router";
import { CurrentMetricsGrid } from "../features/weather-display/components/CurrentMetricsGrid";
import { HourlyTimeline } from "../features/weather-display/components/HourlyTimeline";

export default function DetailScreen() {
  const params = useLocalSearchParams();
  // Parse chuỗi JSON nhận được từ màn hình search qua router hướng đối tượng
  const weatherData = params.data ? JSON.parse(params.data as string) : null;

  if (!weatherData) return null;

  return (
    // Check nếu thời tiết âm sâu hoặc ban đêm thì dùng nền Dark, ngược lại dùng nền Blue bám sát UI
    <SafeAreaView
      className={`flex-1 ${weatherData.main.temp < 0 ? "bg-[#0C0B17]" : "bg-[#3C6CC4]"}`}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
        {/* Khối tiêu đề lớn đặc trưng của Switzer Font */}
        <View className="my-6">
          <Text className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            Weather In
          </Text>
          <Text className="text-4xl font-bold text-white uppercase mt-1">
            {weatherData.name}
          </Text>
        </View>

        {/* Lưới thông số tổng hợp */}
        <CurrentMetricsGrid data={weatherData} />

        {/* Biểu đồ dòng thời gian trong ngày */}
        <Text className="text-xs font-semibold text-white/60 uppercase mt-8 mb-4 tracking-wider">
          Hourly Timeline
        </Text>
        <HourlyTimeline coord={weatherData.coord} />
      </ScrollView>
    </SafeAreaView>
  );
}
```
