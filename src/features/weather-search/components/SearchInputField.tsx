import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  loading?: boolean;
}

export const SearchInputField: React.FC<SearchInputFieldProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "ENTER CITY NAME...",
  loading = false,
}) => {
  return (
    <View className="flex-row items-center border border-white bg-transparent w-full h-16 px-4">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(254, 254, 254, 0.4)"
        className="flex-1 text-white font-light text-xl tracking-wider h-full"
        style={{ fontFamily: "System" }}
        autoCapitalize="words"
        onSubmitEditing={onSubmit}
        editable={!loading}
      />
      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading || !value.trim()}
        className="h-full items-center justify-center pl-2"
        activeOpacity={0.7}
      >
        {loading ? (
          <Text className="text-white/60 text-xs tracking-widest uppercase">LOADING</Text>
        ) : (
          <Ionicons name="arrow-forward-outline" size={24} color="#FEFEFE" />
        )}
      </TouchableOpacity>
    </View>
  );
};
