import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text
} from 'react-native';

import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';

import SearchScreen from './screens/SearchScreen';
import DetailsScreen from './screens/DetailsScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import Drawer from './screens/Drawer';

import Analytics from 'mobile-center-analytics';

//import MK from 'maya-kai';
//MK.start('192.168.0.104.xip.io:8082');

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

const TopNavigator = DrawerNavigator({
  Home: {
    screen: StackNavigator({
      Order: {
        screen: TabNavigator({
          Food: { screen: SearchScreen },
          Wine: { screen: SearchScreen }
        }, { tabBarOptions: { showLabel: false } })
      },
      Details: { screen: DetailsScreen },
      Purchase: { screen: PurchaseScreen }
    })
  }
}, { contentComponent: Drawer });

export default () => <TopNavigator
  onNavigationStateChange={(prevState, currentState) => {
    const currentScreen = getCurrentRouteName(currentState);
    const prevScreen = getCurrentRouteName(prevState);

    if (prevScreen !== currentScreen) {
      // the line below uses the Google Analytics tracker
      // change the tracker here to use other Mobile analytics SDK.
      try {
        Analytics.trackEvent('navigation', {
          prevScreen, currentScreen
        });
      } catch (e) {

      }
    }
  }}
/>
