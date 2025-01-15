import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Text,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';
import {colors} from '../theme/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
}

const EditNoteScreen = ({route, navigation}: any) => {
  const note = route?.params?.note;
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedColor, setSelectedColor] = useState(note?.color || '#FFD700');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const {theme} = useTheme();
  const themeColors = colors[theme];

  const handleSave = async () => {
    try {
      if (!title.trim() && !content.trim()) {
        Alert.alert('Error', 'Note cannot be empty');
        return;
      }

      const newNote = {
        id: note?.id || Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        color: selectedColor,
      };

      const savedNotes = await AsyncStorage.getItem('notes');
      let notes = savedNotes ? JSON.parse(savedNotes) : [];

      if (note?.id) {
        const index = notes.findIndex((n: Note) => n.id === note.id);
        if (index !== -1) {
          notes[index] = newNote;
        } else {
          notes.unshift(newNote);
        }
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
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };

  const noteColors = [
    '#FFD700', // Gold
    '#FF6B6B', // Coral
    '#4ECDC4', // Turquoise
    '#96CEB4', // Sage
    '#FFEEAD', // Cream
    '#D4A5A5', // Mauve
    '#9370DB', // Medium Purple
    '#20B2AA', // Light Sea Green
  ];

  return (
    <View style={[styles.container, {backgroundColor: selectedColor}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.colorButton, {backgroundColor: selectedColor}]}
          onPress={() => setShowColorPicker(true)}>
          <Icon
            name="palette"
            size={24}
            color={isLightColor(selectedColor) ? '#000' : '#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="check" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <TextInput
          style={[
            styles.titleInput,
            {color: isLightColor(selectedColor) ? '#000' : '#fff'},
          ]}
          placeholder="Title"
          placeholderTextColor={
            isLightColor(selectedColor)
              ? 'rgba(0,0,0,0.5)'
              : 'rgba(255,255,255,0.5)'
          }
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[
            styles.contentInput,
            {color: isLightColor(selectedColor) ? '#000' : '#fff'},
          ]}
          placeholder="Start typing..."
          placeholderTextColor={
            isLightColor(selectedColor)
              ? 'rgba(0,0,0,0.5)'
              : 'rgba(255,255,255,0.5)'
          }
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showColorPicker}
        onRequestClose={() => setShowColorPicker(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColorPicker(false)}>
          <View
            style={[
              styles.colorPickerContainer,
              {backgroundColor: themeColors.surface},
            ]}>
            <Text style={[styles.colorPickerTitle, {color: themeColors.text}]}>
              Choose Note Color
            </Text>
            <View style={styles.colorGrid}>
              {noteColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.colorOption, {backgroundColor: color}]}
                  onPress={() => {
                    setSelectedColor(color);
                    setShowColorPicker(false);
                  }}>
                  {selectedColor === color && (
                    <Icon name="check" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
    textAlignVertical: 'top',
  },
  copyright: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    width: SCREEN_WIDTH * 0.8,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});

export default EditNoteScreen;
