import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalstyles from "../../../shared/globalStyles";

const NoteDetails = ({ route }) => {
  const { note } = route.params;

  return (
    <SafeAreaView
      style={[globalstyles.container, { backgroundColor: "#FFFFFF" }]}
    >
      <Text style={styles.date}>Created: {note.date}</Text>
      <Text style={styles.content}>note: {note.content}</Text>
      <Text style={styles.detail}>Client: {note.client}</Text>
      <Text style={styles.detail}>Topic Tags: {note.topics}</Text>
      <Text style={styles.detail}>Assigned to: {note.teamMember}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default NoteDetails;
