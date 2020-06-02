import React, { useState, useEffect } from "react";
import { Input } from "@ui-kitten/components";

export const TextInput = (props) => {
  const [value, setValue] = useState(props.initialValue);
  const [validity, setValidity] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    onValueChange();
  }, [value]);

  const onChangeText = (text) => {
    const { formatter } = props;

    const val = formatter ? formatter(text, value) : text;

    setValue(val);

    if (!isDirty) setIsDirty(true);
  };

  const onValueChange = () => {
    const valid = isValid();

    if (isDirty) {
      setValidity(valid);
    }
    if (valid) {
      props.onChangeText(value);
    } else {
      props.onChangeText(undefined);
    }
  };

  const isValid = () => {
    const { validator } = props;

    const validity = validator ? validator(value) : null;

    return validity;
  };

  const getStatus = () => {
    if (isDirty && props.validator) {
      return validity ? "success" : "danger";
    }

    return undefined;
  };

  return (
    <Input
      clear
      editable
      {...props}
      caption={getStatus() === "danger" ? props.errorString : null}
      status={getStatus()}
      onChangeText={onChangeText}
      value={value}
    />
  );
};
