import React, { useCallback, useState, useEffect } from "react";
import { Text, Layout, Button } from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, StyleSheet, Image, View, Alert } from "react-native";
import ActivityIndicatorOverlay from "../../../components/ActivityIndicator/ActivityIndicatorOverlay";
import WhiteSpace from "../../../components/Space/WhiteSpace";
import { TextInput } from "../../../components/TextInput/TextInput";
import { PasswordValidator } from "../../../components/validators/Validators";
import { useAxios } from "../../../config/axios.config";

export default function NewPassword({ navigation, route }) {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [{ loading, data, error }, updatePassword] = useAxios(
    {
      url: `/user/recover/changePassword`,
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
        "Password Updated Successfully!",
        [{ text: "Login", onPress: () => navigation.navigate("Login") }],
        {
          cancelable: false,
        }
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

  const onPasswordChange = () => {
    const { id, role } = route.params;
    console.log("Data: ", id, role);
    updatePassword({
      data: {
        password,
        id,
        role,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.popToTop();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("./password.png")}
          style={{
            resizeMode: "contain",
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        <TextInput
          type="text"
          placeholder="Enter new password"
          autoCompleteType="password"
          label={"New Password"}
          onChangeText={setPassword}
          validator={PasswordValidator}
          errorString="Password must contain at least 6 characters!"
          secureTextEntry={true}
        />

        <WhiteSpace />

        <TextInput
          type="text"
          placeholder="Confirm password"
          autoCompleteType="password"
          label={"Confirm Password"}
          onChangeText={setConfirmPassword}
          validator={(p) => p === password}
          errorString="Make sure new password and the confirm password are same."
          secureTextEntry={true}
        />

        <WhiteSpace />
        <Button
          appearance="outline"
          onPress={onPasswordChange}
          disabled={
            !password || !confirmPassword || password !== confirmPassword
          }
        >
          Change Password
        </Button>
        <WhiteSpace />
      </View>
      <ActivityIndicatorOverlay
        visible={loading}
        text={"Updating Password..."}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 25,
  },
  text: {
    textAlign: "center",
  },
  textInputStyle: {
    width: "47%",
    alignSelf: "center",
    margin: 20,
  },
  textInputTextStyle: {
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 9,
  },
});
