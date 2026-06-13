import React from "react";
import { ScrollView, Text, View } from "react-native";
import { WeatherIcon3D } from "../../../shared/components/WeatherIcon3D";
import { FormattedForecastItem } from "../hooks/useWeatherData";

interface ForecastListHorizontalProps {
  data: FormattedForecastItem[];
}

export const ForecastListHorizontal: React.FC<ForecastListHorizontalProps> = ({ data }) => {
  // Helper to format dateStr (e.g., "12 June" to "12 Jun")
  const formatToDayMonth = (dateStr: string) => {
    const parts = dateStr.split(" ");
    if (parts.length >= 2) {
      const day = parts[0];
      const month = parts[1].slice(0, 3);
      return `${day} ${month}`;
    }
    return dateStr;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="w-full"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-row">
        {data.map((item, index) => {
          const isLast = index === data.length - 1;
          return (
            <View
              key={index}
              className={`min-w-[150px] ritems-center justify-between py-6 `}
            >
              {/* Day Name & Date */}
              <View className="items-center">
                <Text className="text-md font-bold text-white uppercase tracking-wider py-2">
                  {item.dayName === "Today" ? "Today" : item.dayName.slice(0, 3)}
                </Text>
                <Text className="text-md text-white font-bold uppercase tracking-widest my-2">
                  {formatToDayMonth(item.dateStr)}
                </Text>
              </View>

              {/* 3D Weather Icon */}
              <View className="my-6">
                <WeatherIcon3D iconCode={item.icon} size={45} />
              </View>

              {/* Temperatures Max & Min */}
              <View className="flex-row items-baseline space-x-1.5">
                <Text className="text-xl font-bold text-white tracking-tighter">
                  {item.tempMax}° |   
                </Text>
                <Text className="text-xl font-light text-white/70 tracking-tighter">
                  | {item.tempMin}°
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
export default ForecastListHorizontal;
