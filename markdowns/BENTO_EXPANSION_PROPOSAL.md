# 📋 Đề xuất Kỹ thuật: Tích hợp Chi tiết Bento Grid (Bento Details Bottom Sheet)

Tài liệu này đề xuất phương án kiến trúc kĩ thuật chi tiết để hiển thị thông tin chuyên sâu khi người dùng chạm vào các ô bento thuộc tab **Current** trong màn hình chi tiết thời tiết (`detail.tsx`), đảm bảo tính gọn gàng của mã nguồn và trải nghiệm UI/UX mượt mà.

---

## 🎯 Mục tiêu Thiết kế (Design Goals)
1.  **Giữ vững Ngữ cảnh (Context Preservation):** Không chuyển hướng sang màn hình mới hoàn toàn để tránh gây mệt mỏi điều hướng (navigation fatigue).
2.  **Đồng bộ Cử chỉ (Gesture-centric):** Tận dụng tối đa phản hồi vuốt kéo (swipe/drag gestures) và chuyển động mượt mà bằng Reanimated trên UI thread.
3.  **Kiến trúc Mô-đun (FSD Compliance):** Phân chia rõ ràng các view chi tiết ra ngoài màn hình chính để tránh phình to mã nguồn ở `detail.tsx`.

---

## 🛠️ So sánh Phương án & Lựa chọn Kiến trúc

Sau khi phân tích, chúng tôi đề xuất lựa chọn **Phương án A: Gesture Bottom Sheet (Bảng trượt từ đáy)** vì các lý do sau:

| Tiêu chí | Phương án A: Bottom Sheet | Phương án B: Expandable Card (Shared Element) |
| :--- | :--- | :--- |
| **Trải nghiệm UX** | Quen thuộc, dễ sử dụng (giống Apple Weather), dễ dàng đóng bằng cách vuốt xuống. | Đẹp mắt, đột phá về thị giác nhưng đòi hỏi tương tác phức tạp để đóng. |
| **Độ khó Triển khai** | **Trung bình.** Có thể tùy biến dễ dàng bằng Reanimated và Gesture Handler có sẵn. | **Khó.** Đòi hỏi đo đạc tọa độ thực tế của thẻ bento trên các kích thước màn hình khác nhau. |
| **Khả năng Mở rộng** | **Rất cao.** Dễ dàng tích hợp thêm biểu đồ lớn hay dữ liệu dạng cuộn dọc. | **Trung bình.** Không gian hiển thị bị giới hạn bởi hình dạng của thẻ cũ khi nở ra. |

---

## 📂 Đề xuất Cấu trúc Thư mục Mới

Các view chi tiết mới sẽ được tổ chức ngăn nắp trong thư mục tính năng hiển thị thời tiết (`weather-display`):

```text
src/features/weather-display/
├── components/
│   ├── CurrentMetricsGrid.tsx
│   ├── ...
│   ├── SunsetGraph.tsx
│   │
│   ├── details/                       # Thư mục chứa các View chi tiết chuyên sâu
│   │   ├── TempDetailView.tsx         # Chi tiết nhiệt độ, so sánh Max/Min & cảm giác thực tế
│   │   ├── WindDetailView.tsx         # Chi tiết hướng gió, tốc độ giật kèm la bàn động
│   │   ├── PressureDetailView.tsx     # Biểu đồ lịch sử áp suất khí quyển
│   │   └── SunDetailView.tsx          # Chi tiết thời lượng ngày/đêm & quỹ đạo mặt trời lớn
│   │
│   └── InteractiveBottomSheet.tsx     # Cấu trúc Bottom Sheet chung sử dụng Reanimated
└── hooks/
    └── useWeatherData.ts
```

---

## 🏗️ Thiết kế Blueprint mã nguồn (Code Blueprints)

### 1. Component Bottom Sheet Dùng Chung (`InteractiveBottomSheet.tsx`)
Sử dụng `react-native-gesture-handler` (đã có sẵn trong dự án) để bắt cử chỉ vuốt kéo của người dùng, mang lại phản hồi trượt 60fps mượt mà trên UI thread.

