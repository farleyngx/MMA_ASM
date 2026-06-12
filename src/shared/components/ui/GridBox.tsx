import React from "react";
import { View, ViewProps } from "react-native";

interface GridBoxProps extends ViewProps {
  children: React.ReactNode;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderTop?: boolean;
  className?: string;
}

export const GridBox: React.FC<GridBoxProps> = ({
  children,
  borderRight = false,
  borderBottom = false,
  borderLeft = false,
  borderTop = false,
  className = "",
  ...props
}) => {
  const borderClasses = [
    borderTop ? "border-t border-white/20" : "",
    borderBottom ? "border-b border-white/20" : "",
    borderLeft ? "border-l border-white/20" : "",
    borderRight ? "border-r border-white/20" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View className={`p-4 ${borderClasses} ${className}`} {...props}>
      {children}
    </View>
  );
};
