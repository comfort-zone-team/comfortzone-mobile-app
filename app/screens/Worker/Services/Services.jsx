import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TopNavigation,
  Divider,
  TopNavigationAction,
  Icon,
  Layout,
  Text,
  Card,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useAxios, UPLOADS_API_URL } from "../../../config/axios.config";
import { AuthContext } from "../../../navigator/Navigator";

import Carousel from "react-native-anchor-carousel";

const { width } = Dimensions.get("screen");

const EmptyView = () => (
  <View style={styles.emptyView}>
    <Image
      source={require("./empty.png")}
      style={{ width: "80%", resizeMode: "contain" }}
    />
    <Text style={styles.emptyViewText}>
      Tap the + icon at the top right to add new service. You added services
      will appear here.
    </Text>
  </View>
);

const Services = ({ services, onServiceSelected }) => {
  const renderItem = ({ item: service, index }) => {
    return (
      <Card
        header={(props) => (
          <View {...props}>
            <Text category="h6">{service.title}</Text>
            <Text category="label">{service.mobile}</Text>
          </View>
        )}
        status="info"
        onPress={() => onServiceSelected(service)}
      >
        <Image
          source={{
            uri: `${UPLOADS_API_URL}${service.imagePath}`,
          }}
          style={{
            width: "100%",
            height: 50,
          }}
        />
      </Card>
    );
  };

  return (
    <View>
      {Object.keys(services).map((cat) => (
        <View style={styles.carouselContainer} key={cat}>
          <Text category="h6" style={{ fontWeight: "bold" }}>
            {cat.toUpperCase()}
          </Text>
          <Carousel
            style={styles.carousel}
            data={services[cat]}
            renderItem={renderItem}
            itemWidth={200}
            containerWidth={width - 20}
            separatorWidth={0}
          />
          <Divider />
        </View>
      ))}
    </View>
  );
};

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const ArchiveIcon = (props) => <Icon {...props} name="archive" />;

export default function WorkerServices({ navigation }) {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState({});

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onAddService = () => {
    navigation.navigate("AddService");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: "/worker/services",
      method: "GET",
      params: {
        uid: user._id,
      },
    },
    {
      useCache: false,
    }
  );

  useEffect(() => {
    if (data) {
      const { services } = data;
      setServices(services);
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

  const renderTopBarRight = (props) => (
    <React.Fragment>
      <TopNavigationAction
        {...props}
        icon={(props) => <Icon {...props} name="plus-outline" />}
        onPress={onAddService}
      />
      <OverflowMenu
        anchor={() => (
          <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
        )}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={ArchiveIcon}
          title="My Active Orders"
          onPress={() => {
            toggleMenu();
            navigation.navigate("MyOrders");
          }}
        />
        <MenuItem
          accessoryLeft={InfoIcon}
          title="My Orders History"
          onPress={() => {
            toggleMenu();
            navigation.navigate("MyOrdersHistory");
          }}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const onServiceSelected = (service) =>
    navigation.navigate("Service", { service });

  return (
    <SafeAreaView>
      <TopNavigation
        title="My Services"
        alignment="center"
        accessoryRight={renderTopBarRight}
      />
      <Divider />
      <Layout style={styles.container}>
        {Object.keys(services).length === 0 && <EmptyView />}
        {services && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => refetch()}
              />
            }
          >
            <Services
              services={services}
              onServiceSelected={onServiceSelected}
            />
          </ScrollView>
        )}
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
  },
  emptyView: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  emptyViewText: {
    textAlign: "center",
    padding: 10,
    color: "grey",
  },
  carouselContainer: {
    height: 200,
    marginBottom: 10,
  },
  carousel: {
    flex: 1,
  },
});
