import React, {
  useEffect,
  useMemo,
  useContext,
  useReducer,
  createContext,
} from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Axios from 'axios';
import { RemoveNotificationToken } from '../config/axios.config';

import LoadingScreen from '../screens/Loading';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import ForgotPasswordScreen from '../screens/ForgotPassword';

// Member Screens
import MemberHomeScreen from '../screens/Member/Home/HomeScreen';

import {
  Text,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  TopNavigationAction,
} from '@ui-kitten/components';

import DriverHomeScreen from '../screens/Driver/Home/HomeScreen';
import WorkerHomeScreen from '../screens/Worker/Home/HomeScreen';
import NewPassword from '../screens/ForgotPassword/NewPassword/NewPassword';
import Verification from '../screens/ForgotPassword/Verification/Verification';
import styles from './styles';
import WorkerProfileScreen from '../screens/Worker/Profile/ProfileScreen';
import EditWorkerProfile from '../screens/Worker/Profile/EditProfile';
import WorkerServices from '../screens/Worker/Services/Services';
import AddWorkerService from '../screens/Worker/Services/AddService';
import WorkerSingleService from '../screens/Worker/Services/SingleService';
import UpdateWorkerService from '../screens/Worker/Services/UpdateService';
import MemberProfileScreen from '../screens/Member/Profile/ProfileScreen';
import EditMemberProfile from '../screens/Member/Profile/EditProfile';
import MemberServices from '../screens/Member/Services/Services';
import AddMemberService from '../screens/Member/Services/AddService';
import MemberSingleService from '../screens/Member/Services/SingleService';
import UpdateMemberService from '../screens/Member/Services/UpdateService';
import AvailableServicesByCategory from '../screens/Member/Services/AvailableServicesByCategory';
import MyOrders from '../screens/Member/Services/MyOrders';
import OrderDetails from '../screens/Member/Services/OrderDetails';
import MyOrdersHistory from '../screens/Member/Services/OrdersHistory';
import MyHiringHistory from '../screens/Member/Services/HiringHistory';
import WorkerOrders from '../screens/Worker/Services/MyOrders';
import WorkerOrdersHistory from '../screens/Worker/Services/OrdersHistory';
import WorkerOrderDetails from '../screens/Worker/Services/OrderDetails';
import GuardsScreen from '../screens/Member/Guard/Guards';
import DriverProfileScreen from '../screens/Driver/Profile/ProfileScreen';
import EditDriverProfile from '../screens/Driver/Profile/EditProfile';
import MemberDriversList from '../screens/Member/Driver/DriversList';
import MemberTrackDriver from '../screens/Member/Driver/TrackDriver';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const Tab = createBottomTabNavigator();

const AuthNavigator = createStackNavigator();

const ForgotPasswordNavigator = createStackNavigator();

const headerStyling = {
  headerTitleStyle: styles.title,
  headerTitleAlign: 'center',
  headerRightContainerStyle: {
    padding: 10,
    paddingTop: 20,
  },
};

const ForgotPasswordStack = () => {
  return (
    <ForgotPasswordNavigator.Navigator
      screenOptions={{
        ...headerStyling,
      }}
    >
      <ForgotPasswordNavigator.Screen
        name='Recover'
        component={ForgotPasswordScreen}
        options={{
          title: 'Recover Account',
        }}
      />
      <ForgotPasswordNavigator.Screen
        name='Verify'
        component={Verification}
        options={{
          title: "Verify It's You",
          headerLeft: null,
        }}
      />
      <ForgotPasswordNavigator.Screen
        name='NewPassword'
        component={NewPassword}
        options={{
          title: 'Update Password',
          headerLeft: null,
        }}
      />
    </ForgotPasswordNavigator.Navigator>
  );
};

const MemberBottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab
      title='Home'
      icon={(props) => <Icon {...props} name='home-outline' />}
    />
    <BottomNavigationTab
      title='Services'
      icon={(props) => <Icon {...props} name='briefcase-outline' />}
    />
    <BottomNavigationTab
      title='Guards'
      icon={(props) => <Icon {...props} name='lock-outline' />}
    />
    <BottomNavigationTab
      title='Track Driver'
      icon={(props) => <Icon {...props} name='car-outline' />}
    />
    <BottomNavigationTab
      title='Profile'
      icon={(props) => <Icon {...props} name='person-outline' />}
    />
  </BottomNavigation>
);

