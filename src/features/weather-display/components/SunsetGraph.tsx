import React from "react";
import { View } from "react-native";

interface SunsetGraphProps {
  dt: number;
  sunrise: number;
  sunset: number;
}

export const SunsetGraph: React.FC<SunsetGraphProps> = ({ dt, sunrise, sunset }) => {
  // Calculate sunset progress dynamically based on time of day
  let progress = 0.5;
  const midTime = (sunrise + sunset) / 2;

  if (dt >= sunrise && dt <= sunset) {
    if (dt <= midTime) {
      progress = 0.0; // Sun is high at midday
    } else {
      progress = ((dt - midTime) / (sunset - midTime)) * 0.5; // Moving from peak to horizon
    }
  } else if (dt > sunset) {
    const diff = dt - sunset;
    const transitionPeriod = 4 * 3600; // 4 hours to reach deep night position
    progress = 0.5 + Math.min(1, diff / transitionPeriod) * 0.5; // Moving from horizon to deep night
  } else {
    // dt < sunrise
    progress = 1.0; // Deep night before sunrise
  }

  // 1. Graph dimensions configurations
  const WIDTH = 160;       // Total width of the graph
  const HEIGHT = 60;       // Total height of the graph
  const AMPLITUDE = 25;    // Wave amplitude (steepness of orbit)
  const CENTER_Y = HEIGHT / 2;

  const PATH_SEGMENTS = 60; // Number of segments to draw smooth curve

  // 2. Clamp progress to 0 -> 1 and calculate sun position
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Angle of the sun (runs from PI/2 to 3*PI/2)
  const sunAngle = Math.PI / 2 + clampedProgress * Math.PI;
  const sunX = clampedProgress * WIDTH;
  const sunY = CENTER_Y - AMPLITUDE * Math.sin(sunAngle);

  return (
    <View className="items-center justify-center mt-4 mb-2">
      <View style={{ width: WIDTH, height: HEIGHT }} className="relative justify-center">
        
        {/* Horizon Line */}
        <View 
          className="absolute w-full h-[1px] bg-white/30" 
          style={{ top: CENTER_Y }} 
        />

        {/* Draw mathematical sun orbit using view segments */}
        {[...Array(PATH_SEGMENTS)].map((_, i) => {
          const p = i / (PATH_SEGMENTS - 1);
          const x = p * WIDTH;
          const angle = Math.PI / 2 + p * Math.PI;
          
          // Sine wave equation: y = Center - Amplitude * sin(angle)
          const y = CENTER_Y - AMPLITUDE * Math.sin(angle);
          
          // Fade effect: bright on the left (day), fading to the right (night)
          const opacity = 0.9 - (p * 0.7); // Fades from 0.9 down to 0.2

          // Compute tangent rotation to align segments smoothly
          // Derivative y' to find angle of rotation for each segment
          const derivative = -AMPLITUDE * Math.cos(angle) * (Math.PI / WIDTH);
          const rotation = Math.atan(derivative) * (180 / Math.PI);

          return (
            <View
              key={i}
              className="absolute bg-white"
              style={{
                left: x,
                top: y,
                width: 4.5, // Slightly longer than gap to overlap seamlessly
                height: 1.5,  // Thickness of orbit path
                opacity: opacity,
                transform: [
                  { translateX: -2.25 }, // Center X
                  { translateY: -0.75 }, // Center Y
                  { rotate: `${rotation}deg` } // Align rotation along slope
                ],
                borderRadius: 1,
              }}
            />
          );
        })}

        {/* Sun indicator dot */}
        <View
          className="absolute items-center justify-center"
          style={{
            left: sunX,
            top: sunY,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "#FFFFFF",
            transform: [{ translateX: -6 }, { translateY: -6 }],
            // Strong white glow effect
            shadowColor: "#FFFFFF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 8, 
          }}
        >
          {/* Halo ring around the sun */}
          <View className="w-6 h-6 rounded-full bg-white/30 absolute border border-white/20" />
        </View>

      </View>
    </View>
  );
};
