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

export default function WorkerOrderDetails({ navigation, route }) {
  const { order } = route.params;

  console.log("Order", order);

  const service = order.service;
  const member = order.member;

  const [{ loading, data, error }, changeApprovalStatus] = useAxios(
    {
      url: "/member/service/changeApprovalStatus",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (data) {
      Alert.alert("Success", "Order Status Updated Successfully!");
      navigation.navigate("MyOrders");
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

  const onApprovalStatusChange = (isAccepted) => {
    changeApprovalStatus({
      data: {
        orderID: order._id,
        isAccepted,
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
            />
            <View style={{ alignSelf: "center", marginTop: 50 }}>
              <Rating
                type="custom"
                style={{ paddingVertical: 10 }}
                startingValue={order.rating ? order.rating : 0}
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
                {order.rating > 0
                  ? `${service.rating} out of 5`
                  : "Not Rated Yet!"}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <Layout style={styles.container}>
          <View style={styles.content}>
            <Text category="h5" style={{ textAlign: "center" }}>
              Member Details
            </Text>
            <WhiteSpace size={2} />
            <ListItem
              title={(props) => (
                <Text {...props} style={[props.style, styles.listTitle]}>
                  {member.name}
                </Text>
              )}
              description={(props) => <Text {...props}>Name</Text>}
              style={styles.listItem}
              accessoryLeft={(props) => (
                <Icon {...props} name="person-outline" />
              )}
            />
            <Divider />
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
                  {`H # ${member.houseNumber}, Sector ${member.sector}, Block ${member.block}`}
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
                  {new Date(order.createdAt).toUTCString()}
                </Text>
              )}
              description={(props) => (
                <Text {...props}>Order Creation Date</Text>
              )}
              style={styles.listItem}
              accessoryLeft={(props) => (
                <Icon {...props} name="calendar-outline" />
              )}
            />
            <Divider />
            <WhiteSpace size={2} />
            {!order.isAcceptanceStatusUpdated && (
              <View style={{ flexDirection: "row" }}>
                <Button
                  style={{ width: "50%" }}
                  status="success"
                  onPress={() => onApprovalStatusChange(true)}
                >
                  Accept
                </Button>
                <Button
                  style={{ width: "50%" }}
                  status="danger"
                  onPress={() => onApprovalStatusChange(false)}
                >
                  Reject
                </Button>
              </View>
            )}
            {order.isAcceptanceStatusUpdated && !order.isAccepted && (
              <Button status="danger" disabled>
                Order Cancelled
              </Button>
            )}
            {order.isAcceptanceStatusUpdated &&
              order.isAccepted &&
              !order.isCompleted && (
                <Button status="success" disabled>
                  Order is Active
                </Button>
              )}
            {order.isAcceptanceStatusUpdated &&
              order.isAccepted &&
              order.isCompleted && (
                <Button status="success" disabled>
                  Order Completed!
                </Button>
              )}
          </View>
          <ActivityIndicatorOverlay
            text="Updating Order Status..."
            visible={loading}
          />
        </Layout>
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
