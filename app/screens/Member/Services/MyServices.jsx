import React, { useContext, useEffect, useState } from "react";
import { Text, Card, Divider, Spinner } from "@ui-kitten/components";
import { AuthContext } from "../../../navigator/Navigator";
import { useAxios, UPLOADS_API_URL } from "../../../config/axios.config";
import {
  Alert,
  View,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
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

export default function MyServices({ navigation }) {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: "/member/services",
      method: "GET",
      params: {
        uid: user._id,
        my: true,
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

  const onServiceSelected = (service) =>
    navigation.navigate("Service", { service });

  return (
    <React.Fragment>
      {loading && (
        <View
          style={[
            styles.container,
            {
              alignItems: "center",
            },
          ]}
        >
          <Spinner size="large" />
        </View>
      )}
      {!loading && Object.keys(services).length === 0 && <EmptyView />}
      {!loading && services && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => refetch()} />
          }
        >
          <Services services={services} onServiceSelected={onServiceSelected} />
        </ScrollView>
      )}
    </React.Fragment>
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
