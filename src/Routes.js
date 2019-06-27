import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from "./screens/HomeScreen";
import BusDetailScreen from "./screens/BusDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Project = createStackNavigator({
    Home: {
        screen: HomeScreen
    },
    BusDetail: {
        screen: BusDetailScreen
    },
    Profile: {
        screen: ProfileScreen
    }
});
export default createAppContainer(Project);