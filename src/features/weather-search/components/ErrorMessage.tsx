import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View className="flex-row items-center border border-weather-pastelRed/35 bg-weather-pastelRed/10 w-full p-4 mt-4 space-x-3">
      <Ionicons name="alert-circle-outline" size={20} color="#F7C2C9" />
      <View className="flex-1">
        <Text className="text-weather-pastelRed text-xs font-medium uppercase tracking-wider leading-relaxed">
          {message}
        </Text>
      </View>
    </View>
  );
};
