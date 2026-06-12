import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

// Map of OpenWeather icon codes to local 3D PNG assets
const assetsMap: Record<string, any> = {
  "01d": require("../../../assets/images/icons/w_01d.png"),
  "01n": require("../../../assets/images/icons/w_01n.png"),
  "02d": require("../../../assets/images/icons/w_02d.png"),
  "02n": require("../../../assets/images/icons/w_02n.png"),
  "03d": require("../../../assets/images/icons/w_03d.png"),
  "03n": require("../../../assets/images/icons/w_03d.png"), // reuse scattered cloud
  "04d": require("../../../assets/images/icons/w_04d.png"),
  "04n": require("../../../assets/images/icons/w_04d.png"), // reuse overcast cloud
  "09d": require("../../../assets/images/icons/w_09d.png"),
  "09n": require("../../../assets/images/icons/w_09d.png"), // reuse shower rain
  "10d": require("../../../assets/images/icons/w_10d.png"),
  "10n": require("../../../assets/images/icons/w_10n.png"),
  "11d": require("../../../assets/images/icons/w_11d.png"),
  "11n": require("../../../assets/images/icons/w_11d.png"), // reuse thunderstorm
  "13d": require("../../../assets/images/icons/w_13d.png"),
  "13n": require("../../../assets/images/icons/w_13d.png"), // reuse snow
  "50d": require("../../../assets/images/icons/w_50d.png"),
  "50n": require("../../../assets/images/icons/w_50d.png"), // reuse mist
};

interface WeatherIcon3DProps {
  iconCode: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  className?: string;
}

export const WeatherIcon3D: React.FC<WeatherIcon3DProps> = ({
  iconCode,
  size = 40,
  style,
  className = "",
}) => {
  // Safe resolution with fallback to white cloud
  const source = assetsMap[iconCode] || assetsMap["03d"];

  return (
    <Image
      source={source}
      style={[{ width: size, height: size }, style]}
      className={className}
      resizeMode="contain"
    />
  );
};
export default WeatherIcon3D;
