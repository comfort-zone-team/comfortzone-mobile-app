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

import { Rating } from 'react-native-ratings';

const EmptyView = ({ category, onGoBack }) => (
  <View style={styles.emptyView}>
    <Image
      source={require('./empty.png')}
      style={{ width: '80%', resizeMode: 'contain' }}
    />
    <Text style={styles.emptyViewText}>
      No services were found under {category.toUpperCase()} category.
    </Text>
    <Button appearance='outline' onPress={onGoBack}>
      Go Back
    </Button>
  </View>
);

const Services = ({ services, onServiceSelected }) => {
  return (
    <View style={styles.services}>
      {services.map((service) => (
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
              <Divider />
              <WhiteSpace />
              <Rating
                style={{ paddingVertical: 10 }}
                startingValue={service.rating}
                imageSize={20}
                readonly
              />
              <Text
                style={{ textAlign: 'center' }}
                appearance='hint'
                category='c1'
              >
                {service.rating > 0
                  ? `${service.rating}/5 rating based on ${service.totalHiring} orders.`
                  : 'No Ratings Yet!'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AvailableServicesByCategory({ navigation, route }) {
  const { category } = route.params;

  const { user } = useContext(AuthContext);

  const [services, setServices] = useState([]);

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: '/member/services',
      method: 'GET',
      params: {
        uid: user._id,
        available: true,
        category,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (data) {
      const { services } = data;
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
    <SafeAreaView>
      <TopNavigation
        title={category.toUpperCase()}
        subtitle='Services'
        accessoryLeft={(props) => (
          <TopNavigationAction
            {...props}
            icon={(props) => <Icon {...props} name='arrow-back-outline' />}
            onPress={() => navigation.navigate('Services')}
          />
        )}
      />
      <Divider />
      <Layout style={styles.container}>
        {loading && (
          <View style={{ alignItems: 'center' }}>
            <Spinner />
          </View>
        )}
        {!loading && services.length === 0 && (
          <EmptyView
            category={category}
            onGoBack={() => navigation.navigate('Services')}
          />
        )}
        {!loading && services.length > 0 && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refetch()}
              />
            }
          >
            <Services
              services={services}
              onServiceSelected={onServiceSelected}
            />
          </ScrollView>
        )}
      </Layout>
    </SafeAreaView>
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
