import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

const EditNoteScreen = ({ route, navigation }) => {
  const note = route.params?.note;
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color] = useState(note?.color || '#FFE0B2');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Icon name="check" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [title, content]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    const updatedNote = {
      id: note?.id || Date.now().toString(),
      title,
      content,
      color,
      date: format(new Date(), 'yyyy-MM-dd'),
    };

    // TODO: Implement save functionality
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Start typing..."
        value={content}
        onChangeText={setContent}
        multiline
        placeholderTextColor="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerButton: {
    marginRight: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
  },
});

export default EditNoteScreen;
