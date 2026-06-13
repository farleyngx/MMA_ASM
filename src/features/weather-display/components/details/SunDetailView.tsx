import React from "react";
import { View, Text } from "react-native";
import { WeatherDataResponse } from "../../../../types";
import { Ionicons } from "@expo/vector-icons";
import { SunsetGraph } from "../SunsetGraph";

interface SunDetailViewProps {
  data: WeatherDataResponse;
}

export const SunDetailView: React.FC<SunDetailViewProps> = ({ data }) => {
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const timezone = data.timezone;
  const dt = data.dt;

  // Convert sunrise/sunset times using timezone offset
  const formatLocalTime = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Calculate daylight duration
  const getDaylightDuration = () => {
    const durationSeconds = sunset - sunrise;
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Ionicons name="sunny-outline" size={24} color="#FCEBBE" />
        <Text className="text-white text-lg font-bold uppercase tracking-wider ml-2">
          Sun & Sunset Details
        </Text>
      </View>

      {/* Orbit graph container */}
      <View className="items-center justify-center border-b border-white/10 pb-6 mb-6">
        <SunsetGraph dt={dt} sunrise={sunrise} sunset={sunset} />
        <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-3">
          Solar Trajectory Curve
        </Text>
      </View>

      {/* Bento breakdown cards */}
      <View className="flex-row space-x-3 mb-4">
        {/* Sunrise / Sunset card */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            Astro Times
          </Text>
          <View className="flex-col mt-2 space-y-1">
            <View className="flex-row justify-between items-center">
              <Text className="text-[9px] text-white/45 uppercase">Sunrise:</Text>
              <Text className="text-xs font-bold text-white">{formatLocalTime(sunrise)}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[9px] text-white/45 uppercase">Sunset:</Text>
              <Text className="text-xs font-bold text-white">{formatLocalTime(sunset)}</Text>
            </View>
          </View>
        </View>

        {/* Day Length card */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            Daylight Duration
          </Text>
          <View className="flex-row items-baseline justify-between mt-2">
            <Text className="text-2xl font-extrabold text-white tracking-tighter">
              {getDaylightDuration()}
            </Text>
            <Ionicons name="hourglass-outline" size={20} color="#FCEBBE" />
          </View>
        </View>
      </View>

      {/* Astronomic Descriptive Context */}
      <View className="p-4 border border-white/10 bg-black/20">
        <Text className="text-white/70 text-xs font-light leading-relaxed">
          Mặt trời mọc vào lúc {formatLocalTime(sunrise)} và lặn lúc {formatLocalTime(sunset)} (theo giờ địa phương tại {data.name}). Tổng thời lượng chiếu sáng ban ngày là {getDaylightDuration()}. Đường cong đồ thị phía trên hiển thị chính xác tiến trình hiện tại của Mặt Trời so với đường chân trời.
        </Text>
      </View>
    </View>
  );
};
export default SunDetailView;
