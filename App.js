import Expo, { Notifications } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import SettingScreen from './screens/SettingScreen';
import ReviewScreen from './screens/ReviewScreen';
import registerForNotificationsAsync from './services/push_notifications';
import { Icon } from 'react-native-elements';

const ScreenNavigationOption = ({ navigation }) => ({
  tabBarIcon: ({ focused, tintColor }) => {
    const { routeName } = navigation.state;
    let iconName;
    if (routeName === 'review') {
      iconName = 'favorite';
    } else if (routeName === 'map') {
      iconName = 'my-location';
    } else if (routeName === 'deck') {
      iconName = 'list';
    }
    return <Icon name={iconName} size={30} color={tintColor} />;
  }
});

export default class App extends React.Component {
  async componentDidMount() {
    await registerForNotificationsAsync();
    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification;
      if (origin === 'received' && text) {
        Alert.alert('New push notification', text, [{ text: 'Ok.' }]);
      }
    });
  }
  render() {
    const MainNavigator = createBottomTabNavigator({
      welcome: { screen: WelcomeScreen },
      auth: { screen: AuthScreen },
      main: {
        screen: createBottomTabNavigator({
          map: { screen: MapScreen },
          deck: { screen: DeckScreen },
          review: {
            screen: createStackNavigator({
              review: { screen: ReviewScreen },
              settings: { screen: SettingScreen }
            }),
          }
        }, {
            tabBarPosition: 'bottom',
            tabBarOptions: {
              labelStyle: { fontSize: 12 }
            },
            navigationOptions: ScreenNavigationOption
          })
      }
    }, {
        navigationOptions: {
          tabBarVisible: false
        }
      });
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
