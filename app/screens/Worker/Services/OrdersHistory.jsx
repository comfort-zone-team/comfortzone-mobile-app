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

export default function WorkerOrdersHistory({ navigation }) {
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
            onPress={() => navigation.goBack()}
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

const styles = StyleSheet.create({});
