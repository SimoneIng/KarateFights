import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withClamp,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeProvider';

type RouteNames = 'tournaments' | 'athletes' | 'matches';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

  const { theme } = useTheme(); 

  const [TAB_WIDTH, setTAB_WIDTH] = useState(0);
  const [TAB_HEIGHT, setTAB_HEIGHT] = useState(0);
  const [EL_WIDTH, setEL_WIDTH] = useState(0);
  const CIRCLE_SIZE = TAB_HEIGHT-20; // Dimensione del cerchio

  // valori per animazione 
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Assicurati che i valori siano validi
    if (TAB_WIDTH > 0 && state.index >= 0) {
      // Calcola la larghezza di ciascuna tab
      const newEL_WIDTH = TAB_WIDTH / state.routes.length;
      setEL_WIDTH(newEL_WIDTH);
  
      // Calcola la posizione iniziale solo una volta
      const initialPosition = state.index * newEL_WIDTH + (newEL_WIDTH / 2 - CIRCLE_SIZE / 2);
      translateX.value = initialPosition; // Assegna direttamente senza animazione
    }
  }, [TAB_WIDTH, state.index]); // Dipende solo dalla larghezza e dall'indice
    

  const setTabBarValues = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTAB_WIDTH(width);
    setTAB_HEIGHT(height);
  };

  const handleAnimation = (index: number) => {
    const targetPosition = index * EL_WIDTH + EL_WIDTH / 2 - CIRCLE_SIZE / 2; // Calcolo centratura
    translateX.value = withSpring(targetPosition);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value}],
  }));

  return (
    <View style={[styles.container]} onLayout={setTabBarValues}>
      {/* Elemento animato */}
      <Animated.View style={[
        styles.animatedCircle,
        {
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          alignSelf:  'center'
        },
        animatedStyle
      ]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }

          handleAnimation(index);
        };

        const getIcon = (routeName: RouteNames): string => {
          const iconMap: Record<RouteNames, string> = {
            tournaments: 'trophy-outline',
            athletes: 'id-card-outline',
            matches: 'clipboard-outline'
          };

          return iconMap[routeName] || 'help-outline';
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={getIcon(route.name as RouteNames)}
              size={24}
              color={isFocused ? theme.accent : '#ccc'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 30,
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: '#00072d',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  animatedCircle: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
});

export default CustomTabBar;