const MemberHomeStack = createStackNavigator();
const MemberProfileStack = createStackNavigator();
const MemberServicesStack = createStackNavigator();
const MemberGuardStack = createStackNavigator();
const MemberDriverStack = createStackNavigator();

const MemberNavigation = () => {
  return (
    <Tab.Navigator tabBar={(props) => <MemberBottomTabBar {...props} />}>
      <Tab.Screen
        name='member'
        component={() => (
          <MemberHomeStack.Navigator screenOptions={{ headerShown: false }}>
            <MemberHomeStack.Screen name='Home' component={MemberHomeScreen} />
            <MemberHomeStack.Screen
              name='OrderDetails'
              component={OrderDetails}
            />
          </MemberHomeStack.Navigator>
        )}
      ></Tab.Screen>
      <Tab.Screen
        name='services'
        component={() => (
          <MemberServicesStack.Navigator screenOptions={{ headerShown: false }}>
            <MemberServicesStack.Screen
              name='Services'
              component={MemberServices}
            />
            <MemberServicesStack.Screen
              name='AddService'
              component={AddMemberService}
            />
            <MemberServicesStack.Screen
              name='Category'
              component={AvailableServicesByCategory}
            />
            <MemberServicesStack.Screen
              name='Service'
              component={MemberSingleService}
            />
            <MemberServicesStack.Screen
              name='UpdateService'
              component={UpdateMemberService}
            />
            <MemberServicesStack.Screen name='MyOrders' component={MyOrders} />
            <MemberServicesStack.Screen
              name='MyOrdersHistory'
              component={MyOrdersHistory}
            />
            <MemberServicesStack.Screen
              name='MyHiringHistory'
              component={MyHiringHistory}
            />
            <MemberServicesStack.Screen
              name='OrderDetails'
              component={OrderDetails}
            />
          </MemberServicesStack.Navigator>
        )}
      ></Tab.Screen>
      <Tab.Screen
        name='guards'
        component={() => (
          <MemberGuardStack.Navigator screenOptions={{ headerShown: false }}>
            <MemberGuardStack.Screen name='Guards' component={GuardsScreen} />
          </MemberGuardStack.Navigator>
        )}
      ></Tab.Screen>
      <Tab.Screen
        name='track-driver'
        component={() => (
          <MemberDriverStack.Navigator screenOptions={{ headerShown: false }}>
            <MemberDriverStack.Screen
              name='AllDrivers'
              component={MemberDriversList}
            />
            <MemberDriverStack.Screen
              name='TrackDriver'
              component={MemberTrackDriver}
            />
          </MemberDriverStack.Navigator>
        )}
      ></Tab.Screen>
      <Tab.Screen
        name='profile'
        component={() => (
          <MemberProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <MemberProfileStack.Screen
              name='Profile'
              component={MemberProfileScreen}
            />
            <MemberProfileStack.Screen
              name='EditProfile'
              component={EditMemberProfile}
            />
          </MemberProfileStack.Navigator>
        )}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const DriverBottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab
      title='Home'
      icon={(props) => <Icon {...props} name='car-outline' />}
    />
    <BottomNavigationTab
      title='Profile'
      icon={(props) => <Icon {...props} name='person-outline' />}
    />
  </BottomNavigation>
);

const DriverProfileStack = createStackNavigator();

const DriverNavigation = () => {
  return (
    <Tab.Navigator tabBar={(props) => <DriverBottomTabBar {...props} />}>
      <Tab.Screen name='track-driver' component={DriverHomeScreen}></Tab.Screen>
      <Tab.Screen
        name='profile'
        component={() => (
          <DriverProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <DriverProfileStack.Screen
              name='Profile'
              component={DriverProfileScreen}
            />
            <DriverProfileStack.Screen
              name='EditProfile'
              component={EditDriverProfile}
            />
          </DriverProfileStack.Navigator>
        )}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const WorkerBottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab
      title='Home'
      icon={(props) => <Icon {...props} name='home-outline' />}
    />
    <BottomNavigationTab
      title='Services'
      icon={(props) => <Icon {...props} name='briefcase-outline' />}
    />
    <BottomNavigationTab
      title='Profile'
      icon={(props) => <Icon {...props} name='person-outline' />}
    />
  </BottomNavigation>
);

const WorkerProfileStack = createStackNavigator();
const WorkerServicesStack = createStackNavigator();
const WorkerHomeStack = createStackNavigator();

const WorkerNavigation = () => {
  return (
    <Tab.Navigator tabBar={(props) => <WorkerBottomTabBar {...props} />}>
      <Tab.Screen
        name='home'
        component={() => (
          <WorkerHomeStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkerServicesStack.Screen
              name='Home'
              component={WorkerHomeScreen}
            />
            <WorkerServicesStack.Screen
              name='OrderDetails'
              component={WorkerOrderDetails}
            />
          </WorkerHomeStack.Navigator>
        )}
      ></Tab.Screen>
      <Tab.Screen
        name='services'
        component={() => (
          <WorkerServicesStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkerServicesStack.Screen
              name='Services'
              component={WorkerServices}
            />
            <WorkerServicesStack.Screen
              name='AddService'
              component={AddWorkerService}
            />
            <WorkerServicesStack.Screen
              name='Service'
              component={WorkerSingleService}
            />
            <WorkerServicesStack.Screen
              name='UpdateService'
              component={UpdateWorkerService}
            />
            <WorkerServicesStack.Screen
              name='MyOrders'
              component={WorkerOrders}
            />
            <WorkerServicesStack.Screen
              name='MyOrdersHistory'
              component={WorkerOrdersHistory}
            />
            <MemberServicesStack.Screen
              name='OrderDetails'
              component={WorkerOrderDetails}
            />
          </WorkerServicesStack.Navigator>
        )}
      ></Tab.Screen>
      <Tab.Screen
        name='profile'
        component={() => (
          <WorkerProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkerProfileStack.Screen
              name='Profile'
              component={WorkerProfileScreen}
            />
            <WorkerProfileStack.Screen
              name='EditProfile'
              component={EditWorkerProfile}
            />
          </WorkerProfileStack.Navigator>
        )}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export const AuthContext = createContext();

export const Navigator = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            isSignout: false,
            token: action.token,
            user: action.user,
            role: action.role,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            isLoading: false,
            isSignout: false,
            token: action.token,
            user: action.user,
            role: action.role,
          };
        case 'UPDATE_USER':
          return {
            isLoading: false,
            isSignout: false,
            token: prevState.token,
            user: action.user,
            role: prevState.role,
          };
        case 'SIGN_OUT':
          return {
            isLoading: false,
            isSignout: true,
            token: null,
            user: null,
            role: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      token: null,
      user: null,
      role: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token, user, role;

      try {
        const authString = await AsyncStorage.getItem('auth');

        const auth = authString ? JSON.parse(authString) : null;

        if (auth) {
          token = auth.token;
          user = auth.user;
          role = auth.role;
        } else {
          token = null;
          user = null;
          role = null;
        }
      } catch (e) {
        token = null;
        user = null;
        role = null;
      }

      dispatch({ type: 'RESTORE_TOKEN', token, user, role });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        const { role, token, user } = data.auth;

        await AsyncStorage.setItem('auth', JSON.stringify(data.auth));

        dispatch({ type: 'SIGN_IN', token, user, role });
      },
      signOut: async (role) => {
        if (role === 'member') {
          const authString = await AsyncStorage.getItem('auth');
          //   console.log('NG User:', user);
          const auth = authString ? JSON.parse(authString) : null;
          if (auth) {
            const user = auth.user;
            let token = null;

            const { status } = await Permissions.getAsync(
              Permissions.NOTIFICATIONS
            );
            if (status === 'granted') {
              token = await Notifications.getExpoPushTokenAsync();
              await RemoveNotificationToken(user._id, token);
            }
          }
        }

        await AsyncStorage.removeItem('auth');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        dispatch({ type: 'SIGN_UP', token: 'dummy-auth-token' });
      },
      updateUser: async (user) => {
        await AsyncStorage.mergeItem('auth', JSON.stringify({ user }));

        dispatch({ type: 'UPDATE_USER', user });
      },
    }),
    []
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{ ...authContext, user: state.user, token: state.token }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          {state.token == null ? (
            <>
              <AuthNavigator.Navigator
                screenOptions={{
                  ...headerStyling,
                }}
              >
                <AuthNavigator.Screen name='Login' component={LoginScreen} />
                <AuthNavigator.Screen
                  name='Register'
                  component={RegisterScreen}
                />
                <AuthNavigator.Screen
                  name='ForgotPassword'
                  component={ForgotPasswordStack}
                  options={{
                    headerShown: false,
                  }}
                />
              </AuthNavigator.Navigator>
            </>
          ) : (
            <>
              {state.role === 'member' && <MemberNavigation />}
              {state.role === 'driver' && <DriverNavigation />}
              {state.role === 'worker' && <WorkerNavigation />}
            </>
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
};

export default Navigator;
