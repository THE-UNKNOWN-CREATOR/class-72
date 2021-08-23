import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import TransactionScreen from './screens/TransactionScreen'
import SearchScreen from './screens/SearchScreen'

export default class App extends React.Component {

  render()
  {
    return (
      <AppContainer />
    );
  }
}

const TabNavigator = createBottomTabNavigator(
    {
      Transaction: {screen:TransactionScreen},
      Search: {screen:SearchScreen}
    },
    {
    defaultNavigationOptions:({navigation})=>({tabBarIcon:({}) => {
        const routeName = navigation.state.routeName;

        if(routeName === "Transaction")
        {
          return (<Image source = {require("./assets/transaction.png")} style={{width:30, height:30}} />)
        }
        else if(routeName === "Search")
        {
          return (<Image source = {require("./assets/search.png")} style = {{width:30, height:30}}/>)
        }
      }})
    }
);

const AppContainer = createAppContainer(TabNavigator);