import React from "react";
import { ScrollView, Text, View } from "react-native";
import { WeatherIcon3D } from "../../../shared/components/WeatherIcon3D";
import { FormattedHourlyItem } from "../hooks/useWeatherData";

interface HourlyTimelineProps {
  data: FormattedHourlyItem[];
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ data }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="w-full"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-row">
        {data.map((item, index) => {
          
          return (
            <View
              key={index}
              className={`flex-1 min-w-[75px] px-5 items-center justify-between py-6`}
            >
              {/* 3D Icon */}
              <View>
                <WeatherIcon3D iconCode={item.icon} size={45} />
              </View>

              {/* Temperature */}
              <Text className="my-3 text-2xl font-bold text-white tracking-tighter">
                {item.temp}°
              </Text>

              {/* Time */}
              <Text className="text-sm text-white/70 font-bold uppercase tracking-widest">
                {item.time}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
