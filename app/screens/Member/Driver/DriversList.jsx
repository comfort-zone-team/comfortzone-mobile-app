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
  Spinner,
  List,
  Card,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../navigator/Navigator';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import { useAxios } from '../../../config/axios.config';

const DriverIcon = (props) => <Icon {...props} name='car-outline' />;

export default function MemberDriversList({ navigation }) {
  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: '/member/drivers/all',
      method: 'GET',
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      const message = error.isAxiosError
        ? error.response.data.message
        : error.message;
      Alert.alert('Error', message);
    }
  }, [error]);

  const renderItem = ({ item: driver }) => {
    return (
      <Card style={styles.item} status='basic' disabled={!driver.ride}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text category='h6'>{driver.name}</Text>
          {driver.ride && <Text status='success'>Active</Text>}
          {!driver.ride && <Text appearance='hint'>Inactive</Text>}
        </View>
        <WhiteSpace />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text appearance='hint'>{driver.mobile}</Text>
          {driver.ride && (
            <Button
              size='tiny'
              onPress={() =>
                navigation.navigate('TrackDriver', {
                  driver,
                })
              }
            >
              Track Driver
            </Button>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView>
      <TopNavigation
        title='All Drivers'
        alignment='center'
        accessoryLeft={() => <TopNavigationAction icon={DriverIcon} disabled />}
      />
      <Divider />
      <Layout style={styles.container}>
        {loading && (
          <View style={styles.spinnerView}>
            <Spinner />
          </View>
        )}
        {!loading && data && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refetch()}
              />
            }
          >
            <List
              style={styles.list}
              contentContainerStyle={styles.contentContainer}
              data={data.drivers}
              renderItem={renderItem}
            />
          </ScrollView>
        )}
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
