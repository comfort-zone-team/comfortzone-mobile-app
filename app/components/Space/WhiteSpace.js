import React from "react";
import { View } from "react-native";

export default function WhiteSpace({ size = 1 }) {
  return <View style={{ marginVertical: 5 * size }}></View>;
}