```typescript
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65; // Chiều cao bảng chi tiết chiếm 65% màn hình

interface InteractiveBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const InteractiveBottomSheet: React.FC<InteractiveBottomSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 15 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 15 });
    }
  }, [isVisible]);

  // Cử chỉ vuốt kéo xuống để đóng bảng
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = SCREEN_HEIGHT - SHEET_HEIGHT + event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 500) {
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 15 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT, SCREEN_HEIGHT - SHEET_HEIGHT],
      [0, 0.5]
    );
    return {
      opacity,
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  if (!isVisible && translateY.value === SCREEN_HEIGHT) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} className="z-50">
      {/* Nền mờ phía sau */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={backdropStyle} 
          className="absolute inset-0 bg-black" 
        />
      </TouchableWithoutFeedback>

      {/* Bảng trượt tương tác */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[{ height: SHEET_HEIGHT }, animatedStyle]}
          className="absolute bottom-0 left-0 right-0 bg-[#0C0B17] border-t border-white/20 p-6 rounded-t-[30px]"
        >
          {/* Thanh trượt chỉ dẫn ở đầu bảng (Drag Indicator) */}
          <View className="w-12 h-1.5 bg-white/20 rounded-full align-self-center mb-6 self-center" />
          
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
```

### 2. Tích hợp động vào Màn hình chính (`detail.tsx`)
Tại màn hình chi tiết, ta chỉ cần gọi một thực thể Bottom Sheet duy nhất ở đáy cây DOM để quản lý trạng thái hiển thị:

```typescript
// Trong file detail.tsx
import { InteractiveBottomSheet } from "../features/weather-display/components/InteractiveBottomSheet";
import { WindDetailView } from "../features/weather-display/components/details/WindDetailView";
import { TempDetailView } from "../features/weather-display/components/details/TempDetailView";
// ...

export default function DetailScreen() {
  const [activeDetail, setActiveDetail] = useState<'wind' | 'temp' | 'pressure' | 'sunset' | null>(null);

  // Đóng bảng và rung phản hồi nhẹ
  const handleCloseSheet = () => {
    setActiveDetail(null);
    Haptics.selectionAsync().catch(() => {});
  };

  const renderDetailContent = () => {
    switch (activeDetail) {
      case 'wind':
        return <WindDetailView data={weatherData} />;
      case 'temp':
        return <TempDetailView data={weatherData} />;
      // ... thêm các case khác tương ứng
      default:
        return null;
    }
  };

  return (
    <View className="flex-1">
      {/* Toàn bộ bố cục màn hình cũ */}
      <Animated.ScrollView>
        {/* Truyền callback bấm vào các ô bento từ CurrentMetricsGrid */}
        <CurrentMetricsGrid 
          data={weatherData} 
          section="top" 
          onPressCell={(type) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setActiveDetail(type);
          }}
        />
      </Animated.ScrollView>

      {/* Bảng điều khiển chi tiết động dùng chung */}
      <InteractiveBottomSheet 
        isVisible={activeDetail !== null} 
        onClose={handleCloseSheet}
      >
        {renderDetailContent()}
      </InteractiveBottomSheet>
    </View>
  );
}
```

---

## 🎨 Trải nghiệm UX Micro-interactions
1.  **Phản hồi Rung Xúc giác (Haptics):** 
    *   Rung phản hồi `ImpactFeedbackStyle.Light` ngay khi chạm vào ô Bento kích hoạt Bottom Sheet.
    *   Rung phản hồi `selectionAsync` khi bảng Bottom Sheet đóng lại hoàn toàn.
2.  **Spring Physics:** Sử dụng hàm `withSpring` với thông số `damping: 15` để tạo cảm giác chuyển động trượt có độ nảy vật lý tự nhiên thay vì chuyển động tuyến tính khô khan.
3.  **Backdrop Fade:** Lớp nền tối mờ phía sau biến đổi độ đậm trong mờ (`opacity` từ `0` đến `0.5`) tỷ lệ thuận với khoảng cách kéo ngón tay của người dùng.
