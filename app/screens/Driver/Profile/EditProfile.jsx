import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  TopNavigation,
  Icon,
  TopNavigationAction,
  Divider,
  Layout,
  Input,
  Card,
  Button,
} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput } from '../../../components/TextInput/TextInput';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import {
  NameValidator,
  PhoneNumberValidator,
  PasswordValidator,
  StringValidator,
} from '../../../components/validators/Validators';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAxios } from '../../../config/axios.config';
import ActivityIndicatorOverlay from '../../../components/ActivityIndicator/ActivityIndicatorOverlay';
import { AuthContext } from '../../../navigator/Navigator';

export default function EditDriverProfile({ navigation, route }) {
  const { user } = route.params;
  const { updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user.name);
  const [mobile, setMobileNumber] = useState(user.mobile);

  const [currentPassword, setCurrentPassword] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [{ loading, data, error }, updateProfile] = useAxios(
    {
      url: `/driver/profile/update`,
      method: 'POST',
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      updateUser({
        ...user,
        name,
        mobile,
      });
      Alert.alert('Success', 'Your profile updated successfully.');
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

  const onUpdateProfile = () => {
    const { _id } = user;
    updateProfile({
      data: {
        _id,
        name,
        mobile,
      },
    });
  };

  const [
    { loading: cpLoading, data: cpData, error: cpError },
    updatePassword,
  ] = useAxios(
    {
      url: `/driver/profile/password`,
      method: 'POST',
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (cpData) {
      Alert.alert('Success', 'Password changed successfully.');
    }
  }, [cpData]);

  useEffect(() => {
    if (cpError) {
      const message = cpError.isAxiosError
        ? cpError.response.data.message
        : cpError.message;
      Alert.alert('Error', message);
    }
  }, [cpError]);

  const onPasswordChange = () => {
    const { username } = user;
    updatePassword({
      data: {
        username,
        currentPassword,
        password,
      },
    });
  };

  return (
    <SafeAreaView>
      <TopNavigation
        title='Edit Profile'
        alignment='center'
        accessoryLeft={(props) => (
          <TopNavigationAction
            onPress={() => navigation.goBack()}
            icon={(props) => <Icon {...props} name='arrow-back-outline' />}
          />
        )}
      />
      <Divider />
      <KeyboardAwareScrollView>
        <Layout style={styles.container}>
          <View style={styles.content}>
            <Card
              header={(props) => (
                <View {...props}>
                  <WhiteSpace />
                  <Text category='h5'>Edit Basic Profile Info</Text>
                </View>
              )}
              style={styles.card}
              footer={(props) => (
                <View {...props} style={[props.style, styles.footerContainer]}>
                  <Button
                    style={styles.footerControl}
                    size='small'
                    disabled={!name || !mobile}
                    onPress={onUpdateProfile}
                  >
                    Update Profile
                  </Button>
                </View>
              )}
              disabled
            >
              <Input label='username' value={user.username} disabled />
              <WhiteSpace />
              <TextInput
                key='name'
                type='text'
                placeholder={'Enter your name'}
                autoCompleteType='name'
                label={'Name'}
                onChangeText={setName}
                validator={NameValidator}
                errorString='Please enter your correct name!'
                initialValue={user.name}
              />
              <WhiteSpace />
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
                initialValue={user.mobile}
              />
            </Card>
            {/* Change Password */}
            <Card
              header={(props) => (
                <View {...props}>
                  <WhiteSpace />
                  <Text category='h5'>Change Password</Text>
                </View>
              )}
              style={styles.card}
              footer={(props) => (
                <View {...props} style={[props.style, styles.footerContainer]}>
                  <Button
                    style={styles.footerControl}
                    size='small'
                    disabled={!name || !mobile}
                    onPress={onPasswordChange}
                  >
                    Change Password
                  </Button>
                </View>
              )}
              disabled
            >
              <TextInput
                type='text'
                placeholder='Current Password'
                autoCompleteType='password'
                label={'Current Password'}
                onChangeText={setCurrentPassword}
                validator={StringValidator}
                errorString='Password cannot be empty!'
                secureTextEntry={true}
              />

              <WhiteSpace />

              <TextInput
                type='text'
                placeholder='Enter new password'
                autoCompleteType='password'
                label={'New Password'}
                onChangeText={setPassword}
                validator={PasswordValidator}
                errorString='Password must contain at least 6 characters!'
                secureTextEntry={true}
              />

              <WhiteSpace />

              <TextInput
                type='text'
                placeholder='Confirm password'
                autoCompleteType='password'
                label={'Confirm Password'}
                onChangeText={setConfirmPassword}
                validator={(p) => p === password}
                errorString='Make sure new password and the confirm password are same.'
                secureTextEntry={true}
              />
            </Card>
          </View>
          <ActivityIndicatorOverlay
            visible={loading || cpLoading}
            text={loading ? 'Updating Profile...' : 'Updating Password...'}
          />
        </Layout>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    padding: 0,
    paddingBottom: 60,
  },
  content: {
    padding: 20,
    width: '100%',
  },
  card: {
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
});
