import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";
import { useFonts } from "@use-expo/font";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import Navigator from "./app/navigator/Navigator";
import { default as mapping } from "./mapping.json";

export default function App() {
  console.disableYellowBox = true;

  let [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    "AvertaStd-Semibold": require("./assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    Raleway: require("./assets/fonts/Raleway/Raleway-Medium.ttf"),
    "AvertaStd-Regular": require("./assets/fonts/Raleway/Raleway-Medium.ttf"),
  });

  const [isReady, setIsReady] = useState(false);

  if (!isReady && !fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
        <Navigator />
      </ApplicationProvider>
    </>
  );
}
