import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { TextInput } from '../../../components/TextInput/TextInput';
import {
  StringValidator,
  PhoneNumberValidator,
} from '../../../components/validators/Validators';
import WhiteSpace from '../../../components/Space/WhiteSpace';
import { ServiceCategories } from '../../../util/servicesCategories';

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
        </Layout>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
