import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Layout,
  Icon,
  Text,
  Button,
  IndexPath,
  Select,
  SelectItem,
  Modal,
  Card,
} from '@ui-kitten/components';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from '../../../components/TextInput/TextInput';
import {
  StringValidator,
  PhoneNumberValidator,
} from '../../../components/validators/Validators';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import { useAxios, UPLOADS_API_URL } from '../../../config/axios.config';
import { AuthContext } from '../../../navigator/Navigator';
import ActivityIndicatorOverlay from '../../../components/ActivityIndicator/ActivityIndicatorOverlay';
import { ServiceCategories } from './../../../util/servicesCategories';
import styles from './../../../navigator/styles';

const categories = ServiceCategories;
export default function UpdateMemberService({ navigation, route }) {
  const { service } = route.params;
  const [modelVisible, setModelVisible] = useState(false);

  const [title, setTitle] = useState(service.title);
  const [mobile, setMobile] = useState(service.mobile);
  const [address, setAddress] = useState(service.addess);
  const [selectedImage, setSelectedImage] = useState(null);

  const index = categories.findIndex(({ value }) => value === service.category);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(index));
  const [selectedCategory, setSelectedCategory] = useState(service.category);

  useEffect(() => {
    const selectedItem = categories[selectedIndex.row].value;
    setSelectedCategory(selectedItem);
  }, [selectedIndex]);

  const renderTopBarLeft = (props) => (
    <TopNavigationAction
      {...props}
      icon={(props) => <Icon {...props} name='arrow-back-outline' />}
      onPress={() => navigation.goBack()}
    />
  );

  const renderTopBarRight = (props) => (
    <TopNavigationAction
      {...props}
      icon={(props) => <Icon {...props} name='trash-2-outline' fill='red' />}
      onPress={() => setModelVisible(true)}
    />
  );

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('', 'Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({
      localUri: pickerResult.uri,
      base64: pickerResult.base64,
    });
  };

  const [{ loading, data, error }, updateService] = useAxios(
    {
      url: '/worker/service/update',
      method: 'POST',
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      Alert.alert('Success', 'Service Updated Successfully!');
      navigation.navigate('Services');
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

  const onServiceUpdate = () => {
    updateService({
      data: {
        id: service._id,
        title,
        mobile,
        address,
        image: selectedImage ? selectedImage.base64 : null,
        category: selectedCategory,
      },
    });
  };

  const [
    { loading: deleting, error: deleteError, data: deleteData },
    deleteService,
  ] = useAxios(
    {
      url: '/member/service/delete',
      method: 'POST',
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (deleteData) {
      Alert.alert('Success', 'Service Deleted Successfully!');
      navigation.navigate('Services');
    }
  }, [deleteData]);

  useEffect(() => {
    if (deleteError) {
      const message = deleteError.isAxiosError
        ? deleteError.response.data.message
        : deleteError.message;
      Alert.alert('Error', message);
    }
  }, [deleteError]);

  const onDeleteService = () => {
    deleteService({
      data: {
        id: service._id,
      },
    });
  };

  return (
    <SafeAreaView>
      <TopNavigation
        title='Update Service'
        alignment='center'
        accessoryLeft={renderTopBarLeft}
        accessoryRight={renderTopBarRight}
      />
      <Divider />
      <KeyboardAwareScrollView>
        <Layout style={styles.container}>
          <TextInput
            key='title'
            placeholder={'Enter Service Title'}
            label={'Title'}
            onChangeText={setTitle}
            validator={StringValidator}
            errorString='Title is required!'
            initialValue={service.title}
          />
          <WhiteSpace />
          <TextInput
            key='mobile'
            placeholder={'Enter Mobile Number'}
            autoCompleteType='tel'
            keyboardType='phone-pad'
            label={'Mobile Number'}
            onChangeText={setMobile}
            validator={PhoneNumberValidator}
            errorString='Please enter valid mobile number!'
            initialValue={service.mobile}
          />
          <WhiteSpace />
          <TextInput
            key='address'
            type='text'
            placeholder={'Enter Address'}
            label={'Address'}
            onChangeText={setAddress}
            validator={StringValidator}
            errorString='Address is required!'
            initialValue={service.address}
            multiline={true}
          />
          <WhiteSpace />
          <Select
            label='Category'
            selectedIndex={selectedIndex}
            value={categories[selectedIndex.row].title}
            onSelect={(index) => setSelectedIndex(index)}
          >
            {categories.map((type) => (
              <SelectItem
                title={type.title}
                value={type.value}
                key={type.value}
              />
            ))}
          </Select>
          <WhiteSpace />

          <Divider />

          {selectedImage && (
            <View style={styles.thumbnailView}>
              <Image
                source={{ uri: selectedImage.localUri }}
                style={styles.thumbnail}
              />
            </View>
          )}

          {!selectedImage && service.imagePath && (
            <View style={styles.thumbnailView}>
              <Image
                source={{ uri: `${UPLOADS_API_URL}${service.imagePath}` }}
                style={styles.thumbnail}
              />
            </View>
          )}

          <Button
            appearance='outline'
            onPress={onServiceUpdate}
            disabled={!title || !mobile || !address || !selectedCategory}
          >
            Update Service
          </Button>
          <ActivityIndicatorOverlay
            visible={deleting}
            text={'Deleting service...'}
          />
          <ActivityIndicatorOverlay
            visible={deleting}
            text={'Deleting service...'}
          />
          <Modal
            visible={modelVisible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setModelVisible(false)}
          >
            <Card disabled={true}>
              <Text style={{ textAlign: 'center' }}>
                Do you confirm deleting this service?
              </Text>
              <WhiteSpace size={2} />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <Button
                  onPress={() => setModelVisible(false)}
                  status='basic'
                  style={{ width: '40%' }}
                >
                  No
                </Button>
                <Button
                  onPress={onDeleteService}
                  style={{ width: '40%' }}
                  status='danger'
                >
                  Yes
                </Button>
              </View>
            </Card>
          </Modal>
        </Layout>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 70,
  },
  thumbnail: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  thumbnailView: {
    textAlign: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
