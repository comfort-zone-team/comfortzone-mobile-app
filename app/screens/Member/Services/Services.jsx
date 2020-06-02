import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TopNavigation,
  Divider,
  TopNavigationAction,
  Icon,
  Layout,
  TabBar,
  Tab,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";
import { StyleSheet, ScrollView } from "react-native";

import AvailableServices from "./AvailableServices";
import HiredServices from "./HiredServices";
import MyServices from "./MyServices";

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const ArchiveIcon = (props) => <Icon {...props} name="archive" />;

const PersonIcon = (props) => <Icon {...props} name="person" />;

export default function MemberServices({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onAddService = () => {
    navigation.navigate("AddService");
  };

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
        <Divider />
        <MenuItem
          accessoryLeft={PersonIcon}
          title="My Hiring History"
          onPress={() => {
            toggleMenu();
            navigation.navigate("MyHiringHistory");
          }}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  return (
    <SafeAreaView>
      <TopNavigation
        title="Services"
        alignment="center"
        accessoryRight={renderTopBarRight}
      />
      <Divider />
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <Tab title="Available" />
        <Tab title="Currently Hired" />
        <Tab title="My Services" />
      </TabBar>
      <Layout style={styles.container}>
        <ScrollView>
          {selectedIndex === 2 && <MyServices navigation={navigation} />}
          {selectedIndex === 1 && <HiredServices navigation={navigation} />}
          {selectedIndex === 0 && <AvailableServices navigation={navigation} />}
        </ScrollView>
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
