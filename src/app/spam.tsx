// import { Ionicons } from "@expo/vector-icons";
// import * as Haptics from "expo-haptics";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// import { ActivityIndicator, Dimensions, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Animated, {
//   interpolate,
//   interpolateColor,
//   runOnJS,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   useSharedValue,
// } from "react-native-reanimated";
// import { CurrentMetricsGrid } from "../features/weather-display/components/CurrentMetricsGrid";
// import { ForecastList } from "../features/weather-display/components/ForecastList";
// import { HourlyTimeline } from "../features/weather-display/components/HourlyTimeline";
// import { useWeatherData } from "../features/weather-display/hooks/useWeatherData";
// import { WeatherDataResponse } from "../types";

// // Bottom Sheet & Detail Subviews imports
// import { InteractiveBottomSheet } from "../features/weather-display/components/InteractiveBottomSheet";
// import { PressureDetailView } from "../features/weather-display/components/details/PressureDetailView";
// import { SunDetailView } from "../features/weather-display/components/details/SunDetailView";
// import { TempDetailView } from "../features/weather-display/components/details/TempDetailView";
// import { WindDetailView } from "../features/weather-display/components/details/WindDetailView";

// type TabType = "current" | "forecast";
// type DetailSectionType = "temp" | "wind" | "pressure" | "sunset";

// export default function DetailScreen() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [activeTab, setActiveTab] = useState<TabType>("current");
//   const [activeDetail, setActiveDetail] = useState<DetailSectionType | null>(null);
  
//   const scrollViewRef = useRef<any>(null);
//   const { width: SCREEN_WIDTH } = Dimensions.get("window");

//   const scrollX = useSharedValue(0);

//   // Sync tab state and trigger selection haptics
//   const updateActiveTab = (tab: TabType) => {
//     setActiveTab((prev) => {
//       if (prev !== tab) {
//         Haptics.selectionAsync().catch(() => {});
//         return tab;
//       }
//       return prev;
//     });
//   };

//   // Smooth scroll handler mapping scroll offset and ending momentum
//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollX.value = event.contentOffset.x;
//     },
//     onMomentumEnd: (event) => {
//       const pageIndex = Math.round(event.contentOffset.x / SCREEN_WIDTH);
//       const tabs: TabType[] = ["current", "forecast"];
//       runOnJS(updateActiveTab)(tabs[pageIndex]);
//     },
//   });

//   // Animate scroll view when a header tab is pressed
//   const handleTabPress = (tab: TabType) => {
//     updateActiveTab(tab);
//     const pageIndex = tab === "current" ? 0 : 1;
//     scrollViewRef.current?.scrollTo({
//       x: pageIndex * SCREEN_WIDTH,
//       animated: true,
//     });
//   };

//   // Handle opening metric details with tactile haptics
//   const handlePressCell = (type: DetailSectionType) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
//     setActiveDetail(type);
//   };

//   // Handle closing details sheet
//   const handleCloseDetail = () => {
//     setActiveDetail(null);
//     Haptics.selectionAsync().catch(() => {});
//   };

//   // Render dynamic detailed modal contents
//   const renderDetailContent = () => {
//     if (!weatherData) return null;
//     switch (activeDetail) {
//       case "temp":
//         return <TempDetailView data={weatherData} />;
//       case "wind":
//         return <WindDetailView data={weatherData} />;
//       case "pressure":
//         return <PressureDetailView data={weatherData} />;
//       case "sunset":
//         return <SunDetailView data={weatherData} />;
//       default:
//         return null;
//     }
//   };

//   // Parse weather data from router parameters
//   const weatherData: WeatherDataResponse | null = params.data
//     ? JSON.parse(params.data as string)
//     : null;

//   // Fetch forecast and hourly weather details using our hook
//   const { hourly, forecast, loading, error } = useWeatherData(
//     weatherData?.coord.lat ?? 0,
//     weatherData?.coord.lon ?? 0,
//     weatherData?.name ?? ""
//   );

//   if (!weatherData) {
//     return (
//       <SafeAreaView className="flex-1 bg-weather-bgDark items-center justify-center">
//         <Text className="text-white text-base">Không có dữ liệu thời tiết.</Text>
//         <TouchableOpacity
//           onPress={() => router.replace("/search")}
//           className="mt-4 border border-white/20 px-6 py-3"
//         >
//           <Text className="text-white text-xs font-bold uppercase tracking-widest">Quay lại</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   const isNight = weatherData?.weather[0]?.icon.endsWith("n") ?? true;
//   const bgSource = isNight 
//     ? require("../../assets/images/bg/bg-night.png") 
//     : require("../../assets/images/bg/bg-day.png");

//   // Interpolated animated background overlay color based on horizontal scroll position
//   const animatedOverlayStyle = useAnimatedStyle(() => {
//     const backgroundColor = interpolateColor(
//       scrollX.value,
//       [0, SCREEN_WIDTH],
//       isNight
//         ? ["rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.70)"]
//         : ["rgba(60, 108, 196, 0.8)", "rgba(0, 0, 0, 0.70)"]
//     );
//     return { backgroundColor };
//   });

//   // Tab indicator pill sliding style (Container: width 180px, padding 2px. Pill width: 88px)
//   const animatedIndicatorStyle = useAnimatedStyle(() => {
//     const translateX = interpolate(
//       scrollX.value,
//       [0, SCREEN_WIDTH],
//       [0, 88]
//     );
//     return {
//       transform: [{ translateX }],
//     };
//   });

