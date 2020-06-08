import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TopNavigation,
  Divider,
  Layout,
  Text,
  Button,
  Modal,
  Card,
} from '@ui-kitten/components';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { TextInput } from '../../../components/TextInput/TextInput';
import {
  StringValidator,
  PhoneNumberValidator,
} from '../../../components/validators/Validators';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import ActivityIndicatorOverlay from '../../../components/ActivityIndicator/ActivityIndicatorOverlay';
import { ServiceCategories } from './../../../util/servicesCategories';
import styles from './../../../navigator/styles';

const categories = ServiceCategories;

export default function UpdateMemberService() {
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
