import { View, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useTheme } from '@/context/ThemeProvider';

type RouteNames = 'tournaments' | 'athletes' | 'matches';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {

  const { theme } = useTheme(); 

  return (
    <View style={[styles.container, {backgroundColor: theme.cardBackground}]}>
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
            style={[styles.tabButton, 
              isFocused && [styles.tabButtonFocused, {backgroundColor: theme.textPrimary}]
            ]}
          >
            <Ionicons
              name={getIcon(route.name as RouteNames)}
              size={24}
              color={isFocused ? '#fff' : theme.textPrimary}
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
  tabButtonFocused: {
    borderRadius: 20,
    marginHorizontal: 15
  }
});

export default CustomTabBar;
