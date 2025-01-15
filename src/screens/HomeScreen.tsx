import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../theme/colors';
import {format} from 'date-fns';

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const themeColors = colors[theme];
  const {userData} = useUser();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    loadNotes();

    return unsubscribe;
  }, [navigation]);

  // Filter and sort notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase().trim();
    return notes
      .map(note => {
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = note.content.toLowerCase().includes(query);
        const matchScore = (titleMatch ? 2 : 0) + (contentMatch ? 1 : 0);
        return {...note, matchScore};
      })
      .filter(note => note.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [notes, searchQuery]);

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query.trim() || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={styles.highlightedText}>
          {part}
        </Text>
      ) : (
        part
      ),
    );
  };

  const renderNoteCard = ({item}) => {
    const titleHighlight = highlightText(item.title, searchQuery);
    const contentHighlight = highlightText(item.content, searchQuery);

    return (
      <TouchableOpacity
        style={[
          styles.noteCard,
          {
            backgroundColor: item.color || themeColors.noteColors[0],
          },
        ]}
        onPress={() => navigation.navigate('EditNote', {note: item})}
        activeOpacity={0.7}>
        <Text style={[styles.noteTitle, {color: '#000000'}]} numberOfLines={1}>
          {titleHighlight}
        </Text>
        <Text
          style={[styles.noteContent, {color: 'rgba(0, 0, 0, 0.7)'}]}
          numberOfLines={3}>
          {contentHighlight}
        </Text>
        <Text style={[styles.noteDate, {color: 'rgba(0, 0, 0, 0.5)'}]}>
          {format(new Date(item.date), 'MMM dd, yyyy')}
        </Text>
      </TouchableOpacity>
    );
  };

  const ColorPickerModal = () => (
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
            styles.colorPickerModal,
            {backgroundColor: themeColors.surface},
          ]}>
          <Text style={[styles.colorPickerTitle, {color: themeColors.text}]}>
            Choose Note Color
          </Text>
          <View style={styles.colorGrid}>
            {themeColors.noteColors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorOption, {backgroundColor: color}]}
                onPress={() => {
                  navigation.navigate('EditNote', {color});
                  setShowColorPicker(false);
                }}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const EmptyListMessage = () => (
    <View style={styles.emptyContainer}>
      {searchQuery ? (
        <>
          <Icon name="search-off" size={48} color={themeColors.textTertiary} />
          <Text style={[styles.emptyTitle, {color: themeColors.text}]}>
            No matching notes
          </Text>
          <Text
            style={[styles.emptySubtitle, {color: themeColors.textSecondary}]}>
            Try searching with different keywords
          </Text>
        </>
      ) : (
        <>
          <Icon name="note-add" size={48} color={themeColors.textTertiary} />
          <Text style={[styles.emptyTitle, {color: themeColors.text}]}>
            No notes yet
          </Text>
          <Text
            style={[styles.emptySubtitle, {color: themeColors.textSecondary}]}>
            Tap the + button to create your first note
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: themeColors.background}]}>
      <StatusBar
        backgroundColor={themeColors.background}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text
              style={[styles.welcomeText, {color: themeColors.textSecondary}]}>
              Welcome back
            </Text>
            <Text style={[styles.title, {color: themeColors.text}]}>
              {userData?.name || 'My'}'s Notes
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri:
                  userData?.avatar ||
                  'https://randomuser.me/api/portraits/men/32.jpg',
              }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: themeColors.searchBackground,
              borderColor: isSearching ? themeColors.accent : 'transparent',
              borderWidth: 1,
            },
          ]}>
          <Icon
            name="search"
            size={22}
            color={isSearching ? themeColors.accent : themeColors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, {color: themeColors.text}]}
            placeholder="Search notes..."
            placeholderTextColor={themeColors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Icon name="close" size={20} color={themeColors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.notesList,
          !filteredNotes.length && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListMessage}
      />
      <ColorPickerModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  notesList: {
    padding: 20,
    paddingTop: 10,
  },
  emptyList: {
    flexGrow: 1,
  },
  noteCard: {
    flex: 1,
    margin: 6,
    padding: 15,
    borderRadius: 16,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 'auto',
    textAlign: 'right',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerModal: {
    width: '80%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 4,
  },
});

export default HomeScreen;
