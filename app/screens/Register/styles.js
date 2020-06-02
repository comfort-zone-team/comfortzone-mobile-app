import { StyleSheet } from "react-native";
import { human } from "react-native-typography";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBorders: {
    borderWidth: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  heading: {
    ...human.title1,
    fontFamily: "Montserrat",
  },
  label: {
    ...human.callout,
    fontFamily: "Raleway",
  },
  inputField: {
    fontFamily: "Raleway",
    color: "grey",
    margin: 0,
  },
});

export default styles;
