import React from "react";
import { View, Text } from "react-native";
import { WeatherDataResponse } from "../../../../types";
import { Ionicons } from "@expo/vector-icons";

interface TempDetailViewProps {
  data: WeatherDataResponse;
}

export const TempDetailView: React.FC<TempDetailViewProps> = ({ data }) => {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const tempMax = Math.round(data.main.temp_max);
  const tempMin = Math.round(data.main.temp_min);
  const humidity = data.main.humidity;
  const description = data.weather[0]?.description || "";

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Ionicons name="thermometer-outline" size={24} color="#F7C2C9" />
        <Text className="text-white text-lg font-bold uppercase tracking-wider ml-2">
          Temperature Details
        </Text>
      </View>

      {/* Main Temperature Display */}
      <View className="flex-row items-center justify-between border-b border-white/10 pb-6 mb-6">
        <View>
          <Text className="text-7xl font-light text-white tracking-tighter">
            {temp}°
          </Text>
          <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-1">
            {description}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-white/50 font-bold uppercase tracking-wider">
            Feels Like
          </Text>
          <Text className="text-3xl font-bold text-white mt-1">
            {feelsLike}°
          </Text>
        </View>
      </View>

      {/* Bento breakdown cards */}
      <View className="flex-row space-x-3 mb-4">
        {/* Max / Min card */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            Daily Extremes
          </Text>
          <View className="flex-row justify-between items-end mt-2">
            <View>
              <Text className="text-[9px] text-white/50 uppercase tracking-widest">MAX</Text>
              <Text className="text-xl font-bold text-white mt-0.5">{tempMax}°</Text>
            </View>
            <View>
              <Text className="text-[9px] text-white/50 uppercase tracking-widest">MIN</Text>
              <Text className="text-xl font-bold text-white/40 mt-0.5">{tempMin}°</Text>
            </View>
          </View>
        </View>

        {/* Humidity card */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            Humidity
          </Text>
          <View className="flex-row items-baseline justify-between mt-2">
            <Text className="text-3xl font-extrabold text-white tracking-tighter">
              {humidity}%
            </Text>
            <Ionicons name="water-outline" size={20} color="#A8C5EC" />
          </View>
        </View>
      </View>

      {/* Helpful context */}
      <View className="p-4 border border-white/10 bg-black/20">
        <Text className="text-white/70 text-xs font-light leading-relaxed">
          Nhiệt độ hiện tại ở {data.name} là {temp}°C. Với độ ẩm khoảng {humidity}%, cảm giác thực tế ngoài trời giống như {feelsLike}°C. Sự chênh lệch nhiệt độ trong ngày dao động trong khoảng từ {tempMin}°C đến {tempMax}°C.
        </Text>
      </View>
    </View>
  );
};
export default TempDetailView;
