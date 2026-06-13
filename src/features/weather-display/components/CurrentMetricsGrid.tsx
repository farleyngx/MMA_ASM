import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { WeatherDataResponse } from "../../../types";
import { PressureGauge } from "./PressureGauge";
import { SunsetGraph } from "./SunsetGraph";

interface CurrentMetricsGridProps {
  data: WeatherDataResponse;
  section: "top" | "bottom";
  onPressCell?: (type: "temp" | "wind" | "pressure" | "sunset") => void;
}

export const CurrentMetricsGrid: React.FC<CurrentMetricsGridProps> = ({
  data,
  section,
  onPressCell,
}) => {
  // Convert wind angle to direction string
  const getWindDirection = (deg: number) => {
    const directions = [
      "North",
      "Northeast",
      "East",
      "Southeast",
      "South",
      "Southwest",
      "West",
      "Northwest",
    ];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // Convert sunrise/sunset times
  const formatTime = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const tempMax = Math.round(data.main.temp_max);
  const tempMin = Math.round(data.main.temp_min);
  const windSpeed = data.wind.speed;
  const windDir = getWindDirection(data.wind.deg);
  const windGust = data.wind.gust ? Math.round(data.wind.gust) : Math.round(windSpeed * 1.3);

  if (section === "top") {
    return (
      <View className="flex-row border-t border-b border-white">
        {/* Temperature Cell */}
        <TouchableOpacity
          onPress={() => onPressCell?.("temp")}
          activeOpacity={0.7}
          className="w-1/2 px-5 py-8 border-r border-white"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl text-white">
              Temperature
            </Text>
            <Ionicons name="arrow-forward-outline" size={24} color="white" />
          </View>

          <Text className="text-6xl font-bold text-white mt-4 tracking-tighter">
            {temp}°
          </Text>

          <View className="mt-4 space-y-1">
            <Text className="text-xl text-white">
              Feels like {feelsLike}°
            </Text>
            <Text className="text-xl text-white font-medium tracking-wider">
              Max: {tempMax}°  •  Min: {tempMin}°
            </Text>
          </View>
        </TouchableOpacity>

        {/* Wind Cell */}
        <TouchableOpacity
          onPress={() => onPressCell?.("wind")}
          activeOpacity={0.7}
          className="w-1/2 px-5 py-8"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-xl text-white">
              Wind
            </Text>
            <Ionicons name="arrow-forward-outline" size={24} color="white" />
          </View>

          <View className="flex-row items-baseline mt-4">
            <Text className="text-6xl font-bold text-white tracking-tighter">
              {windSpeed}
            </Text>
            <Text className="text-2xl font-semibold text-white/70 ml-1.5 tracking-wider">
              m/s
            </Text>
          </View>

          <View className="mt-6 space-y-1">
            <Text className="text-xl text-white">
              {windDir}
            </Text>
            <Text className="text-xl text-white font-medium tracking-wider">
              Gusts up to {windGust} m/s
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Bottom Section: Pressure and Sunset
  return (
    <View className="flex-row border-t border-b border-white">
      {/* Pressure Cell with circular gauge */}
      <TouchableOpacity
        onPress={() => onPressCell?.("pressure")}
        activeOpacity={0.7}
        className="w-1/2 px-5 py-8 border-r border-white items-stretch justify-between"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl text-white">
            Pressure
          </Text>
          <Ionicons name="arrow-forward-outline" size={24} color="white" />
        </View>
        <PressureGauge value={data.main.pressure} />
      </TouchableOpacity>

      {/* Sunset Cell with custom sun arc path graphic */}
      <TouchableOpacity
        onPress={() => onPressCell?.("sunset")}
        activeOpacity={0.7}
        className="w-1/2 px-5 py-8 justify-between"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl text-white">
            Sunset
          </Text>
          <Ionicons name="arrow-forward-outline" size={24} color="white" />
        </View>

        <SunsetGraph dt={data.dt} sunrise={data.sys.sunrise} sunset={data.sys.sunset} />

        <Text className="text-xl text-white font-medium tracking-wider">
          Sunset at {formatTime(data.sys.sunset, data.timezone)}
        </Text>

      </TouchableOpacity>
    </View>
  );
};
