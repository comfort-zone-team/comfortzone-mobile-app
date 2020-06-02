import styles from "./styles";
import React, { useContext, useState, useEffect } from "react";
import { View, Dimensions, Image, Alert, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { human } from "react-native-typography";

import { TextInput } from "../../components/TextInput/TextInput";

const { height, width } = Dimensions.get("screen");

import { AuthContext } from "../../navigator/Navigator";
import {
  Layout,
  Card,
  Text,
  Button,
  Select,
  SelectItem,
  IndexPath,
  Modal,
  Spinner,
} from "@ui-kitten/components";
import WhiteSpace from "../../components/Space/WhiteSpace";
import { StringValidator } from "../../components/validators/Validators";
import { useAxios } from "../../config/axios.config";
import ActivityIndicatorOverlay from "../../components/ActivityIndicator/ActivityIndicatorOverlay";
import { ScrollView } from "react-native-gesture-handler";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const accountTypes = [
  {
    title: "Member",
    value: "member",
  },
  {
    title: "Driver",
    value: "driver",
  },
  {
    title: "Worker",
    value: "worker",
  },
];

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedAccountType, setSelectedAccountType] = useState("member");

  const [username, setUsername] = useState();
  const [membershipNumber, setMembershipNumber] = useState();
  const [password, setPassword] = useState();

  const [banner, setBanner] = useState(require("./images/banner.jpg"));

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You will miss the notifications regarding drivers."
        );
        return null;
      }

      if (Platform.OS === "android") {
        Notifications.createChannelAndroidAsync("default", {
          name: "default",
          sound: true,
          priority: "max",
          vibrate: [0, 250, 250, 250],
        });
      }

      token = await Notifications.getExpoPushTokenAsync();
      return token;
    } else {
      Alert.alert("Must use physical device for Push Notifications");
    }
  };

  useEffect(() => {
    const selectedItem = accountTypes[selectedIndex.row].value;
    if (selectedItem === "member") {
      setBanner(require("./images/banner.jpg"));
      setSelectedAccountType("member");
    } else if (selectedItem === "driver") {
      setBanner(require("./images/truck.jpg"));
      setSelectedAccountType("driver");
    } else {
      setBanner(require("./images/worker.jpg"));
      setSelectedAccountType("worker");
    }
  }, [selectedIndex]);

  const [{ loading, data, error }, login] = useAxios(
    {
      url: `/${selectedAccountType}/login`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      signIn(data);
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

  const onFormSubmit = async () => {
    const formData =
      selectedAccountType === "member"
        ? {
            membershipNumber,
            password,
          }
        : {
            username,
            password,
          };

    if (selectedAccountType === "member") {
      // Ask for notification token

      try {
        const token = await registerForPushNotificationsAsync();

        login({
          data: {
            ...formData,
            token,
          },
        });
        return;
      } catch (e) {
        console.log("Error: ", e.message);
        Alert.alert("Internal Server Error", "Please try logging in again.");
      }
    }
    login({
      data: formData,
    });
  };

  return (
    <KeyboardAwareScrollView>
      <Layout style={styles.container}>
        <View style={{ height: height * 0.4 }}>
          <Image
            style={{
              width,
              height: height * 0.42,
              resizeMode: "contain",
            }}
            source={banner}
          ></Image>
        </View>
        <View style={{ width, height: height * 0.48 }}>
          <Card
            style={{
              ...styles.topBorders,
              paddingTop: 20,
            }}
            disabled={true}
          >
            <ScrollView>
              <Select
                label="Account Type"
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
              {selectedAccountType === "driver" ||
              selectedAccountType === "worker" ? (
                <TextInput
                  key="username"
                  type="text"
                  placeholder={"Enter your username"}
                  autoCompleteType="username"
                  autoCapitalize="none"
                  label={"Username"}
                  onChangeText={setUsername}
                  validator={StringValidator}
                  errorString="Username is required!"
                />
              ) : (
                <TextInput
                  key="mem_number"
                  type="text"
                  placeholder={"Enter your membership number"}
                  autoCompleteType="username"
                  autoCapitalize="none"
                  label={"Membership No."}
                  onChangeText={setMembershipNumber}
                  value={membershipNumber}
                  validator={StringValidator}
                  errorString="Membership number is required!"
                />
              )}
              <WhiteSpace size={2} />
              <TextInput
                type="text"
                placeholder="**************"
                autoCompleteType="password"
                label={"Password"}
                onChangeText={setPassword}
                validator={StringValidator}
                errorString="Password is required!"
                secureTextEntry={true}
              />
              <WhiteSpace />
              <Text
                style={{
                  ...human.caption1,
                  fontFamily: "Raleway",
                  textAlign: "right",
                  color: "grey",
                }}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Forgot Password?
              </Text>
              <WhiteSpace />
              <Button
                status="basic"
                onPress={onFormSubmit}
                disabled={
                  selectedAccountType === "member"
                    ? !membershipNumber || !password
                    : !username || !password
                }
              >
                Login
              </Button>
              <WhiteSpace />
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                Need a worker account?{" "}
                <Text
                  style={{ fontWeight: "bold" }}
                  onPress={() => navigation.navigate("Register")}
                >
                  Register Now.
                </Text>
              </Text>
            </ScrollView>
          </Card>
        </View>
        <ActivityIndicatorOverlay visible={loading} text={"Logging in..."} />
      </Layout>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
