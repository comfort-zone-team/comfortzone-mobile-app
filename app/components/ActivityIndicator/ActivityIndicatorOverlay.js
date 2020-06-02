import React from "react";
import { View } from "react-native";
import { Modal, Card, Spinner, Text } from "@ui-kitten/components";
import WhiteSpace from "../Space/WhiteSpace";

export default function ActivityIndicatorOverlay({ visible, text }) {
  return (
    <Modal
      visible={visible}
      backdropStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card
        disabled={true}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size="medium" />
        </View>
        {text && (
          <React.Fragment>
            <WhiteSpace />
            <Text>{text}</Text>
          </React.Fragment>
        )}
      </Card>
    </Modal>
  );
}
