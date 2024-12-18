import { View, Text } from 'react-native'
import React from 'react'
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';

interface Props {
  color: string;
  focused: boolean;
  name: typeof Ionicons.defaultProps;
}

const TabIcon = ({ name, color, focused }: Props) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  // Determina il colore in base allo stato `focused`
  const iconColor = focused ? theme.accent : theme.textPrimary;

  // Quando lo stato cambia, l'animazione viene attivata
  if (focused) {
      scale.value = withSpring(1.2); // Scala l'icona a 1.2 quando è selezionata
  } else {
      scale.value = withSpring(1); // Torna alla dimensione normale quando non è selezionata
  }

  const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
  }));

  return (
      <Animated.View style={animatedStyle}>
          <Ionicons name={name} size={24} color={iconColor} />
      </Animated.View>
  );
};

export default TabIcon; 