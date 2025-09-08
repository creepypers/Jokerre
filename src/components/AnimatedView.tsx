import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  animationType?: 'fade' | 'slide' | 'both';
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  style,
  animationType = 'both',
  duration = 800,
  delay = 0,
  direction = 'up',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animations = [];

    if (animationType === 'fade' || animationType === 'both') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    if (animationType === 'slide' || animationType === 'both') {
      const slideValue = direction === 'up' ? 0 : direction === 'down' ? 0 : direction === 'left' ? 0 : 0;
      animations.push(
        Animated.timing(slideAnim, {
          toValue: slideValue,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [animationType, duration, delay, direction]);

  const animatedStyle = {
    opacity: animationType === 'slide' ? 1 : fadeAnim,
    transform: animationType === 'fade' ? [] : [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 50],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
