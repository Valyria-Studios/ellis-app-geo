// TAGS LOGIC HAS BEEN HIDDEN FOR NOW (YAN ADVICE)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalstyles from "../../../shared/globalStyles";
import { TextInput } from "react-native-gesture-handler";
import {
  AntDesign,
  EvilIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { format } from "date-fns";

const CreateNote = ({ route, navigation }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [title, setTitle] = useState("");
  const [showClients, setShowClients] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState(tags);
  const [showTags, setShowTags] = useState(false);
  const [topicTag, setTopicTag] = useState("");
  const [teamMember, setTeamMember] = useState("");
  const tags = [
    { id: 1, name: "Urgent" },
    { id: 2, name: "Review" },
    { id: 3, name: "Follow-up" },
    { id: 4, name: "Meeting" },
  ];
  const [selectedClientNotes, setSelectedClientNotes] = useState([]);

  useEffect(() => {
    // If there's a client name passed, set it
    if (route.params?.clientName) {
      setSelectedClient(route.params.clientName);
    } else {
      setShowClientSearch(true);
    }
  }, [route.params?.clientName]);

  const handleSearchTag = (text) => {
    setTagSearch(text);
    if (text) {
      const filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTags(filtered);
      setShowTags(true);
    } else {
      setFilteredTags(tags);
      setShowTags(false);
    }
  };
  const handleSelectTag = (tag) => {
    const index = selectedTags.findIndex((t) => t.id === tag.id);
    if (index >= 0) {
      // Tag already selected, do nothing or provide feedback
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagSearch("");
    setShowTags(false);
  };

  const handleRemoveTag = (id) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== id));
  };

  useEffect(() => {
    // Fetch clients and their notes
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://ellis-test-data.com:8000/Clients"
        );
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    // Filter clients based on input
    if (selectedClient) {
      const filtered = clients.filter((client) =>
        client.fullName.toLowerCase().includes(selectedClient.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [selectedClient, clients]);

  useEffect(() => {
    // If there's a client name passed, set it
    if (route.params?.clientName) {
      setSelectedClient(route.params.clientName);
    } else {
      setShowClientSearch(true);
    }
  }, [route.params?.clientName]);

  const handleSelectClient = (client) => {
    setSelectedClient(client.fullName);
    setShowClients(false); // Hide the list but keep the input visible
  };

  const handleSaveNote = async () => {
    const now = new Date();
    const formattedDate = format(now, "p, PP"); // Formats the current date and time
    const newNote = {
      title: title,
      content: note,
      topics: selectedTags.map((tag) => tag.name),
      teamMember: teamMember,
      client: selectedClient,
      dateCreated: formattedDate,
      lastEdited: formattedDate,
    };

    try {
      // Find selected client ID
      const client = clients.find(
        (client) => client.fullName === selectedClient
      );
      if (!client) return;

      const response = await fetch(
        `https://ellis-test-data.com:8000/Clients/${client.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        }
      );

      if (response.ok) {
        const responseJson = await response.json();
        console.log("Note added successfully:", responseJson);
        // Ensure the correct data is passed
        navigation.navigate("Note Details", {
          note: responseJson, // Pass the newly created note
          clientId: client.id, // Pass the selected client ID
          fromProfile: route.params?.fromProfile || false, // Pass the fromProfile flag if it exists
        });
      } else {
        console.error("HTTP error: " + response.status + " during adding note");
      }
    } catch (error) {
      console.error("Error sending data to API", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        globalstyles.container,
        { backgroundColor: "#FFFFFF", paddingTop: -30 },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100} // Adjust offset if needed
      >
        <View style={{ flex: 1 }}>
          {showClientSearch && (
            <View style={styles.textInputContainer}>
              <EvilIcons
                name="search"
                size={24}
                color="#828B89"
                style={{ paddingLeft: 10 }}
              />
              <TextInput
                blurOnSubmit={true}
                style={styles.textInput}
                placeholder="Select Client"
                value={selectedClient}
                onChangeText={setSelectedClient}
                onFocus={() => setShowClients(true)} // Show the list when input is focused
              />
            </View>
          )}
          {showClients && filteredClients.length > 0 && (
            <FlatList
              data={filteredClients}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectClient(item)}
                  style={styles.clientItem}
                >
                  <Text>{item.fullName}</Text>
                </TouchableOpacity>
              )}
              style={[styles.clientList, { maxHeight: 200 }]}
            />
          )}

          <View style={styles.textInputContainer}>
            <TextInput
              blurOnSubmit={true}
              style={styles.textInput}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View
            style={[
              styles.textInputContainer,
              { flex: 0.8, alignItems: "flex-start" },
            ]}
          >
            <TextInput
              blurOnSubmit={true}
              style={[styles.textInput, {}]}
              multiline={true}
              placeholder="Input Notes"
              value={note}
              onChangeText={setNote}
            />
          </View>
          {/* <View style={styles.textInputContainer}>
          <MaterialIcons
            name="label-outline"
            size={20}
            color="#828B89"
            style={{ paddingLeft: 10 }}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Topic Tags"
            value={tagSearch}
            onChangeText={handleSearchTag}
            onFocus={() => setShowTags(true)}
          />
        </View>
        {showTags && (
          <FlatList
            data={filteredTags}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectTag(item)}
                style={styles.tagItem}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={[styles.tagList, { maxHeight: 100 }]}
          />
        )}
        {selectedTags.length > 0 && (
          <View style={styles.selectedTagsContainer}>
            {selectedTags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(tag.id)}
                  style={styles.removeTag}
                >
                  <AntDesign name="close" size={14} color="#094852" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )} */}
          <View style={styles.textInputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#828B89"
              style={{ paddingLeft: 10 }}
            />
            <TextInput
              blurOnSubmit={true}
              style={styles.textInput}
              placeholder="Tag a Team Member"
              value={teamMember}
              onChangeText={setTeamMember}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={handleSaveNote}
              style={[
                globalstyles.buttonContainer,
                { backgroundColor: "#FFFFFF", borderRadius: 15 },
              ]}
              activeOpacity={0.6}
            >
              <Text style={[globalstyles.buttonText]}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#B5BABB",
    justifyContent: "center",
    marginBottom: 20,
  },

  textInput: {
    padding: 10,
    flex: 1,
    fontFamily: "karla-regular",
    fontSize: 16,
    color: "#909899",
  },

  clientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  clientList: {
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    top: 40, // Adjust top as per your UI
    left: 0,
    right: 0,
    zIndex: 1, // Make sure FlatList is rendered above the BlurView
  },

  tagItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tagList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: -10,
    marginBottom: 10,
  },
  selectedTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#B5BABB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    marginRight: 5,
    marginBottom: 10,
    justifyContent: "center",
  },

  tagText: {
    marginRight: 5,
    paddingLeft: 5,
    color: "#094852",
    fontFamily: "karla-regular",
    fontSize: 16,
  },

  removeTag: {
    padding: 5,
  },
  tagItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CreateNote;
