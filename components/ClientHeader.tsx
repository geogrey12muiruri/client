import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, selectUser, setProfileImage } from '../app/(redux)/authSlice'; 
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from './Shared/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/constants/theme';

const ClientHeader: React.FC<{ title: string }> = ({ title }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profileImage, name, userId } = useSelector(selectUser);

  useEffect(() => {
    const loadProfileImage = async () => {
      const storedImageUrl = await AsyncStorage.getItem('profileImage');
      if (storedImageUrl) {
        dispatch(setProfileImage(storedImageUrl));
      }
    };
    loadProfileImage();
  }, [dispatch, userId]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userInfo'); 
    await AsyncStorage.removeItem('profileImage'); 
    dispatch(logoutAction());
    router.push('/auth/login'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImageFallback}>
            <Text style={styles.profileInitial}>{name?.[0]}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: theme.colors.headerColor,
    shadowColor: theme.colors.backgroundHighlightColor,
    elevation: 25,
    flexDirection: 'row', // Added to align items horizontally
    justifyContent: 'space-between', // Added to space out items
    alignItems: 'center', // Added to center items vertically
    paddingHorizontal: 20, // Added padding for better spacing
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileImageFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default ClientHeader;