//   // Text label opacities
//   const animatedCurrentTextStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       scrollX.value,
//       [0, SCREEN_WIDTH],
//       [1, 0.5]
//     );
//     return { opacity };
//   });

//   const animatedForecastTextStyle = useAnimatedStyle(() => {
//     const opacity = interpolate(
//       scrollX.value,
//       [0, SCREEN_WIDTH],
//       [0.5, 1]
//     );
//     return { opacity };
//   });

//   return (
//     <ImageBackground
//       source={bgSource}
//       className="flex-1"
//       resizeMode="cover"
//     >
//       <Animated.View style={[StyleSheet.absoluteFill, animatedOverlayStyle]} />

//       <SafeAreaView className="flex-1 bg-transparent">
//         {/* Top Header Bar */}
//         <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/10">
//           {/* Back Button */}
//           <TouchableOpacity
//             onPress={() => router.replace("/search")}
//             className="flex-row items-center py-2"
//             activeOpacity={0.7}
//           >
//             <Ionicons name="arrow-back-outline" size={20} color="#FEFEFE" />
//             <Text className="text-white text-xs font-bold uppercase tracking-widest ml-2">
//               Search
//             </Text>
//           </TouchableOpacity>

//           {/* Interactive sliding tab toggle bar */}
//           <View className="flex-row border border-white/20 p-0.5 bg-black/20 w-[180px] h-[34px] relative">
//             {/* Animated sliding capsule background */}
//             <Animated.View
//               className="absolute top-[2px] bottom-[2px] left-[2px] bg-white/15"
//               style={[{ width: 88 }, animatedIndicatorStyle]}
//             />

//             <TouchableOpacity
//               onPress={() => handleTabPress("current")}
//               className="flex-1 items-center justify-center h-full"
//               activeOpacity={0.7}
//             >
//               <Animated.Text
//                 style={animatedCurrentTextStyle}
//                 className="text-white text-[10px] font-bold uppercase tracking-widest text-center"
//               >
//                 Current
//               </Animated.Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => handleTabPress("forecast")}
//               className="flex-1 items-center justify-center h-full"
//               activeOpacity={0.7}
//             >
//               <Animated.Text
//                 style={animatedForecastTextStyle}
//                 className="text-white text-[10px] font-bold uppercase tracking-widest text-center"
//               >
//                 Forecast
//               </Animated.Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Main View Area */}
//         {loading ? (
//           <View className="flex-1 items-center justify-center">
//             <ActivityIndicator color="#FEFEFE" size="large" />
//             <Text className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-4">
//               Loading Details...
//             </Text>
//           </View>
//         ) : error ? (
//           <View className="flex-1 items-center justify-center p-6">
//             <Text className="text-white text-center text-sm">{error}</Text>
//             <TouchableOpacity
//               onPress={() => router.replace("/search")}
//               className="mt-6 border border-white/20 px-6 py-3"
//             >
//               <Text className="text-white text-xs font-bold uppercase tracking-widest">Back</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <Animated.ScrollView
//             ref={scrollViewRef}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={scrollHandler}
//             scrollEventThrottle={16}
//             className="flex-1"
//           >
//             {/* PAGE 1: CURRENT WEATHER */}
//             <View style={{ width: SCREEN_WIDTH }}>
//               <Animated.ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
//                 {/* Main Title Section */}
//                 <View className="my-8">
//                   <View>
//                     <Text className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mb-1">
//                       Weather In
//                     </Text>
//                     <Text className="text-4xl font-extrabold text-white uppercase tracking-tighter leading-[0.9]">
//                       {weatherData.name}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Row 1 Metrics: Temp & Wind */}
//                 <CurrentMetricsGrid data={weatherData} section="top" onPressCell={handlePressCell} />

//                 {/* Middle Section: Hourly Timeline */}
//                 <View className="my-6">
//                   <Text className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-3">
//                     Hourly Timeline
//                   </Text>
//                   <HourlyTimeline data={hourly} />
//                 </View>

//                 {/* Row 2 Metrics: Pressure & Sunset */}
//                 <CurrentMetricsGrid data={weatherData} section="bottom" onPressCell={handlePressCell} />
//                 <View className="h-10" />
//               </Animated.ScrollView>
//             </View>

//             {/* PAGE 2: 5 DAY FORECAST */}
//             <View style={{ width: SCREEN_WIDTH }}>
//               <Animated.ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
//                 {/* Main Title Section */}
//                 <View className="my-8">
//                   <View>
//                     <Text className="text-4xl font-extrabold text-white uppercase tracking-tighter leading-[0.9]">
//                       5 Day Weather{"\n"}Forecast
//                     </Text>
//                   </View>
//                 </View>

//                 <View className="pb-10">
//                   <ForecastList data={forecast} />
//                 </View>
//                 <View className="h-10" />
//               </Animated.ScrollView>
//             </View>
//           </Animated.ScrollView>
//         )}
//       </SafeAreaView>
// {/* Reusable slide-up interactive bottom sheet */ }
//   <InteractiveBottomSheet
//     isVisible={activeDetail !== null}
//     onClose={handleCloseDetail}
//   >
//     {renderDetailContent()}
//   </InteractiveBottomSheet>
//       </ImageBackground >
//   );
      
//   );
// }
