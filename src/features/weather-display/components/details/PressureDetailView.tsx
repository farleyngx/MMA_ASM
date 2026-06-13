import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { WeatherDataResponse } from "../../../../types";
import { PressureGauge } from "../PressureGauge";

interface PressureDetailViewProps {
  data: WeatherDataResponse;
}

export const PressureDetailView: React.FC<PressureDetailViewProps> = ({ data }) => {
  const pressureHpa = data.main.pressure;
  const pressureMmHg = Math.round(pressureHpa * 0.750062); // convert hPa to mmHg

  // Relative pressure evaluation
  const getPressureStatus = (hpa: number) => {
    if (hpa < 1000) return { text: "Low Pressure (Áp suất thấp)", desc: "Có thể mang lại điều kiện nhiều mây hoặc có mưa." };
    if (hpa > 1020) return { text: "High Pressure (Áp suất cao)", desc: "Dẫn đến bầu trời quang đãng và khí hậu khô ráo." };
    return { text: "Normal Pressure (Áp suất bình thường)", desc: "Thể hiện thời tiết ôn hòa, ổn định." };
  };

  const status = getPressureStatus(pressureHpa);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Ionicons name="speedometer-outline" size={24} color="#A8C5EC" />
        <Text className="text-white text-lg font-bold uppercase tracking-wider ml-2">
          Barometric Pressure
        </Text>
      </View>

      {/* Main Pressure Display */}
      <View className="flex-row items-center justify-between border-b border-white/10 pb-6 mb-6">
        <View>
          <View className="flex-row items-baseline">
            <Text className="text-6xl font-light text-white tracking-tighter">
              {pressureHpa}
            </Text>
            <Text className="text-lg font-semibold text-white/70 ml-2 uppercase tracking-wider">
              hPa
            </Text>
          </View>
          <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-1">
            {status.text}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs text-white/50 font-bold uppercase tracking-wider">
            In Millimeters
          </Text>
          <Text className="text-2xl font-bold text-white mt-1">
            {pressureMmHg} <Text className="text-sm font-semibold text-white/50">mmHg</Text>
          </Text>
        </View>
      </View>

      {/* Gauge and Status breakdown */}
      <View className="flex-row space-x-3 mb-4 items-stretch">
        {/* Dynamic circular pressure gauge */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 items-center justify-center h-28">
          <PressureGauge value={pressureHpa} />
        </View>

        {/* Info breakdown card */}
        <View className="flex-1 p-4 border border-white/20 bg-white/5 flex-col justify-between h-28">
          <Text className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            Standard Reference
          </Text>
          <View className="mt-2">
            <Text className="text-xs text-white/60 font-medium">Standard Sea Level:</Text>
            <Text className="text-base font-bold text-white mt-0.5">1013.25 hPa</Text>
            <Text className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
              760 mmHg
            </Text>
          </View>
        </View>
      </View>

      {/* Context descriptive paragraph */}
      <View className="p-4 border border-white/10 bg-black/20">
        <Text className="text-white/70 text-xs font-light leading-relaxed">
          Áp suất khí quyển hiện tại đo được tại {data.name} là {pressureHpa} hPa (tương đương {pressureMmHg} mmHg). Trạng thái này thuộc về mức {status.text.toLowerCase()}. {status.desc}
        </Text>
      </View>
    </View>
  );
};
export default PressureDetailView;
