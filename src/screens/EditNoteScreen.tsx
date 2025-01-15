import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

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
  const [selectedColor, setSelectedColor] = useState(note?.color || colors.light.noteColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { theme } = useTheme();
  const themeColors = colors[theme];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.colorDot, { backgroundColor: selectedColor }]}
            onPress={() => setShowColorPicker(true)}
          >
            <Icon name="palette" size={20} color={isLightColor(selectedColor) ? '#000' : '#fff'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Icon name="check" size={24} color={themeColors.accent} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [title, content, selectedColor]);

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
        color: selectedColor,
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

  const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const ColorPickerModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showColorPicker}
      onRequestClose={() => setShowColorPicker(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowColorPicker(false)}
      >
        <View style={styles.colorPickerModal}>
          <View style={styles.colorGrid}>
            {themeColors.noteColors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => {
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
              >
                {selectedColor === color && (
                  <Icon name="check" size={20} color={isLightColor(color) ? '#000' : '#fff'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: selectedColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView}>
        <TextInput
          style={[
            styles.titleInput,
            { color: isLightColor(selectedColor) ? '#000' : '#fff' }
          ]}
          placeholder="Title"
          placeholderTextColor={isLightColor(selectedColor) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <TextInput
          style={[
            styles.contentInput,
            { color: isLightColor(selectedColor) ? '#000' : '#fff' }
          ]}
          placeholder="Start typing..."
          placeholderTextColor={isLightColor(selectedColor) ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
      <ColorPickerModal />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minHeight: 200,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default EditNoteScreen;
