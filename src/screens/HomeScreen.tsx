import React, {useState} from 'react';
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

const colors = {
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#888888',
    searchBackground: '#F0F0F0',
    accent: '#007AFF',
    noteColors: ['#FFE0B2', '#B2DFDB', '#C5CAE9', '#F8BBD0', '#DCEDC8', '#D1C4E9'],
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    textTertiary: '#888888',
    searchBackground: '#2A2A2A',
    accent: '#007AFF',
    noteColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFB6B9', '#9B89B3'],
  },
};

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const themeColors = colors[theme];

  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Meeting Notes',
      content: 'Discuss project timeline',
      date: '2024-01-14',
      color: themeColors.noteColors[0],
    },
    {
      id: '2',
      title: 'Shopping List',
      content: 'Buy groceries',
      date: '2024-01-14',
      color: themeColors.noteColors[1],
    },
  ]);

  const renderNoteCard = ({item}) => {
    // Calculate if the note color is light or dark
    const isLightColor = (color) => {
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
        style={[styles.noteCard, {backgroundColor: item.color}]}
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  notesList: {
    padding: 8,
  },
  noteCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    marginTop: 8,
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;
