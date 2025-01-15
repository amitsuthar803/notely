import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { colors } from '../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { userData, updateUserData, isLoading } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || '');
  const [editedEmail, setEditedEmail] = useState(userData?.email || '');

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.accent} />
      </View>
    );
  }

  const handleSave = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return;
    }

    try {
      await updateUserData({
        name: editedName.trim(),
        email: editedEmail.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: userData?.avatar }}
            style={styles.avatar}
          />
          <TouchableOpacity 
            style={[styles.editAvatarButton, { backgroundColor: themeColors.accent }]}
            onPress={() => Alert.alert('Coming Soon', 'Avatar upload will be available soon!')}
          >
            <Icon name="camera-alt" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Name</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                { 
                  color: themeColors.text,
                  backgroundColor: themeColors.searchBackground,
                }
              ]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={themeColors.textTertiary}
            />
          ) : (
            <Text style={[styles.value, { color: themeColors.text }]}>{userData?.name}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeColors.textSecondary }]}>Email</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                { 
                  color: themeColors.text,
                  backgroundColor: themeColors.searchBackground,
                }
              ]}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Enter your email"
              placeholderTextColor={themeColors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.value, { color: themeColors.text }]}>{userData?.email}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: themeColors.accent }
          ]}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setEditedName(userData?.name || '');
              setEditedEmail(userData?.email || '');
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  form: {
    paddingHorizontal: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  button: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
