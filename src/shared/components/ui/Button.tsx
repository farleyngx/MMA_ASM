import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "outline" | "solid";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  variant = "outline",
  className = "",
}) => {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={loading}
      className={`w-full mt-4 py-6 items-center justify-center border border-white ${
        isOutline ? "bg-transparent" : "bg-white"
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#FEFEFE" : "#0C0B17"} size="small" />
      ) : (
        <Text
          className={`font-semibold tracking-tighter text-2xl uppercase ${
            isOutline ? "text-white" : "text-weather-bgDark"
          }`}
          style={{ fontFamily: "System" }} 
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
