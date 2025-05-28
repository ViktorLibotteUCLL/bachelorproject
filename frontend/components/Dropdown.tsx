import { Pressable, StyleSheet, View, Button, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";

type CustomDropdownProps = {
  data: { label: string; value: string }[];
  placeholder: string;
  value: string | null;
  onChange: (item: { label: string; value: string }) => void;
  labelField: string;
  valueField: string;
};

const CustomDropdown = ({ data, placeholder }: CustomDropdownProps) => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={(item) => {
          setValue(item.value);
          console.log(item);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdown: {
    height: 50,
    width: 230,
    backgroundColor: "#DFE8F0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default CustomDropdown;
