import React, { useState, useContext, useEffect } from "react";
import {
  TopNavigation,
  Divider,
  Layout,
  Button,
  Icon,
  Text,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
  ListItem,
  List,
  Card,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../navigator/Navigator";
import { StyleSheet, View } from "react-native";
import WhiteSpace from "../../../components/Space/WhiteSpace";

const SettingsIcon = (props) => <Icon {...props} name="settings-2-outline" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;

const EditIcon = (props) => <Icon {...props} name="edit-2-outline" />;

const LockIcon = (props) => <Icon {...props} name="lock-outline" />;

export default function WorkerProfileScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);

  const [menuVisible, setMenuVisible] = useState(false);

  const onLogout = () => {
    signOut("worker");
  };

  const onEditProfile = () => {
    toggleMenu();
    navigation.navigate("EditProfile", { user });
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={SettingsIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
        style={{ marginTop: 25 }}
      >
        <MenuItem
          accessoryLeft={EditIcon}
          title="Edit Profile"
          onPress={onEditProfile}
        />
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={onLogout}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderProfileInfo = () => (
    <React.Fragment>
      <ListItem
        title={(props) => (
          <Text {...props} style={[props.style, styles.listTitle]}>
            {user.name}
          </Text>
        )}
        description={(props) => <Text {...props}>Name</Text>}
        style={styles.listItem}
        accessoryLeft={(props) => <Icon {...props} name="person-outline" />}
      />
      <Divider />
      <ListItem
        title={(props) => (
          <Text {...props} style={[props.style, styles.listTitle]}>
            {user.username}
          </Text>
        )}
        description={(props) => <Text {...props}>Username</Text>}
        style={styles.listItem}
        accessoryLeft={(props) => (
          <Icon {...props} name="person-done-outline" />
        )}
      />
      <Divider />
      <ListItem
        title={(props) => (
          <Text {...props} style={[props.style, styles.listTitle]}>
            {user.mobile}
          </Text>
        )}
        description={(props) => <Text {...props}>Mobile Number</Text>}
        style={styles.listItem}
        accessoryLeft={(props) => <Icon {...props} name="phone-outline" />}
      />
      <Divider />
      <ListItem
        title={(props) => (
          <Text {...props} style={[props.style, styles.listTitle]}>
            Worker
          </Text>
        )}
        description={(props) => <Text {...props}>Account Type</Text>}
        style={styles.listItem}
        accessoryLeft={(props) => <Icon {...props} name="briefcase-outline" />}
      />
    </React.Fragment>
  );

  return (
    <SafeAreaView>
      <TopNavigation
        title="Profile"
        alignment="center"
        accessoryRight={renderOverflowMenuAction}
      />
      <Divider />
      <Layout style={styles.container}>
        <View style={{ width: "100%" }}>
          <Card
            header={(props) => (
              <View {...props}>
                <WhiteSpace />
                <Text category="h5" style={styles.heading}>
                  Profile Info
                </Text>
              </View>
            )}
            disabled
          >
            {renderProfileInfo()}
            <WhiteSpace />
          </Card>
        </View>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
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
