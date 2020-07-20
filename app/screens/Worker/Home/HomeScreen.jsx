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
  Card,
  Spinner,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../navigator/Navigator';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UPLOADS_API_URL, useAxios } from '../../../config/axios.config';
import Carousel from 'react-native-anchor-carousel';

const { width } = Dimensions.get('screen');

const PersonIcon = (props) => <Icon {...props} name='person-outline' />;

const LogoutIcon = (props) => <Icon {...props} name='log-out' />;

const MenuIcon = (props) => <Icon {...props} name='more-vertical' />;

const EmptyView = () => (
  <View style={styles.emptyView}>
    <Image
      source={require('./empty.png')}
      style={{ width: '80%', resizeMode: 'contain' }}
    />
    <Text style={styles.emptyViewText} category='p1'>
      You don't have any active orders.
    </Text>
  </View>
);

const Services = ({ services, onOrderSelected }) => {
  return (
    <View style={styles.services}>
      {services.map(({ service, member }, index) => (
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
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default function WorkerHomeScreen({ navigation }) {
  const { signOut, user } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);

  const [services, setServices] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: '/worker/orders/home',
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

  const onLogout = () => {
    signOut('worker');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onOrderSelected = (order) =>
    navigation.navigate('OrderDetails', {
      order,
    });

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
        subtitle={(evaProps) => <Text {...evaProps}>Workers Panel</Text>}
        alignment='center'
        accessoryLeft={() => <TopNavigationAction icon={PersonIcon} disabled />}
        accessoryRight={renderOverflowMenuAction}
      />
      <Divider />
      <Layout style={styles.container}>
        <View style={styles.block}>
          <View style={styles.blockHeader}>
            <Text category='h6'>Active Orders</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
              }}
              onPress={() =>
                navigation.navigate('services', { screen: 'MyOrders' })
              }
            >
              <Text style={{ color: '#8F9BB3', marginTop: 2 }} category='p1'>
                View All
              </Text>
              <Icon style={styles.icon} fill='#8F9BB3' name='arrow-right' />
            </TouchableOpacity>
          </View>
          <WhiteSpace />
          <Divider />
          <View style={styles.blockBody}>
            {loading && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 100,
                }}
              >
                <Spinner />
              </View>
            )}
            {!loading && services && services.length === 0 && <EmptyView />}
            {!loading && error && <EmptyView />}
            {!loading && services && services.length > 0 && (
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
                  onOrderSelected={onOrderSelected}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: '100%',
  },
  block: {},
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnGhost: {
    padding: 0,
    margin: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  blockBody: {},
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyViewText: {
    textAlign: 'center',
    padding: 10,
    color: 'grey',
  },
  services: {
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
