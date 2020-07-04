import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  Spinner,
  Divider,
  TopNavigation,
  Layout,
  TopNavigationAction,
  Icon,
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
    <Text style={styles.emptyViewText}>You have no active orders yet.</Text>
  </View>
);

const Services = ({ services, onOrderSelected }) => {
  return (
    <View style={styles.services}>
      {services.map(({ service, member, isCompleted }, index) => (
        <TouchableOpacity onPress={() => onOrderSelected(services[index])}>
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
              <Text category='p1'>Member Name: {member.name}</Text>
              <WhiteSpace />
              <Text category='p1'>Member Phone #: {member.mobile}</Text>
              <WhiteSpace />
              <Text category='c1'>
                Status: {isCompleted ? 'Completed' : 'Cancelled'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function MyOrdersHistory({ navigation }) {
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
      url: '/member/orders/history',
      method: 'GET',
      params: {
        uid: user._id,
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

  const onOrderSelected = (order) =>
    navigation.navigate('OrderDetails', { order });

  return (
    <SafeAreaView>
      <TopNavigation
        title='My Orders History'
        subtitle="History of orders you've got till date"
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
        {!loading && services.length === 0 && <EmptyView />}
        {!loading && services.length > 0 && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refetch()}
              />
            }
          >
            <Services services={services} onOrderSelected={onOrderSelected} />
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
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    overflow: 'hidden',
    borderWidth: 0.2,
    borderColor: 'grey',
  },
  serviceContent: {
    width: '60%',
  },
});
