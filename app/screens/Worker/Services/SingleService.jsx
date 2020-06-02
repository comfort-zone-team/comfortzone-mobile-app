import React from "react";
import {
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Layout,
  ListItem,
  Divider,
} from "@ui-kitten/components";
import { View, ImageBackground, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UPLOADS_API_URL } from "../../../config/axios.config";
import WhiteSpace from "../../../components/Space/WhiteSpace";

export default function WorkerSingleService({ navigation, route }) {
  const { service } = route.params;
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
              accessoryRight={(props) => (
                <TopNavigationAction
                  {...props}
                  icon={(props) => (
                    <Icon {...props} fill="#fff" name="edit-outline" />
                  )}
                  onPress={() =>
                    navigation.navigate("UpdateService", { service })
                  }
                />
              )}
            />
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
          </View>
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
});
