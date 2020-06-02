import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TopNavigation,
  Divider,
  TopNavigationAction,
  Icon,
  Layout,
  Text,
  Button,
  IndexPath,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { StyleSheet, View, Image, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

import { TextInput } from "../../../components/TextInput/TextInput";
import {
  StringValidator,
  PhoneNumberValidator,
} from "../../../components/validators/Validators";
import WhiteSpace from "../../../components/Space/WhiteSpace";
import { useAxios } from "../../../config/axios.config";
import { AuthContext } from "../../../navigator/Navigator";
import ActivityIndicatorOverlay from "../../../components/ActivityIndicator/ActivityIndicatorOverlay";

import { ServiceCategories } from "../../../util/servicesCategories";

const categories = ServiceCategories;

export default function AddMemberService({ navigation }) {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState();
  const [mobile, setMobile] = useState();
  const [address, setAddress] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedCategory, setSelectedCategory] = useState("electrician");

  useEffect(() => {
    const selectedItem = categories[selectedIndex.row].value;
    setSelectedCategory(selectedItem);
  }, [selectedIndex]);

  const renderTopBarLeft = (props) => (
    <TopNavigationAction
      {...props}
      icon={(props) => <Icon {...props} name="arrow-back-outline" />}
      onPress={() => navigation.navigate("Services")}
    />
  );

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("", "Permission to access camera roll is required!");
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

  const [{ loading, data, error }, addService] = useAxios(
    {
      url: "/member/service/add",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      Alert.alert("Success", "Service Added Successfully!");
      navigation.navigate("Services");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const message = error.isAxiosError
        ? error.response.data.message
        : error.message;
      Alert.alert("Error", message);
    }
  }, [error]);

  const onAddService = () => {
    addService({
      data: {
        uid: user._id,
        title,
        mobile,
        address,
        image: selectedImage.base64,
        category: selectedCategory,
      },
    });
  };

  return (
    <SafeAreaView>
      <TopNavigation
        title="Add New Service"
        alignment="center"
        accessoryLeft={renderTopBarLeft}
      />
      <Divider />
      <KeyboardAwareScrollView>
        <Layout style={styles.container}>
          <TextInput
            key="title"
            placeholder={"Enter Service Title"}
            label={"Title"}
            onChangeText={setTitle}
            validator={StringValidator}
            errorString="Title is required!"
          />
          <WhiteSpace />
          <TextInput
            key="mobile"
            placeholder={"Enter Mobile Number"}
            autoCompleteType="tel"
            keyboardType="phone-pad"
            label={"Mobile Number"}
            onChangeText={setMobile}
            validator={PhoneNumberValidator}
            errorString="Please enter valid mobile number!"
          />
          <WhiteSpace />
          <TextInput
            key="address"
            type="text"
            placeholder={"Enter Address"}
            label={"Address"}
            onChangeText={setAddress}
            validator={StringValidator}
            errorString="Address is required!"
            multiline={true}
          />
          <WhiteSpace />

          <Select
            label="Category"
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

          <Button
            appearance="outline"
            status="basic"
            onPress={openImagePickerAsync}
          >
            {selectedImage ? "Change Image" : "Select Image"}
          </Button>

          <WhiteSpace size={2} />

          <Button
            appearance="outline"
            onPress={onAddService}
            disabled={
              !title ||
              !mobile ||
              !address ||
              !selectedImage ||
              !selectedCategory
            }
          >
            Add New Service
          </Button>
          <ActivityIndicatorOverlay
            visible={loading}
            text={"Adding new service..."}
          />
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
    resizeMode: "contain",
    alignSelf: "center",
  },
  thumbnailView: {
    textAlign: "center",
  },
});
