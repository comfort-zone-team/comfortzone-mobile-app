import React, { useState, useEffect } from 'react';
import {
  TopNavigation,
  Divider,
  Layout,
  Icon,
  TopNavigationAction,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Alert } from 'react-native';
import { useAxios } from '../../../config/axios.config';
import MapView, { Marker, Polyline } from 'react-native-maps';

const BackIcon = (props) => <Icon {...props} name='arrow-back-outline' />;

export default function MemberTrackDriver({ navigation, route }) {
  const { driver: selectedDriver } = route.params;
  const [driver] = useState(selectedDriver);

  if (!driver.ride) {
    navigation.navigate('AllDrivers');
  }

  const [marginTop, setMarginTop] = useState(1);

  const [startPosition, setStartPosition] = useState({
    longitude: driver.ride.startPosition.coords.longitude,
    latitude: driver.ride.startPosition.coords.latitude,
  });

  const [endPosition, setEndPosition] = useState({
    longitude: driver.ride.route[driver.ride.route.length - 1].coords.longitude,
    latitude: driver.ride.route[driver.ride.route.length - 1].coords.latitude,
  });

  const initCoords = driver.ride.route.map((route) => {
    return {
      latitude: route.coords.latitude,
      longitude: route.coords.longitude,
    };
  });

  const [coordinates, setCoordinates] = useState(initCoords);

  useEffect(() => {
    const timer = setInterval(() => {
      updateTrack();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const [{ data, error }, updateTrack] = useAxios(
    {
      url: '/member/driver/track',
      method: 'GET',
      params: {
        rideID: driver.ride._id,
      },
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      console.log('Updated Ride: ', data.ride);
      const { ride } = data;
      if (!ride.isActive) {
        Alert.alert('Driver has ended the ride.');

        navigation.navigate('AllDrivers');
      } else {
        const startPosition = {
          longitude: ride.startPosition.coords.longitude,
          latitude: ride.startPosition.coords.latitude,
        };

        const endPosition = {
          longitude: ride.route[driver.ride.route.length - 1].coords.longitude,
          latitude: ride.route[driver.ride.route.length - 1].coords.latitude,
        };

        const coords = ride.route.map((route) => {
          return {
            latitude: route.coords.latitude,
            longitude: route.coords.longitude,
          };
        });

        setStartPosition(startPosition);
        setEndPosition(endPosition);
        setCoordinates(coords);
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Internal Server Error!');
      navigation.navigate('AllDrivers');
    }
  }, [error]);

  return (
    <SafeAreaView>
      <TopNavigation
        title={`Track Driver - ${driver.name}`}
        alignment='center'
        accessoryLeft={() => (
          <TopNavigationAction
            icon={BackIcon}
            onPress={() => navigation.navigate('AllDrivers')}
          />
        )}
      />
      <Divider />
      <Layout style={styles.container}>
        <MapView
          style={{ ...styles.mapStyle, marginTop }}
          initialRegion={{
            latitude: startPosition.latitude,
            longitude: startPosition.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onMapReady={() => setMarginTop(0)}
          showsUserLocation
          showsMyLocationButton
          showsPointsOfInterest
          showsCompass
        >
          <Marker coordinate={startPosition} title='Start Position' />
          <Marker coordinate={endPosition} title='Current Position' />
          <Polyline
            coordinates={coordinates}
            strokeColor='skyblue'
            strokeColors={[
              '#7F0000',
              '#00000000',
              '#B24112',
              '#E5845C',
              '#238C23',
              '#7F0000',
            ]}
            strokeWidth={6}
          />
        </MapView>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f8fa',
  },
  mapStyle: {
    width: '100%',
    height: '95%',
  },
});
