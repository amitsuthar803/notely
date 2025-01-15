import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const TodoScreen = () => {
  const { theme, colors } = useTheme();
  const themeColors = colors[theme];
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      const updatedTodos = [newTodoItem, ...todos];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setNewTodo('');
      Keyboard.dismiss();
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt - a.createdAt;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>Tasks</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: themeColors.searchBackground,
              color: themeColors.text
            }]}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Add a new task"
            placeholderTextColor={themeColors.textTertiary}
            onSubmitEditing={addTodo}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: themeColors.accent }]}
            onPress={addTodo}
          >
            <Icon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.todoList}
          showsVerticalScrollIndicator={false}
        >
          {sortedTodos.map((todo) => (
            <View
              key={todo.id}
              style={[styles.todoItem, { 
                backgroundColor: themeColors.surface,
                opacity: todo.completed ? 0.8 : 1,
              }]}
            >
              <TouchableOpacity
                style={styles.todoCheckbox}
                onPress={() => toggleTodo(todo.id)}
              >
                <Icon
                  name={todo.completed ? 'check-circle' : 'radio-button-unchecked'}
                  size={24}
                  color={todo.completed ? themeColors.accent : themeColors.textSecondary}
                />
              </TouchableOpacity>
              
              <Text
                style={[
                  styles.todoText,
                  { 
                    color: todo.completed ? themeColors.textSecondary : themeColors.text,
                    textDecorationLine: todo.completed ? 'line-through' : 'none',
                  },
                ]}
              >
                {todo.text}
              </Text>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTodo(todo.id)}
              >
                <Icon name="delete-outline" size={20} color={themeColors.textTertiary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoList: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  todoCheckbox: {
    marginRight: 15,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    padding: 5,
  },
});

export default TodoScreen;
