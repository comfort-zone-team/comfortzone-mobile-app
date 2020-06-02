import React from "react";
import { Text, Card } from "@ui-kitten/components";
import { View, StyleSheet, Image, ScrollView } from "react-native";

const CategoryBox = ({ title, icon, onCategorySelected }) => {
  return (
    <Card
      style={styles.box}
      onPress={() => onCategorySelected(title.toLowerCase())}
    >
      {icon && <Image source={icon} style={{ width: 80, height: 80 }} />}
      <Text style={styles.text} category="h6">
        {title}
      </Text>
    </Card>
  );
};

export default function AvailableServices({ navigation }) {
  const onCategorySelected = (category) => {
    navigation.navigate("Category", {
      category,
    });
  };

  return (
    <React.Fragment>
      <View style={styles.container}>
        <View style={styles.row}>
          <CategoryBox
            title="Electrician"
            icon={require("./icons/electrician.png")}
            onCategorySelected={onCategorySelected}
          />
          <CategoryBox
            title="Labour"
            icon={require("./icons/labour.png")}
            onCategorySelected={onCategorySelected}
          />
        </View>
        <View style={styles.row}>
          <CategoryBox
            title="Beautician"
            icon={require("./icons/beautician.png")}
            onCategorySelected={onCategorySelected}
          />
          <CategoryBox
            title="Tailor"
            icon={require("./icons/tailor.png")}
            onCategorySelected={onCategorySelected}
          />
        </View>
        <View style={styles.row}>
          <CategoryBox
            title="Maid"
            icon={require("./icons/maid.png")}
            onCategorySelected={onCategorySelected}
          />
          <CategoryBox
            title="Helper"
            icon={require("./icons/helper.png")}
            onCategorySelected={onCategorySelected}
          />
        </View>
        <View style={styles.row}>
          <CategoryBox
            title="Plumber"
            icon={require("./icons/plumber.png")}
            onCategorySelected={onCategorySelected}
          />
          <CategoryBox
            title="Gardener"
            icon={require("./icons/gardener.png")}
            onCategorySelected={onCategorySelected}
          />
        </View>
        <View style={styles.row}>
          <CategoryBox
            title="Water Tanker"
            icon={require("./icons/water-tanker.png")}
            onCategorySelected={onCategorySelected}
          />
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: "100%",
    marginBottom: 170,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: "46%",
    elevation: 2,
    margin: 10,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
