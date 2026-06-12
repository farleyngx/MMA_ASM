import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, Keyboard, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ErrorMessage } from "../features/weather-search/components/ErrorMessage";
import { SearchInputField } from "../features/weather-search/components/SearchInputField";
import { useCitySearch } from "../features/weather-search/hooks/useCitySearch";

export default function SearchScreen() {
  const router = useRouter();
  const [cityName, setCityName] = useState("");
  const shouldFetch = useRef(true);

  const {
    searchCity,
    loading,
    error,
    suggestions,
    fetchSuggestions,
    clearSuggestions,
  } = useCitySearch();

  // Debounced real-time geocoding suggestions query
  useEffect(() => {
    if (!shouldFetch.current) return;

    const delayDebounceFn = setTimeout(() => {
      if (cityName.trim().length >= 2) {
        fetchSuggestions(cityName);
      } else {
        clearSuggestions();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [cityName]);

  const handleTextChange = (text: string) => {
    shouldFetch.current = true;
    setCityName(text);
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    shouldFetch.current = false;
    clearSuggestions();
    if (!cityName.trim()) return;

    const result = await searchCity(cityName);
    if (result) {
      router.push({
        pathname: "/detail",
        params: { data: JSON.stringify(result) },
      });
    }
  };

  const handleSuggestionPress = async (suggestion: any) => {
    Keyboard.dismiss();
    shouldFetch.current = false;
    const queryName = `${suggestion.name}, ${suggestion.country}`;
    setCityName(queryName);
    clearSuggestions();

    const result = await searchCity(queryName);
    if (result) {
      router.push({
        pathname: "/detail",
        params: { data: JSON.stringify(result) },
      });
    }
  };

  // Always use night background as standard layout
  const bgSource = require("../../assets/images/bg/bg-night.png");

  return (
    <ImageBackground
      source={bgSource}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Night background overlay matching the detail screen */}
      <View className="absolute inset-0 bg-black/45" />

      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-5 py-8"
        >
          {/* Header Section */}

          <View className="flex-col items-start justify-between mt-8 mb-16">
            <View>
              <Text className="text-6xl font-medium text-white uppercase tracking-tighter mb-3">
                Search City
              </Text>
              <Text className="text-white/60 font-light text-xl mt-4 leading-relaxed tracking-wider">
                Enter a city name to explore real-time weather details, or pick one from the list of suggestions below.
              </Text>
            </View>
          </View>

          {/* Input Block */}
          <View className="mb-8 relative z-50">
            <View className="relative w-full z-50">
              <SearchInputField
                value={cityName}
                onChangeText={handleTextChange}
                onSubmit={handleSearch}
                loading={loading}
              />
            </View>
            {error && <ErrorMessage message={error} />}
          </View>

          {/* Real-time search suggestions displayed in a 2-column Bento Grid */}
          {suggestions.length > 0 && (
            <View className="mt-4">
              <Text className="text-xl text-white/40 font-bold uppercase tracking-[0.2em] mb-4">
                Suggestions
              </Text>


              <ScrollView
                showsVerticalScrollIndicator={true}
                className="flex-1 h-[160px] w-full"
              >
                <View className="flex-row flex-wrap justify-between gap-y-3">
                  {suggestions.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSuggestionPress(item)}
                      className="w-full p-4 border border-white bg-transparent flex-row justify-between h-auto"
                      activeOpacity={0.7}
                    >
                      <View>
                        <Text className="text-xl font-extrabold text-white uppercase tracking-tighter">
                          {item.name}
                        </Text>
                        {item.state && (
                          <Text className="text-lg text-white/40 font-semibold uppercase tracking-wider">
                            {item.state}
                          </Text>
                        )}
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-2xl text-white/50 font-bold uppercase tracking-widest px-5">
                          {item.country}
                        </Text>
                        <Ionicons name="arrow-forward-outline" size={24} color="white" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
