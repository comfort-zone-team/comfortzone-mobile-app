import React, { useState, useContext, useEffect } from 'react';
import {
  TopNavigation,
  Divider,
  Layout,
  Button,
  Icon,
  Text,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../navigator/Navigator';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { useAxios, updateRideRoute } from '../../../config/axios.config';
import ActivityIndicatorOverlay from '../../../components/ActivityIndicator/ActivityIndicatorOverlay';

const CarIcon = (props) => <Icon {...props} name='car-outline' />;

const LogoutIcon = (props) => <Icon {...props} name='log-out' />;

const MenuIcon = (props) => <Icon {...props} name='more-vertical' />;

const RIDE_TRACK_NAME = 'track_ride';

export default function DriverHomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const { signOut } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const [location, setLocation] = useState(null);
  const [marginTop, setMarginTop] = useState(1);

  useEffect(() => {
    (async () => {
      let isGranted = false;

      while (!isGranted) {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Info',
            'Permission to access location was denied. You must enable location in order to process.'
          );
        } else {
          isGranted = true;
        }
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      console.log('Location Updated: ', location);
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: '/driver/ride/status',
      method: 'GET',
      params: {
        driverID: user._id,
      },
    },
    {
      useCache: false,
    }
  );

  const changeTrackingStatus = async (hasActiveRide) => {
    if (hasActiveRide) {
      if (!(await Location.hasStartedLocationUpdatesAsync(RIDE_TRACK_NAME))) {
        await Location.startLocationUpdatesAsync(RIDE_TRACK_NAME, {
          accuracy: Location.Accuracy.High,
          activityType: Location.ActivityType.AutomotiveNavigation,
          foregroundService: {
            notificationTitle: 'Comfort Zone',
            notificationBody: 'Tracking your ride...',
            notificationColor: '#ffffff',
          },
        });
      }
    } else {
      if (await Location.hasStartedLocationUpdatesAsync(RIDE_TRACK_NAME)) {
        await Location.stopLocationUpdatesAsync(RIDE_TRACK_NAME);
      }
    }
  };

  useEffect(() => {
    if (data) {
      console.log('data', data);
      const { hasActiveRide } = data;
      changeTrackingStatus(hasActiveRide);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const message = error.isAxiosError
        ? error.response.data.message
        : error.message;
      Alert.alert('Error', message);
    }
  }, [error]);

  const [
    { loading: startingRide, data: startRideData, error: startRideError },
    startRide,
  ] = useAxios(
    {
      url: '/driver/ride/start',
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (startRideData) {
      console.log('Data: ', startRideData);
      changeTrackingStatus(true);
      refetch();
    }
  }, [startRideData]);

  useEffect(() => {
    if (startRideError) {
      const message = startRideError.isAxiosError
        ? startRideError.response.data.message
        : startRideError.message;
      Alert.alert('Error', message);
    }
  }, [startRideError]);

  const onStartRide = () => {
    startRide({
      data: {
        startPosition: location,
        driverID: user._id,
      },
    });
  };

  const [
    { loading: stoppingRide, data: stopRideData, error: stopRideError },
    stopRide,
  ] = useAxios(
    {
      url: '/driver/ride/stop',
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (stopRideData) {
      console.log('Data: ', stopRideData);
      changeTrackingStatus(false);
      refetch();
    }
  }, [stopRideData]);

  useEffect(() => {
    if (stopRideError) {
      const message = stopRideError.isAxiosError
        ? stopRideError.response.data.message
        : stopRideError.message;
      Alert.alert('Error', message);
    }
  }, [stopRideError]);

  const onStopRide = () => {
    stopRide({
      data: {
        driverID: user._id,
      },
    });
  };

  const onLogout = () => {
    signOut('driver');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={LogoutIcon}
          title='Logout'
          onPress={onLogout}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  return (
    <SafeAreaView>
      <TopNavigation
        title='Comfort Zone'
        subtitle={(evaProps) => <Text {...evaProps}>Drivers Panel</Text>}
        alignment='center'
        accessoryLeft={() => <TopNavigationAction icon={CarIcon} disabled />}
        accessoryRight={renderOverflowMenuAction}
      />
      <Divider />
      {location && (
        <View>
          <MapView
            style={{ ...styles.mapStyle, marginTop }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onMapReady={() => setMarginTop(0)}
            showsUserLocation
            showsMyLocationButton
            showsPointsOfInterest
            showsCompass
          ></MapView>
          {!loading && data && !data.hasActiveRide && (
            <Button
              style={{
                position: 'absolute',
                bottom: 50,
                right: '37%',
              }}
              status='info'
              onPress={onStartRide}
            >
              Start Ride
            </Button>
          )}
          {!loading && data && data.hasActiveRide && (
            <Button
              style={{
                position: 'absolute',
                bottom: 50,
                right: '37%',
              }}
              onPress={onStopRide}
              status='danger'
            >
              Stop Ride
            </Button>
          )}
        </View>
      )}
      <ActivityIndicatorOverlay
        text='Starting Ride...'
        visible={startingRide}
      />
      <ActivityIndicatorOverlay
        text='Stopping Ride...'
        visible={stoppingRide}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
