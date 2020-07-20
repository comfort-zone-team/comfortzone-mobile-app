import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  Spinner,
  Divider,
  TopNavigation,
  Layout,
  TopNavigationAction,
  Icon,
  Button,
  Card,
} from '@ui-kitten/components';
import { useAxios, UPLOADS_API_URL } from '../../../config/axios.config';
import { Alert, View, Image, StyleSheet, RefreshControl } from 'react-native';
import { AuthContext } from '../../../navigator/Navigator';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import WhiteSpace from '../../../components/Space/WhiteSpace';

const EmptyView = () => (
  <View style={styles.emptyView}>
    <Image
      source={require('./empty.png')}
      style={{ width: '80%', resizeMode: 'contain' }}
    />
    <Text style={styles.emptyViewText}>
      You haven't hired any service. Please view available services and hire
      one.
    </Text>
  </View>
);

const Services = ({ services, onServiceSelected }) => {
  return (
    <View style={styles.services}>
      {services.map(({ service, isAccepted }) => (
        <TouchableOpacity onPress={() => onServiceSelected(service)}>
          <View key={service._id} style={styles.serviceView}>
            <View style={{ width: '40%', marginRight: 10 }}>
              <Image
                source={{
                  uri: `${UPLOADS_API_URL}${service.imagePath}`,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.serviceContent}>
              <Text category='h6' style={{ fontWeight: 'bold' }}>
                {service.title.toUpperCase()}
              </Text>
              <WhiteSpace />
              <Text category='p1'>Address: {service.address}</Text>
              <WhiteSpace />
              <Text category='p1'>Phone #: {service.mobile}</Text>
              <WhiteSpace />
              <Text category='p1'>
                Status: {isAccepted ? 'Active' : 'Awaiting Approval'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function HiredServices({ navigation }) {
  const { user } = useContext(AuthContext);

  const [services, setServices] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: '/member/services',
      method: 'GET',
      params: {
        uid: user._id,
        hired: true,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (data) {
      const { services } = data;

      console.log('Services: ', services);

      console.log('Got Services: ', services);

      setServices(services);
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

  const onServiceSelected = (service) =>
    navigation.navigate('Service', { service });

  return (
    <React.Fragment>
      {loading && (
        <View style={{ alignItems: 'center' }}>
          <Spinner />
        </View>
      )}
      {!loading && services.length === 0 && <EmptyView />}
      {!loading && services.length > 0 && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => refetch()} />
          }
        >
          <Services services={services} onServiceSelected={onServiceSelected} />
        </ScrollView>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  emptyViewText: {
    textAlign: 'center',
    padding: 10,
    color: 'grey',
  },
  services: {
    height: '100%',
    marginBottom: 100,
  },
  serviceView: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    elevation: 5,
    backgroundColor: 'white',
    padding: 20,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    overflow: 'hidden',
    borderWidth: 0.2,
    borderColor: 'grey',
  },
  serviceContent: {
    width: '60%',
  },
});
