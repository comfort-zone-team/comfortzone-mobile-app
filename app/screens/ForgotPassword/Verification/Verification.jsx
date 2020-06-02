import React, { useCallback, useEffect, useState } from "react";
import { Text, Layout, Input, Button } from "@ui-kitten/components";
import { StyleSheet, View, Image, Alert, BackHandler } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Linking } from "expo";
import WhiteSpace from "../../../components/Space/WhiteSpace";
import { useAxios } from "../../../config/axios.config";
import ActivityIndicatorOverlay from "../../../components/ActivityIndicator/ActivityIndicatorOverlay";
import { useFocusEffect } from "@react-navigation/native";

const email = "support@comfortzone.pk";

export default function Verification({ navigation, route }) {
  const [code, setCode] = useState("");

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

  const [{ loading, data, error }, verifyCode] = useAxios(
    {
      url: `/user/recover/verify`,
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      console.log("got data", data);
      navigation.navigate("NewPassword", route.params);
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

  const onCodeSubmit = () => {
    const { mobile } = route.params;

    verifyCode({
      data: { code, mobile },
    });
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("./verified.png")}
          style={{
            resizeMode: "contain",
            alignSelf: "center",
            marginBottom: 20,
          }}
        />
        <Text style={styles.text}>
          Please enter the 6-digit code the you have received via SMS to reset
          your account password.
        </Text>
        <TextInputMask
          type={"custom"}
          options={{
            mask: "999999",
          }}
          value={code}
          onChangeText={(text) => {
            setCode(text);
          }}
          customTextInput={Input}
          customTextInputProps={{
            style: styles.textInputStyle,
            textStyle: styles.textInputTextStyle,
            placeholder: "______",
            keyboardType: "phone-pad",
          }}
        />
        <Button
          appearance="outline"
          disabled={code.length !== 6}
          onPress={onCodeSubmit}
        >
          Submit
        </Button>
        <WhiteSpace />
        <Text style={styles.text} category="c1" appearance="hint">
          If you didn't receive any code or you have don't have access to your
          phone number then please contact us at:
        </Text>
        <Text
          style={{
            ...styles.text,
            fontWeight: "700",
          }}
          category="p2"
          appearance="hint"
          onPress={() => Linking.openURL(`mailto:${email}`)}
        >
          {email}
        </Text>
      </View>
      <ActivityIndicatorOverlay visible={loading} text={"Verifying Code..."} />
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
