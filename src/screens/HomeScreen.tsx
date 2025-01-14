import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ListRenderItem,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Note, RootStackParamList } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Meeting Notes', content: 'Discuss project timeline', date: '2024-01-14', color: '#FFE0B2' },
    { id: '2', title: 'Shopping List', content: 'Buy groceries', date: '2024-01-14', color: '#B2DFDB' },
  ]);

  const renderNoteCard: ListRenderItem<Note> = ({ item }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('EditNote', { note: item })}
    >
      <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={3}>{item.content}</Text>
      <Text style={styles.noteDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={notes}
        renderItem={renderNoteCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.notesList}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EditNote')}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
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
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;
