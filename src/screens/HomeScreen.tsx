import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../theme/colors';

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const themeColors = colors[theme];

  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);

  // Load notes when screen focuses
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadNotes);
    loadNotes(); // Load notes initially

    return unsubscribe;
  }, [navigation]);

  const renderNoteCard = ({item}) => {
    // Calculate if the note color is light or dark
    const isLightColor = (color) => {
      if (!color) {
        return true; // Default to light theme if no color
      }
      // Convert hex to RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      // Calculate relative luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    };

    // Determine text colors based on note background
    const noteTextColor = isLightColor(item.color) ? '#000000' : '#FFFFFF';
    const noteSecondaryTextColor = isLightColor(item.color) 
      ? 'rgba(0, 0, 0, 0.7)' 
      : 'rgba(255, 255, 255, 0.7)';
    const noteTertiaryTextColor = isLightColor(item.color)
      ? 'rgba(0, 0, 0, 0.5)'
      : 'rgba(255, 255, 255, 0.5)';

    return (
      <TouchableOpacity
        style={[
          styles.noteCard,
          {backgroundColor: item.color || themeColors.surface}
        ]}
        onPress={() => navigation.navigate('EditNote', {note: item})}
        activeOpacity={0.7}>
        <Text 
          style={[styles.noteTitle, {color: noteTextColor}]} 
          numberOfLines={1}>
          {item.title}
        </Text>
        <Text 
          style={[styles.noteContent, {color: noteSecondaryTextColor}]} 
          numberOfLines={3}>
          {item.content}
        </Text>
        <Text 
          style={[styles.noteDate, {color: noteTertiaryTextColor}]}>
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: themeColors.background}]}>
      <View style={[styles.header, {backgroundColor: themeColors.surface}]}>
        <Text style={[styles.title, {color: themeColors.text}]}>Notes</Text>
        <View style={[styles.searchContainer, {backgroundColor: themeColors.searchBackground}]}>
          <Icon
            name="search"
            size={24}
            color={themeColors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, {color: themeColors.text}]}
            placeholder="Search notes..."
            placeholderTextColor={themeColors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={notes}
        renderItem={renderNoteCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.notesList}
      />
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: themeColors.accent}]}
        onPress={() => navigation.navigate('EditNote')}>
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  notesList: {
    padding: 12,
  },
  noteCard: {
    flex: 1,
    margin: 6,
    borderRadius: 16,
    padding: 16,
    minHeight: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteDate: {
    fontSize: 12,
    marginTop: 'auto',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;
