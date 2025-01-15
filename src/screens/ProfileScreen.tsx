import React, {useState} from 'react';
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
import {useTheme} from '../context/ThemeContext';
import {useUser} from '../context/UserContext';
import {colors} from '../theme/colors';

const ProfileScreen = ({navigation}) => {
  const {theme} = useTheme();
  const themeColors = colors[theme];
  const {userData, updateUserData, isLoading} = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || '');
  const [editedEmail, setEditedEmail] = useState(userData?.email || '');

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: themeColors.background},
        ]}>
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
      style={[styles.container, {backgroundColor: themeColors.background}]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: themeColors.text}]}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../public/me.jpg')}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={[
              styles.editAvatarButton,
              {backgroundColor: themeColors.accent},
            ]}>
            <Icon name="camera-alt" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.searchBackground,
                    color: themeColors.text,
                  },
                ]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Your name"
                placeholderTextColor={themeColors.textTertiary}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.searchBackground,
                    color: themeColors.text,
                  },
                ]}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Your email"
                placeholderTextColor={themeColors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: themeColors.accent}]}
                  onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: themeColors.textTertiary},
                  ]}
                  onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, {color: themeColors.textSecondary}]}>
                  Name
                </Text>
                <Text style={[styles.value, {color: themeColors.text}]}>
                  {userData?.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.label, {color: themeColors.textSecondary}]}>
                  Email
                </Text>
                <Text style={[styles.value, {color: themeColors.text}]}>
                  {userData?.email}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {backgroundColor: themeColors.accent},
                ]}
                onPress={() => setIsEditing(true)}>
                <Icon name="edit" size={20} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 62,
    elevation: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
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
  },
  infoContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
