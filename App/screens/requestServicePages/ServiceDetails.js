import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import renderIcon from "../../shared/RenderIconFunction";
import globalstyles from "../../shared/globalStyles";

const ServiceDetails = ({ route, navigation }) => {
  const { category } = route.params;

  const handleOptionPress = (option) => {
    navigation.navigate("Referral Location", { option, categoryName: category.name });
  };

  return (
    <View style={[globalstyles.container, { paddingTop: 15 }]}>
      {category.options &&
        category.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() => handleOptionPress(option)}
          >
            <View
              style={[
                globalstyles.optionsContainer,
                { flexDirection: "row", justifyContent: "flex-start" },
              ]}
            >
              {renderIcon(category.icon, category.library, styles.icon)}
              {/* Use the same icon as the category */}
              <Text style={globalstyles.optionsText}>{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
  icon: {
    color: "#094852",
  },
});

export default ServiceDetails;
