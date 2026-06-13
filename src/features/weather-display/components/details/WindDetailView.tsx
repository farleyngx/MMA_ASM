import React from "react";
import { View, Text } from "react-native";
import { WeatherDataResponse } from "../../../../types";
import { Ionicons } from "@expo/vector-icons";

interface WindDetailViewProps {
  data: WeatherDataResponse;
}

export const WindDetailView: React.FC<WindDetailViewProps> = ({ data }) => {
  const windSpeed = data.wind.speed;
  const windDeg = data.wind.deg;
  const windGust = data.wind.gust ? Math.round(data.wind.gust) : Math.round(windSpeed * 1.3);

  // Convert wind angle to direction string
  const getWindDirection = (deg: number) => {
    const directions = [
      "North (Bắc)",
      "Northeast (Đông Bắc)",
      "East (Đông)",
      "Southeast (Đông Nam)",
      "South (Nam)",
      "Southwest (Tây Nam)",
      "West (Tây)",
      "Northwest (Tây Bắc)",
    ];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const windDirText = getWindDirection(windDeg);

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Ionicons name="leaf-outline" size={24} color="#D4C7F5" />
        <Text className="text-white text-lg font-bold uppercase tracking-wider ml-2">
          Wind Details
        </Text>
      </View>

      {/* Main Wind Speed Display */}
      <View className="flex-row items-center justify-between border-b border-white/10 pb-6 mb-6">
        <View>
          <View className="flex-row items-baseline">
            <Text className="text-6xl font-light text-white tracking-tighter">
              {windSpeed}
            </Text>
            <Text className="text-lg font-semibold text-white/70 ml-2 uppercase tracking-wider">
              m/s
            </Text>
          </View>
          <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-1">
            Tốc độ gió hiện tại
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs text-white/50 font-bold uppercase tracking-wider">
            Direction
          </Text>
          <Text className="text-lg font-bold text-white mt-1 text-right">
            {windDeg}°
          </Text>
          <Text className="text-xs text-white/40 font-semibold uppercase tracking-wider mt-0.5 text-right">
            {windDirText}
          </Text>
        </View>
      </View>

      {/* Bento breakdown cards */}
      <View className="flex-row space-x-3 mb-4">
        {/* Wind Gust Card */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            Wind Gust
          </Text>
          <View className="flex-row items-baseline justify-between mt-2">
            <Text className="text-3xl font-extrabold text-white tracking-tighter">
              {windGust} <Text className="text-xs font-semibold text-white/50">m/s</Text>
            </Text>
            <Ionicons name="speedometer-outline" size={20} color="#D4C7F5" />
          </View>
        </View>

        {/* Dynamic compass simulation indicator */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28 relative overflow-hidden">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest z-10">
            Compass Angle
          </Text>
          <View className="items-center justify-center mt-2 z-10">
            {/* Simulated mini compass pointer needle */}
            <View 
              className="w-10 h-10 border border-white/25 rounded-full items-center justify-center relative bg-black/30"
              style={{
                transform: [{ rotate: `${windDeg}deg` }]
              }}
            >
              <View className="w-1 h-4 bg-[#D4C7F5] rounded-t-full absolute top-1" />
              <View className="w-1 h-4 bg-white/20 rounded-b-full absolute bottom-1" />
              <View className="w-2 h-2 bg-white rounded-full" />
            </View>
          </View>
        </View>
      </View>

      {/* Wind Description Context */}
      <View className="p-4 border border-white/10 bg-black/20">
        <Text className="text-white/70 text-xs font-light leading-relaxed">
          Gió đang thổi từ hướng {windDirText} ({windDeg} độ) với tốc độ trung bình khoảng {windSpeed} m/s. Đôi lúc có thể xuất hiện gió giật bất chợt với vận tốc lên tới {windGust} m/s. Điều này mang lại cảm giác dễ chịu mát mẻ cho khu vực {data.name}.
        </Text>
      </View>
    </View>
  );
};
export default WindDetailView;
