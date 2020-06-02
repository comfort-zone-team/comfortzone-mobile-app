import styles from "./styles";
import React, { useState, useEffect } from "react";
import { View, Dimensions, Image, ScrollView, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Card, Text, Button, Layout } from "@ui-kitten/components";

import { TextInput } from "../../components/TextInput/TextInput";
import WhiteSpace from "../../components/Space/WhiteSpace";
import {
  NameValidator,
  UsernameValidator,
  PhoneNumberValidator,
  PasswordValidator,
} from "../../components/validators/Validators";
import ActivityIndicatorOverlay from "../../components/ActivityIndicator/ActivityIndicatorOverlay";
import { useAxios } from "../../config/axios.config";

const { height, width } = Dimensions.get("screen");

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [password, setPassword] = useState();

  const [{ loading, data, error }, register] = useAxios(
    {
      url: `/worker/register`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      Alert.alert(
        "Success",
        "Your account created successfully. You can login now!",
        [{ text: "Login", onPress: () => navigation.navigate("Login") }]
      );
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

  const onFormSubmit = () => {
    register({
      data: {
        name,
        username,
        password,
        mobile: mobileNumber,
      },
    });
  };
  return (
    <KeyboardAwareScrollView>
      <Layout style={styles.container}>
        <View style={{ height: height * 0.29 }}>
          <Image
            style={{
              width: width,
              height: height * 0.34,
              resizeMode: "cover",
            }}
            source={require("./images/banner.jpg")}
          ></Image>
        </View>
        <View style={{ width, height: height * 0.59 }}>
          <Card
            style={{ paddingTop: 20, ...styles.topBorders }}
            disabled={true}
          >
            <ScrollView>
              <TextInput
                key="name"
                type="text"
                placeholder={"Enter your name"}
                autoCompleteType="name"
                label={"Name"}
                onChangeText={setName}
                validator={NameValidator}
                errorString="Please enter your correct name!"
              />

              <WhiteSpace size={2} />
              <TextInput
                key="mobile"
                keyboardType="phone-pad"
                placeholder={"Enter your mobile number"}
                autoCompleteType="tel"
                autoCapitalize="none"
                label={"Mobile Number"}
                onChangeText={setMobileNumber}
                validator={PhoneNumberValidator}
                errorString="Please enter your correct mobile number!"
              />

              <WhiteSpace size={2} />
              <TextInput
                key="username"
                type="text"
                placeholder={"Enter your username"}
                autoCompleteType="username"
                autoCapitalize="none"
                label={"Username"}
                onChangeText={setUsername}
                validator={UsernameValidator}
                errorString="Username must be at least 6 characters long and may contain numbers!"
              />

              <WhiteSpace size={2} />
              <TextInput
                type="text"
                placeholder="Enter your password"
                autoCompleteType="password"
                label={"Password"}
                onChangeText={setPassword}
                validator={PasswordValidator}
                errorString="Password must contain at least 6 characters!"
                secureTextEntry={true}
              />
              <WhiteSpace size={2} />
              <Button
                status={"basic"}
                onPress={onFormSubmit}
                disabled={!name || !username || !password || !mobileNumber}
              >
                Register
              </Button>
              <WhiteSpace size={2} />
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                Already have an account?{" "}
                <Text
                  style={{ fontWeight: "bold" }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Login Now.
                </Text>
              </Text>
            </ScrollView>
          </Card>
        </View>
        <ActivityIndicatorOverlay
          visible={loading}
          text={"Creating new account..."}
        />
      </Layout>
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;
