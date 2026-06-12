import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { WeatherDataResponse } from "../../../types";
import { PressureGauge } from "./PressureGauge";
import { SunsetGraph } from "./SunsetGraph";

interface CurrentMetricsGridProps {
  data: WeatherDataResponse;
  section: "top" | "bottom";
}

export const CurrentMetricsGrid: React.FC<CurrentMetricsGridProps> = ({
  data,
  section,
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
    // OpenWeather timestamps are in UTC. Convert to local time of the city
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
        <View className="w-1/2 py-8 px-8 border-r border-white">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl text-white font-light tracking-widest">
              Temperature
            </Text>
            <Ionicons name="arrow-forward-outline" size={24} color="rgba(254,254,254,0.8)" />
          </View>

          <Text className="text-6xl font-bold text-white mt-4 mb-4 tracking-tighter">
            {temp}°
          </Text>

          <View className="mt-4 space-y-1">
            <Text className="text-xl text-white/70">
              Feels like {feelsLike}°
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="flex-row justify-between items-center text-xl text-white/70 font-medium  tracking-tighter">
                Max: {tempMax}°
              </Text>
              <Text className="flex-row justify-between items-center text-xl text-white/70 font-medium  tracking-tighter">
                Min: {tempMin}°
              </Text>
            </View>
          </View>
        </View>

        {/* Wind Cell */}
        <View className="w-1/2 py-8 px-8 ">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl text-white font-light tracking-widest">
              Wind
            </Text>
            <Ionicons name="arrow-forward-outline" size={24} color="rgba(254,254,254,0.8)" />
          </View>

          <View className="flex-row items-baseline">
            <Text className="text-6xl font-bold text-white mt-4 mb-4 tracking-tighter">
              {windSpeed}
            </Text>
            <Text className="text-xl font-semibold text-white ml-1.5 tracking-wider">
              m/s
            </Text>
          </View>

          <View className="mt-4 space-y-1">
            <Text className="text-xl text-white/70 font-medium  tracking-tighter">
              {windDir}
            </Text>
            <Text className="text-xl text-white/70 font-medium  tracking-tighter">
              Gusts up to {windGust} m/s
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Bottom Section: Pressure and Sunset
  return (
    <View className="flex-row border-t border-b border-white">
      {/* Pressure Cell with circular gauge */}
      <View className="w-1/2 py-8 px-5 border-r border-white items-stretch justify-between">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl text-white font-light tracking-widest">
            Pressure
          </Text>
          <Ionicons name="arrow-forward-outline" size={24} color="rgba(254,254,254,0.8)" />
        </View>
        <PressureGauge value={data.main.pressure} />
      </View>

      {/* Sunset Cell with custom sun arc path graphic */}
      <View className="w-1/2 py-8 px-8 items-stretch justify-between">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl text-white font-light tracking-widest">
            Sunset
          </Text>
          <Ionicons name="arrow-forward-outline" size={24} color="rgba(254,254,254,0.8)" />
        </View>

        {/* Sun arc path graphics */}
        <SunsetGraph dt={data.dt} sunrise={data.sys.sunrise} sunset={data.sys.sunset} />

        <Text className="text-md text-white/70 font-medium uppercase tracking-wider">
          Sunset at {formatTime(data.sys.sunset, data.timezone)}
        </Text>
      </View>
    </View>
  );
};
