import React, { useState, useEffect, useContext } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TopNavigation,
  Divider,
  Layout,
  Icon,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
  Spinner,
  Text,
  Select,
  SelectItem,
  IndexPath,
  List,
  Button,
  ListItem,
  ButtonGroup,
  Modal,
  Card,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Alert,
  View,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { useAxios } from '../../../config/axios.config';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import { Linking } from 'expo';
import { AuthContext } from '../../../navigator/Navigator';
import ActivityIndicatorOverlay from '../../../components/ActivityIndicator/ActivityIndicatorOverlay';

const LogoutIcon = (props) => <Icon {...props} name='log-out' />;

const MenuIcon = (props) => <Icon {...props} name='more-vertical' />;

const EmptyView = () => (
  <View style={styles.emptyView}>
    <Image
      source={require('./empty.png')}
      style={{ width: '80%', resizeMode: 'contain' }}
    />
    <Text style={styles.emptyViewText}>No guards found.</Text>
  </View>
);

const Sectors = ['1', '2', '3', '4'];
const Blocks = ['A', 'B', 'C'];

export default function GuardsScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [guards, setGuards] = useState([]);
  const [selectedSector, setSelectedSector] = useState(new IndexPath(0));
  const [selectedBlock, setSelectedBlock] = useState(new IndexPath(0));
  const [visible, setVisible] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState({});
  const [selectedAlert, setSelectedAlert] = useState({});

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: '/guard/all',
      method: 'GET',
      params: {
        sector: Sectors[selectedSector.row],
        block: Blocks[selectedBlock.row],
        memberID: user._id,
      },
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
    if (data) {
      console.log(data);
      setGuards(data.guards);
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

  const onCall = (mobileNumber) => {
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const onGenerateAlert = (guard, canAlert, alert) => {
    setSelectedAlert({ alert, canAlert });
    setSelectedGuard(guard);
    setSelectedGuard(guard);
    setVisible(true);
  };

  const [
    { loading: sendingAlert, data: alertData, error: alertError },
    sendAlert,
  ] = useAxios(
    {
      url: '/guard/alert',
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (alertData) {
      Alert.alert('Success', 'Your information has been sent to the guard!');
      refetch();
    }
  }, [alertData]);

  useEffect(() => {
    if (alertError) {
      const message = alertError.isAxiosError
        ? alertError.response.data.message
        : alertError.message;
      Alert.alert('Error', message);
    }
  }, [alertError]);

  const onSendAlert = () => {
    const {
      name: guardName,
      mobile: guardMobile,
      _id: guardID,
    } = selectedGuard;
    sendAlert({
      data: {
        guardName,
        guardMobile,
        memberID: user._id,
        guardID,
      },
    });
    setVisible(false);
  };

  const [
    { loading: resolvingAlert, data: resolveData, error: resolveError },
    resolveAlert,
  ] = useAxios(
    {
      url: '/guard/alert/resolve',
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  useEffect(() => {
    if (resolveData) {
      Alert.alert('Success', 'Alert has been marked as resolved successfully!');
      refetch();
    }
  }, [resolveData]);

  useEffect(() => {
    if (resolveError) {
      const message = resolveError.isAxiosError
        ? resolveError.response.data.message
        : resolveError.message;
      Alert.alert('Error', message);
    }
  }, [resolveError]);

  const onMarkAsResolved = () => {
    const { _id } = selectedAlert.alert;
    setVisible(false);
    resolveAlert({
      data: {
        _id,
      },
    });
  };

  const renderItemAccessory = (guard) => (
    <React.Fragment>
      <Button
        size='tiny'
        style={{ marginHorizontal: 5 }}
        onPress={() => onCall(guard.mobile)}
      >
        Call
      </Button>
      <Button
        size='tiny'
        status={guard.canGenerateAlert ? 'danger' : 'info'}
        onPress={() =>
          onGenerateAlert(guard, guard.canGenerateAlert, guard.alert)
        }
      >
        {guard.canGenerateAlert ? 'Generate Alert' : 'View Alert Status'}
      </Button>
    </React.Fragment>
  );

  const renderItemIcon = (props) => <Icon {...props} name='lock' />;

  const renderItem = ({ item: guard, index }) => (
    <ListItem
      title={() => <Text category='h6'>{guard.name}</Text>}
      description={() => (
        <Text category='p1' appearance='hint'>
          {guard.mobile}
        </Text>
      )}
      accessoryLeft={renderItemIcon}
      accessoryRight={() => renderItemAccessory(guard)}
    />
  );
  return (
    <SafeAreaView>
      <TopNavigation title='Guards' alignment='center' />
      <Divider />
      <Layout style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Select
            selectedIndex={selectedSector}
            onSelect={(index) => setSelectedSector(index)}
            style={{ width: '49%' }}
            value={'Sector ' + Sectors[selectedSector.row]}
          >
            {Sectors.map((sector) => (
              <SelectItem title={sector} key={sector} />
            ))}
          </Select>
          <Select
            selectedIndex={selectedBlock}
            style={{ width: '49%' }}
            onSelect={(index) => setSelectedBlock(index)}
            value={'Block ' + Blocks[selectedBlock.row]}
          >
            {Blocks.map((block) => (
              <SelectItem title={block} key={block} />
            ))}
          </Select>
        </View>
        <WhiteSpace />
        {loading && (
          <View
            style={[
              styles.container,
              {
                alignItems: 'center',
              },
            ]}
          >
            <Spinner size='large' />
          </View>
        )}
        {!loading && guards.length === 0 && <EmptyView />}
        {!loading && guards.length > 0 && (
          <React.Fragment>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => refetch()}
                />
              }
            >
              <List data={guards} renderItem={renderItem} />
            </ScrollView>
          </React.Fragment>
        )}
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true}>
            {selectedAlert.canAlert ? (
              <React.Fragment>
                <Text style={{ textAlign: 'center' }}>
                  By confirming, your house location and contact information
                  will be sent to the guard via sms.
                </Text>
                <WhiteSpace size={2} />
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    onPress={() => setVisible(false)}
                    status='basic'
                    style={{ width: '50%' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={onSendAlert}
                    status='info'
                    style={{ width: '50%' }}
                  >
                    Confirm
                  </Button>
                </View>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Text style={{ textAlign: 'center' }}>
                  Alert Status:{' '}
                  <Text status='danger'>
                    {selectedAlert.alert ? selectedAlert.alert.status : null}
                  </Text>
                </Text>
                <WhiteSpace />
                <Text style={{ textAlign: 'center' }} appearance='hint'>
                  If your issue is resolved, you can mark this alert as resolved
                  in order to generate future alerts for the guard.
                </Text>
                <WhiteSpace size={2} />
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    onPress={() => setVisible(false)}
                    status='basic'
                    style={{ width: '50%' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={onMarkAsResolved}
                    status='success'
                    style={{ width: '50%' }}
                  >
                    Mark as Resolved
                  </Button>
                </View>
              </React.Fragment>
            )}
          </Card>
        </Modal>
        <ActivityIndicatorOverlay
          text='Sending alert to guard...'
          visible={sendingAlert}
        />
        <ActivityIndicatorOverlay
          text='Resolving Alert...'
          visible={resolvingAlert}
        />
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
