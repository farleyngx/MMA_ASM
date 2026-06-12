// import React from "react";
// import { View, Text } from "react-native";

// interface PressureGaugeProps {
//   value: number; // Value in hPa
// }

// export const PressureGauge: React.FC<PressureGaugeProps> = ({ value }) => {
//   // Convert hPa to mmHg (1 hPa = 0.750062 mmHg)
//   const mmHg = Math.round(value * 0.750062);

//   // Normal atmospheric pressure is 760 mmHg (approx 1013 hPa)
//   // Let's calculate a percentage mapping from 700 to 820 mmHg
//   const minMmHg = 700;
//   const maxMmHg = 820;
//   const range = maxMmHg - minMmHg;
//   const percentage = Math.max(0, Math.min(100, ((mmHg - minMmHg) / range) * 100));
  
//   // Rotate angle for the needle: 0% is -120deg, 100% is 120deg
//   const rotateDeg = -120 + (percentage / 100) * 240;

//   return (
//     <View className="items-center justify-center mt-3">
//       {/* Gauge Outer Ring */}
//       <View className="w-28 h-28 rounded-full border-2 border-white/10 border-t-white/60 border-l-white/60 border-r-white/40 items-center justify-center relative">
        
//         {/* Dotted Scale Arc Indicators */}
//         {[...Array(9)].map((_, i) => {
//           const angle = -120 + i * 30; // Spans from -120 to 120
//           return (
//             <View
//               key={i}
//               className="absolute w-[2px] h-[6px] bg-white/30"
//               style={{
//                 transform: [
//                   { rotate: `${angle}deg` },
//                   { translateY: -48 } // Move outwards to line up with the edge
//                 ],
//               }}
//             />
//           );
//         })}

//         {/* Rotatable Needle/Indicator */}
//         <View
//           className="absolute w-1 h-[42px] items-center justify-start"
//           style={{
//             transform: [
//               { rotate: `${rotateDeg}deg` },
//             ],
//           }}
//         >
//           {/* Glowing cursor dot on the tip of the needle */}
//           <View className="w-2.5 h-2.5 rounded-full bg-weather-pastelYellow shadow-sm shadow-yellow-200" />
//         </View>

//         {/* Center reading details */}
//         <View className="items-center justify-center bg-transparent mt-2">
//           <Text className="text-2xl font-bold text-white tracking-tighter" style={{ fontFamily: "System" }}>
//             {mmHg}
//           </Text>
//           <Text className="text-[9px] text-white/50 font-semibold uppercase tracking-widest mt-0.5">
//             mmHg
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// };


import React from "react";
import { Text, View } from "react-native";

interface PressureGaugeProps {
  value: number; // Giá trị trả về từ API (đơn vị hPa)
}

export const PressureGauge: React.FC<PressureGaugeProps> = ({ value }) => {
  // 1. Chuyển đổi hPa sang mmHg
  const mmHg = Math.round(value * 0.750062);

  // 2. Thiết lập biên độ áp suất
  // Áp suất khí quyển thông thường dao động từ ~700 đến 810 mmHg
  const minMmHg = 700;
  const maxMmHg = 810;
  const range = maxMmHg - minMmHg;
  const percentage = Math.max(0, Math.min(100, ((mmHg - minMmHg) / range) * 100));

  // 3. Cấu hình vòng cung (Gauge Arc)
  const TICK_COUNT = 51; // Tăng số lượng vạch để tạo thành dải mượt mà như thiết kế
  const MIN_ANGLE = -135; // Góc bắt đầu (bên trái)
  const MAX_ANGLE = 135;  // Góc kết thúc (bên phải)
  const RANGE_ANGLE = MAX_ANGLE - MIN_ANGLE;

  // Tìm index của vạch đang trỏ tới giá trị hiện tại
  const activeIndex = Math.round((percentage / 100) * (TICK_COUNT - 1));

  return (
    <View className="items-center justify-center mt-4">
      <View className="w-40 h-40 items-center justify-center relative">
        
        {/* Render dải vạch (Ticks) */}
        {[...Array(TICK_COUNT)].map((_, i) => {
          const angle = MIN_ANGLE + i * (RANGE_ANGLE / (TICK_COUNT - 1));
          
          // Tính khoảng cách từ vạch đang render đến vạch trung tâm hiện tại
          const distance = Math.abs(i - activeIndex);
          
          // Giá trị mặc định cho các vạch nền
          let tickOpacity = 0.4;
          let height = 12;
          let width = 2;
          let isCoreActive = false;

          // Tạo hiệu ứng thanh trượt và vệt sáng (Glow)
          if (distance === 0) {
            // Thanh trượt trung tâm: Dài nhất, dày nhất và sáng 100%
            tickOpacity = 1;
            height = 19;
            width = 3.5;
            isCoreActive = true;
          } else if (distance <= 6) {
            // Vệt lan tỏa mờ dần ra 4 vạch xung quanh
            tickOpacity = 1.2 - (distance * 0.1);
            height = 12;
            width = 2.5;
          }

          return (
            <View
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width,
                height,
                opacity: tickOpacity,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -65 } // Bán kính: Đẩy các vạch ra viền của View 160x160
                ],
                // Đổ bóng (glow) mạnh cho vạch hiện tại
                ...(isCoreActive && {
                  shadowColor: "#FFFFFF",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.9,
                  shadowRadius: 6,
                  elevation: 5, // Đảm bảo hiệu ứng bóng trên Android
                })
              }}
            />
          );
        })}

        {/* Thông số hiển thị ở trung tâm */}
        <View className="absolute items-center justify-center mt-2">
          <Text 
            className="text-5xl font-extrabold text-white tracking-tight" 
          >
            {mmHg}
          </Text>
          <Text className="text-base text-white font-medium tracking-wide mt-[-2px]">
            mmHg
          </Text>
        </View>

      </View>
    </View>
  );
};
