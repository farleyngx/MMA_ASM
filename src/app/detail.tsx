/* eslint-disable react-hooks/rules-of-hooks */
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import { CurrentMetricsGrid } from "../features/weather-display/components/CurrentMetricsGrid";
import { ForecastList } from "../features/weather-display/components/ForecastList";
import { HourlyTimeline } from "../features/weather-display/components/HourlyTimeline";
import { useWeatherData } from "../features/weather-display/hooks/useWeatherData";
import { WeatherDataResponse } from "../types";

type TabType = "current" | "forecast";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const scrollViewRef = useRef<any>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const scrollX = useSharedValue(0);

  // Sync tab state and trigger selection haptics
  const updateActiveTab = (tab: TabType) => {
    setActiveTab((prev) => {
      if (prev !== tab) {
        Haptics.selectionAsync().catch(() => { });
        return tab;
      }
      return prev;
    });
  };

  // Smooth scroll handler mapping scroll offset and ending momentum
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const pageIndex = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      const tabs: TabType[] = ["current", "forecast"];
      runOnJS(updateActiveTab)(tabs[pageIndex]);
    },
  });

  // Animate scroll view when a header tab is pressed
  const handleTabPress = (tab: TabType) => {
    updateActiveTab(tab);
    const pageIndex = tab === "current" ? 0 : 1;
    scrollViewRef.current?.scrollTo({
      x: pageIndex * SCREEN_WIDTH,
      animated: true,
    });
  };

  // Parse weather data from router parameters
  const weatherData: WeatherDataResponse | null = params.data
    ? JSON.parse(params.data as string)
    : null;

  // Fetch forecast and hourly weather details using our hook
  const { hourly, forecast, loading, error } = useWeatherData(
    weatherData?.coord.lat ?? 0,
    weatherData?.coord.lon ?? 0,
    weatherData?.name ?? ""
  );

  if (!weatherData) {
    return (
      <SafeAreaView className="flex-1 bg-weather-bgDark items-center justify-center">
        <Text className="text-white text-base">Không có dữ liệu thời tiết.</Text>
        <TouchableOpacity
          onPress={() => router.replace("/search")}
          className="mt-4 border border-white/20 px-6 py-3"
        >
          <Text className="text-white text-xs font-bold uppercase tracking-widest">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isNight = weatherData?.weather[0]?.icon.endsWith("n") ?? true;
  const bgSource = isNight
    ? require("../../assets/images/bg/bg-night.png")
    : require("../../assets/images/bg/bg-day.png");

  // Text label opacities
  const animatedCurrentTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH],
      [1, 0.5]
    );
    return { opacity };
  });

  const animatedForecastTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [0, SCREEN_WIDTH],
      [0.5, 1]
    );
    return { opacity };
  });

  return (
    <ImageBackground
      source={bgSource}
      className="flex-1"
      resizeMode="cover"
    >
      {/* <Animated.View style={[StyleSheet.absoluteFill, animatedOverlayStyle]} /> */}

      <SafeAreaView className="flex-1">
        {/* Top Header Bar */}
        <View className="flex-row items-center justify-between px-6 py-4">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.replace("/search")}
            className="flex-row items-center py-2"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-outline" size={30} color="#FEFEFE" />
            <Text className="text-white text-md font-bold uppercase tracking-widest ml-2">
              Search
            </Text>
            <Text className="text-2xl text-white">        |</Text>
          </TouchableOpacity>

          {/* Interactive sliding tab toggle bar */}
          <View className="flex-1 flex-row items-center px-4">

            <TouchableOpacity
              onPress={() => handleTabPress("current")}
              className="flex-1 items-center justify-center"
              activeOpacity={0.7}
            >
              <Animated.Text
                style={animatedCurrentTextStyle}
                className="text-white text-md font-bold uppercase tracking-widest text-center"
              >
                Current
              </Animated.Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTabPress("forecast")}
              className="flex-1 items-center justify-center"
              activeOpacity={0.7}
            >
              <Animated.Text
                style={animatedForecastTextStyle}
                className="text-white text-md font-bold uppercase tracking-widest text-center"
              >
                Forecast
              </Animated.Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main View Area */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#FEFEFE" size="large" />
            <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-4">
              Loading Details...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-white text-center text-sm">{error}</Text>
            <TouchableOpacity
              onPress={() => router.replace("/search")}
              className="mt-6 border border-white/20 px-6 py-3"
            >
              <Text className="text-white text-xs font-bold uppercase tracking-widest">Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            className="flex-1"
          >
            {/* PAGE 1: CURRENT WEATHER */}
            <View style={{ width: SCREEN_WIDTH }}>
              <Animated.ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Main Title Section */}
                <View className="flex-col items-start justify-between px-5">
                  <View>
                    <Text className="text-6xl font-medium text-white uppercase tracking-tighter mb-3">
                      Weather In
                    </Text>
                    <Text className="text-6xl font-medium text-white uppercase tracking-tighter mb-3">
                      {weatherData.name}
                    </Text>
                  </View>
                </View>

                {/* Row 1 Metrics: Temp & Wind */}
                <CurrentMetricsGrid data={weatherData} section="top" />

                {/* Middle Section: Hourly Timeline */}
                <View className="my-2">
                  <HourlyTimeline data={hourly} />
                </View>

                {/* Row 2 Metrics: Pressure & Sunset */}
                <CurrentMetricsGrid data={weatherData} section="bottom" />
              </Animated.ScrollView>
            </View>

            {/* PAGE 2: 5 DAY FORECAST */}
            <View style={{ width: SCREEN_WIDTH }}>
              <Animated.ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Main Title Section */}
                <View className="px-6">
                  <Text className="text-6xl font-medium text-white uppercase tracking-tighter mb-3">
                    5 Day Weather
                  </Text>
                  <Text className="text-6xl font-medium text-white uppercase tracking-tighter">
                    Forecast
                  </Text>
                </View>
                <ForecastList data={forecast} />
              </Animated.ScrollView>
            </View>
          </Animated.ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
