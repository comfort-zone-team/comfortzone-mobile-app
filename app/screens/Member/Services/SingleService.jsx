import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Layout,
  ListItem,
  Divider,
  Button,
  Modal,
  Card,
  Spinner,
} from "@ui-kitten/components";
import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UPLOADS_API_URL, useAxios } from "../../../config/axios.config";
import WhiteSpace from "../../../components/Space/WhiteSpace";
import { AuthContext } from "../../../navigator/Navigator";

import { Linking } from "expo";
import ActivityIndicatorOverlay from "../../../components/ActivityIndicator/ActivityIndicatorOverlay";

import { Rating } from "react-native-ratings";

export default function MemberSingleService({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const { service } = route.params;

  const isServicePersonal = user._id === service.uid;

  const [rating, setRating] = useState(null);
  const [modelVisible, setModelVisible] = useState(false);
  const [completionModelVisible, setCompletionModelVisible] = useState(false);

  const [
    { loading: loadingHiringStatus, data: hiringData, error: hiringError },
  ] = useAxios(
    {
      url: "/member/service/hireStatus",
      method: "GET",
      params: {
        serviceID: service._id,
        memberID: user._id,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (hiringError) {
      const message = hiringError.isAxiosError
        ? hiringError.response.data.message
        : hiringError.message;
      Alert.alert("Error", message);
    }
  }, [hiringError]);

  const [{ loading, data, error }, hireService] = useAxios(
    {
      url: "/member/service/hire",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      Alert.alert("Success", "Service Hired Successfully!");
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

  const onHireService = () => {
    const serviceID = service._id;
    const memberID = user._id;

    hireService({
      data: {
        serviceID,
        memberID,
      },
    });
  };

  const [
    { loading: loadingComplete, data: completeData, error: completeError },
    markAsComplete,
  ] = useAxios(
    {
      url: "/member/service/markComplete",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (completeData) {
      Alert.alert("Success", "Service is successfully marked as completed!");
      navigation.navigate("Services");
    }
  }, [completeData]);

  useEffect(() => {
    if (completeError) {
      const message = completeError.isAxiosError
        ? completeError.response.data.message
        : completeError.message;
      Alert.alert("Error", message);
    }
  }, [error]);

  const onServiceComplete = () => {
    setCompletionModelVisible(false);
    markAsComplete({
      data: {
        serviceID: service._id,
        memberID: user._id,
        rating,
      },
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <ImageBackground
          source={{
            uri: `${UPLOADS_API_URL}${service.imagePath}`,
          }}
          style={{
            width: "100%",
            height: 300,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              height: "100%",
            }}
          >
            <TopNavigation
              title={() => (
                <Text category="h6" style={{ color: "white" }}>
                  {service.title}
                </Text>
              )}
              alignment="center"
              appearance={"control"}
              accessoryLeft={(props) => (
                <TopNavigationAction
                  {...props}
                  icon={(props) => (
                    <Icon {...props} fill="#fff" name="arrow-back-outline" />
                  )}
                  onPress={() => navigation.goBack()}
                />
              )}
              accessoryRight={(props) =>
                isServicePersonal ? (
                  <TopNavigationAction
                    {...props}
                    icon={(props) => (
                      <Icon {...props} fill="#fff" name="edit-outline" />
                    )}
                    onPress={() =>
                      navigation.navigate("UpdateService", { service })
                    }
                  />
                ) : null
              }
            />
            <View style={{ alignSelf: "center", marginTop: 50 }}>
              <Rating
                type="custom"
                style={{ paddingVertical: 10 }}
                startingValue={service.rating}
                ratingBackgroundColor={"transparent"}
                tintColor="rgba(0, 0, 0, 0.4)"
                imageSize={35}
                readonly
              />
              <Text
                style={{ textAlign: "center", color: "white" }}
                appearance="hint"
                category="p1"
              >
                {service.rating > 0
                  ? `${service.rating}/5 rating based on ${service.totalHiring} orders.`
                  : "No Ratings Yet!"}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <Layout style={styles.container}>
          <View style={styles.content}>
            <Text category="h5" style={{ textAlign: "center" }}>
              {service.title}
            </Text>
            <WhiteSpace size={2} />
            <ListItem
              title={(props) => (
                <Text {...props} style={[props.style, styles.listTitle]}>
                  {service.mobile}
                </Text>
              )}
              description={(props) => <Text {...props}>Mobile Number</Text>}
              style={styles.listItem}
              accessoryLeft={(props) => (
                <Icon {...props} name="phone-outline" />
              )}
              onPress={() => Linking.openURL(`tel:${service.mobile}`)}
            />
            <Divider />
            <WhiteSpace size={2} />
            <ListItem
              title={(props) => (
                <Text {...props} style={[props.style, styles.listTitle]}>
                  {service.address}
                </Text>
              )}
              description={(props) => <Text {...props}>Address</Text>}
              style={styles.listItem}
              accessoryLeft={(props) => (
                <Icon {...props} name="email-outline" />
              )}
            />
            <Divider />
            <WhiteSpace size={2} />
            <ListItem
              title={(props) => (
                <Text {...props} style={[props.style, styles.listTitle]}>
                  {service.category}
                </Text>
              )}
              description={(props) => <Text {...props}>Category</Text>}
              style={styles.listItem}
              accessoryLeft={(props) => (
                <Icon {...props} name="award-outline" />
              )}
            />
            <Divider />
            {service.createdAt && (
              <React.Fragment>
                <WhiteSpace size={2} />
                <ListItem
                  title={(props) => (
                    <Text {...props} style={[props.style, styles.listTitle]}>
                      {new Date(service.createdAt).toUTCString()}
                    </Text>
                  )}
                  description={(props) => <Text {...props}>Created At</Text>}
                  style={styles.listItem}
                  accessoryLeft={(props) => (
                    <Icon {...props} name="calendar-outline" />
                  )}
                />
                <Divider />
              </React.Fragment>
            )}
            <WhiteSpace size={2} />
            {!isServicePersonal &&
              !loadingHiringStatus &&
              hiringData &&
              hiringData.canHire && (
                <Button
                  appearance="outline"
                  onPress={() => setModelVisible(true)}
                >
                  Hire Service
                </Button>
              )}
            {!isServicePersonal &&
              !loadingHiringStatus &&
              hiringData &&
              !hiringData.canHire &&
              hiringData.canMarkAsComplete && (
                <Button
                  appearance="outline"
                  status={"success"}
                  onPress={() => setCompletionModelVisible(true)}
                >
                  Mark as Completed
                </Button>
              )}
            {!isServicePersonal &&
              !loadingHiringStatus &&
              hiringData &&
              !hiringData.canHire &&
              !hiringData.canMarkAsComplete && (
                <Button appearance="outline" status={"info"} disabled>
                  Awaiting Approval by Worker
                </Button>
              )}
          </View>
        </Layout>
        <Modal
          visible={modelVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModelVisible(false)}
        >
          <Card disabled={true}>
            <Text style={{ textAlign: "center" }}>
              Do you confirm to hire this service?
            </Text>
            <WhiteSpace size={2} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={() => setModelVisible(false)}
                status="basic"
                style={{ width: "40%" }}
              >
                No
              </Button>
              <Button
                onPress={onHireService}
                style={{ width: "40%" }}
                status="success"
              >
                Yes
              </Button>
            </View>
          </Card>
        </Modal>
        <Modal
          visible={completionModelVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setCompletionModelVisible(false)}
        >
          <Card disabled={true}>
            <Text style={{ textAlign: "center" }}>
              Please rate the service in order to mark the service as completed!
            </Text>
            <WhiteSpace size={2} />
            <Rating
              showRating
              startingValue={0}
              onFinishRating={(rating) => setRating(rating)}
              style={{ paddingVertical: 10 }}
            />
            <WhiteSpace size={2} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={() => setCompletionModelVisible(false)}
                status="basic"
                style={{ width: "40%" }}
              >
                Cancel
              </Button>
              <Button
                onPress={onServiceComplete}
                style={{ width: "40%" }}
                status="success"
                disabled={!rating}
              >
                Complete!
              </Button>
            </View>
          </Card>
        </Modal>
        <ActivityIndicatorOverlay
          visible={loading}
          text={"Hiring service..."}
        />
        <ActivityIndicatorOverlay
          visible={loadingComplete}
          text={"Updating Service Status..."}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    height: "100%",
  },
  content: {
    borderWidth: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
    marginTop: -40,
    backgroundColor: "white",
    height: "100%",
    padding: 20,
  },
  listTitle: {
    fontSize: 18,
  },
  listItem: {
    height: 50,
  },
  heading: {
    paddingLeft: 20,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
