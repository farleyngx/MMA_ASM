import React from "react";
import { Text, View } from "react-native";
import { WeatherIcon3D } from "../../../shared/components/WeatherIcon3D";
import { FormattedForecastItem } from "../hooks/useWeatherData";

interface ForecastListProps {
  data: FormattedForecastItem[];
}

export const ForecastList: React.FC<ForecastListProps> = ({ data }) => {


  return (
    <View className="flex-1">
      {data.map((item, index) => {
        const isToday = index === 0;
        const isLast = index === data.length - 1;

        if (isToday) {
          return (
            <View
              key={index}
              className="p-5 flex-1 flex-row items-center border-b border-white/30"
            >
              {/* Left 1/2: dd/month, "Today", temp max-min */}
              <View className="w-1/2 flex-col justify-between pr-4 ">
                <Text className="text-xl text-white/50 font-bold tracking-wider">
                  {(item.dateStr)}
                </Text>

                <Text className="text-2xl text-white tracking-widest mb-4">
                  Today
                </Text>

                <View className="flex-row mt-6">
                  <Text className="text-6xl font-light text-white px-4">
                    {item.tempMax}°
                  </Text>
                  <Text className="text-6xl font-light text-white/40">
                    {item.tempMin}°
                  </Text>
                </View>
              </View>

              {/* Right 1/2: Big 3D Weather Icon filling container */}
              <View className="w-1/2">
                <WeatherIcon3D
                  iconCode={item.icon}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>
          );
        }

        // Subsequent rows
        return (
          <View
            key={index}
            className={`flex-row flex-1 items-center p-5 w-full border-b border-white/30`}
          >
            {/* 1/3 of row: weekDayName */}
            <View className="w-2/3 flex-1 justify-start">
              <Text className="text-xl text-white/50 font-bold tracking-wider">
                {(item.dateStr)}
              </Text>
              <Text className="text-2xl font-light text-white tracking-widest">
                {item.dayName}
              </Text>
            </View>

            {/* 2/3 of row: icon and temperature */}
            <View className="w-1/3 flex-1 flex-row items-center justify-between">
              {/* Centered weather icon */}
              <WeatherIcon3D iconCode={item.icon} size={60} />


              {/* Temperature max & min on the right */}
              <View className="flex-row items-center">
                <Text className="text-2xl text-white p-4">
                  {item.tempMax}°
                </Text>
                <Text className="text-2xl text-white/40">
                  {item.tempMin}°
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
export default ForecastList;
