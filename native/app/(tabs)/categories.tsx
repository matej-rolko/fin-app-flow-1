import {
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/categories"; // Adjust if needed

interface Category {
  id: number;
  title: string;
  active: boolean;
}

export default function TabTwoScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCategory }),
      });
      const newCat = await response.json();
      setCategories([...categories, newCat]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Toggle category activation
  const toggleCategory = (id: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  // Delete category
  const deleteCategory = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Categories</ThemedText>
      </ThemedView>
      <View>
        <TextInput
          placeholder="New Category"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.input}
        />
        <TouchableOpacity onPress={addCategory} style={styles.button}>
          <ThemedText style={styles.titleContainer}>Add</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.catsContainer}>
        <ThemedText type="subtitle">Your Categories</ThemedText>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <TouchableOpacity onPress={() => toggleCategory(item.id)}>
                <ThemedText type="defaultSemiBold">• {item.title}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCategory(item.id)}>
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    color: "white",
    backgroundColor: "#333",
  },
  button: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#007AFF",
    padding: 15,
    marginTop: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
  },
  catsContainer: {
    flexDirection: "column",
    gap: 8,
    marginTop: 25,
  },
});
