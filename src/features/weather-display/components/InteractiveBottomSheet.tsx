import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65; // Bottom sheet occupies 65% of screen height

interface InteractiveBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const InteractiveBottomSheet: React.FC<InteractiveBottomSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const [isRendered, setIsRendered] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 15 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 15 }, () => {
        runOnJS(setIsRendered)(false);
      });
    }
  }, [isVisible]);

  // Handle swipe down gesture to close
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = SCREEN_HEIGHT - SHEET_HEIGHT + event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 500) {
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 15 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, { damping: 15 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SCREEN_HEIGHT, SCREEN_HEIGHT - SHEET_HEIGHT],
      [0, 0.5]
    );
    return {
      opacity,
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  if (!isRendered) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} className="z-50" pointerEvents="box-none">
      {/* Backdrop overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={backdropStyle} 
          className="absolute inset-0 bg-black" 
        />
      </TouchableWithoutFeedback>

      {/* Interactive Sheet Container */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[{ height: SHEET_HEIGHT }, animatedStyle]}
          className="absolute bottom-0 left-0 right-0 bg-[#0C0B17] border-t border-white/20 p-6 rounded-t-[30px] shadow-2xl"
        >
          {/* Drag handle indicator */}
          <View className="w-12 h-1.5 bg-white/20 rounded-full mb-6 self-center" />
          
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
