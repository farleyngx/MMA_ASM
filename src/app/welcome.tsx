import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ImageBackground, SafeAreaView, StatusBar, Text, View } from "react-native";
import { useCitySearch } from "../features/weather-search/hooks/useCitySearch";
import { Button } from "../shared/components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();
  const { searchCity, loading } = useCitySearch();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGetStarted = async () => {
    setLocalError(null);
    const result = await searchCity("Ho Chi Minh");
    if (result) {
      router.replace({
        pathname: "/detail",
        params: { data: JSON.stringify(result) },
      });
    } else {
      setLocalError("Không thể tải thời tiết TP. HCM. Đang chuyển hướng...");
      setTimeout(() => {
        router.replace("/search");
      }, 1500);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg/bg-night.png")}
      className="flex-1 bg-weather-bgDark"
    >
      <SafeAreaView className="flex-1 relative overflow-hidden items-center">
        <StatusBar barStyle="light-content" />
        
        {/* LAYER 1: BOTTOM (Typography) */}
        {/* Bỏ z-0. Vì viết đầu tiên trong code nên nó tự động nằm dưới cùng */}
        <View className="absolute top-[210px] items-center w-full">
          <Text className="text-2xl text-white font-medium tracking-wide">
            Welcome to
          </Text>
          <Text className="text-[90px] leading-[95px] font-semibold text-white text-center mt-2 tracking-tighter">
            WEATHER{"\n"}FLOW
          </Text>
        </View>

        {/* LAYER 2: MIDDLE (Moon Planet) */}
        {/* Bỏ z-30. Viết thứ 2 nên tự động đè lên Layer 1. */}
        {/* QUAN TRỌNG: Chuyển shadow-2xl từ Image lên thẻ View bọc ngoài */}
        <View className="absolute -bottom-[220px] items-center justify-center w-[800px] h-[800px] shadow-2xl shadow-white">
          <Image
            source={require("../../assets/images/moon.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>

        {/* LAYER 3: TOP (Subtext & Button Panel) */}
        {/* Bỏ z-60. Viết cuối cùng nên mặc định sẽ nằm trên cùng, đè lên Mặt trăng */}
        <View className="absolute bottom-12 w-full px-4 my-6">
          <Text className="text-white/80 text-start text-2xl tracking-tighter mb-6">
            We&apos;re here to keep you updated {"\n"} on the weather, so you can plan your day {"\n"} without surprises.
          </Text>

          {localError && (
            <Text className="text-red-400 text-xs font-bold tracking-wider uppercase text-center">
              {localError}
            </Text>
          )}

          <Button
            title="GET STARTED"
            onPress={handleGetStarted}
            loading={loading}
            variant="outline"
            className="w-full"
          />
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}