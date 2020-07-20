import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, Dimensions, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { TextInput } from '../../components/TextInput/TextInput';
import {
  Layout,
  Card,
  Text,
  Button,
  IndexPath,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import WhiteSpace from '../../components/Space/WhiteSpace';
import {
  StringValidator,
  PhoneNumberValidator,
} from '../../components/validators/Validators';
import { useAxios } from '../../config/axios.config';
import ActivityIndicatorOverlay from '../../components/ActivityIndicator/ActivityIndicatorOverlay';

const { height, width } = Dimensions.get('screen');

const accountTypes = [
  {
    title: 'Member',
    value: 'member',
  },
  {
    title: 'Driver',
    value: 'driver',
  },
  {
    title: 'Worker',
    value: 'worker',
  },
];

const ForgotPasswordScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedAccountType, setSelectedAccountType] = useState('member');

  const [mobile, setMobileNumber] = useState();

  useEffect(() => {
    const selectedItem = accountTypes[selectedIndex.row].value;
    setSelectedAccountType(selectedItem);
  }, [selectedIndex]);

  const [{ loading, data, error }, recover] = useAxios(
    {
      url: `/user/recover`,
      method: 'POST',
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      console.log('got data', data);
      const { id, role } = data;
      navigation.navigate('Verify', {
        id,
        role,
        mobile,
      });
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

  const onFormSubmit = () => {
    recover({
      data: {
        mobile,
        role: selectedAccountType,
      },
    });
  };

  return (
    <KeyboardAwareScrollView>
      <Layout style={styles.container}>
        <View style={{ height: height * 0.52 }}>
          <Image
            style={{
              width,
              height: height * 0.52,
              resizeMode: 'contain',
            }}
            source={require('./images/banner.jpg')}
          ></Image>
        </View>
        <View style={{ width, height: height * 0.38 }}>
          <Card
            style={{
              paddingTop: 20,
              ...styles.topBorders,
            }}
            disabled={true}
          >
            <Select
              label='Account Type'
              selectedIndex={selectedIndex}
              value={accountTypes[selectedIndex.row].title}
              onSelect={(index) => setSelectedIndex(index)}
            >
              {accountTypes.map((type) => (
                <SelectItem
                  title={type.title}
                  value={type.value}
                  key={type.value}
                />
              ))}
            </Select>
            <WhiteSpace size={2} />
            <TextInput
              key='mobile'
              keyboardType='phone-pad'
              placeholder={'Enter your mobile number'}
              autoCompleteType='tel'
              autoCapitalize='none'
              label={'Mobile Number'}
              onChangeText={setMobileNumber}
              validator={PhoneNumberValidator}
              errorString='Please enter your correct mobile number!'
            />
            <WhiteSpace size={2} />
            <Button status='basic' onPress={onFormSubmit} disabled={!mobile}>
              Recover Password
            </Button>
            <WhiteSpace />
            <Text
              style={{
                textAlign: 'center',
              }}
            >
              Remember Password?{' '}
              <Text
                style={{ fontWeight: 'bold' }}
                onPress={() => navigation.navigate('Login')}
              >
                Login Now.
              </Text>
            </Text>
            <WhiteSpace />
          </Card>
        </View>
        <ActivityIndicatorOverlay
          visible={loading}
          text={'Verifying Account...'}
        />
      </Layout>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPasswordScreen;
