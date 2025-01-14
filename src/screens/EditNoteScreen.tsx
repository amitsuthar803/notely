import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme, colors } from '../context/ThemeContext';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
}

const EditNoteScreen = ({ route, navigation }: any) => {
  const note = route.params?.note;
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const { theme } = useTheme();
  const themeColors = colors[theme];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Icon name="check" size={24} color={themeColors.accent} />
        </TouchableOpacity>
      ),
    });
  }, [title, content]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Note cannot be empty');
      return;
    }

    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      let notes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];

      const newNote = {
        id: note?.id || Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        color: note?.color,
      };

      if (note) {
        notes = notes.map((n) => (n.id === note.id ? newNote : n));
      } else {
        notes.unshift(newNote);
      }

      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        style={[styles.titleInput, { color: themeColors.text }]}
        placeholder="Title"
        placeholderTextColor={themeColors.secondaryText}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />
      <TextInput
        style={[styles.contentInput, { color: themeColors.text }]}
        placeholder="Start typing..."
        placeholderTextColor={themeColors.secondaryText}
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  saveButton: {
    marginRight: 8,
  },
});

export default EditNoteScreen;
