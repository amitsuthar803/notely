import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useTheme, colors } from '../context/ThemeContext';

const COLORS = [
  '#FFE0B2',
  '#B2DFDB',
  '#FFCDD2',
  '#C5CAE9',
  '#F8BBD0',
  '#D7CCC8',
];

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const HomeScreen = () => {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  React.useEffect(() => {
    loadNotes();
  }, []);

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

  const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  const renderItem = ({ item, index }: { item: Note; index: number }) => (
    <TouchableOpacity
      style={[
        styles.noteItem,
        { backgroundColor: item.color || getRandomColor() },
        index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 }
      ]}
      onPress={() => navigation.navigate('EditNote', { note: item })}
    >
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.notePreview} numberOfLines={4}>
          {item.content}
        </Text>
        <Text style={styles.noteDate}>
          {format(new Date(item.date), 'MMM dd, yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Notes</Text>
      </View>
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="note" size={48} color={themeColors.secondaryText} />
          <Text style={[styles.emptyText, { color: themeColors.secondaryText }]}>
            No notes yet
          </Text>
          <Text style={[styles.emptySubtext, { color: themeColors.secondaryText }]}>
            Tap the + button to create a note
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  noteItem: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 20,
    minHeight: 180,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  noteContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default HomeScreen;
