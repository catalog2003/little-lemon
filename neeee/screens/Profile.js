import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { validateEmail } from "../utils";
import { AuthContext } from "../AuthContext";
import Checkbox from "expo-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';

const Profile = () => {
  const { update, logout } = useContext(AuthContext);
  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      orderStatuses: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
      image: '',
    },
  });
  const profile = watch();
  const [discard, setDiscard] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    (async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('profile');
        if (savedProfile) {
          reset(JSON.parse(savedProfile));
        }
        setDiscard(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setValue('image', result.assets[0].uri);
    }
  }, [setValue]);

  const removeImage = useCallback(() => {
    setValue('image', '');
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(data));
      update(data);
    } catch (e) {
      console.error(e);
    }
  };

  const validateNumber = (number) => number.length === 10 && !isNaN(number);

  const isFormValid = () => {
    return (
      profile.firstName &&
      profile.lastName &&
      validateEmail(profile.email) &&
      validateNumber(profile.phoneNumber)
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
      </View>
      <ScrollView style={styles.viewScroll}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.headerText}>Personal Information</Text>
          <Text style={styles.text}>Avatar</Text>
          <View style={styles.avatarContainer}>
            {profile.image ? (
              <Image source={{ uri: profile.image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarEmpty}>
                <Text style={styles.avatarEmptyText}>
                  {profile.firstName && profile.firstName[0]}
                  {profile.lastName && profile.lastName[0]}
                </Text>
              </View>
            )}
            <View style={styles.avatarButtons}>
              <Pressable style={styles.changeBtn} onPress={pickImage}>
                <Text style={styles.changeBtnText}>Change</Text>
              </Pressable>
              <Pressable style={styles.removeBtn} onPress={removeImage}>
                <Text style={styles.removeBtnText}>Remove</Text>
              </Pressable>
            </View>
          </View>

          <Controller
            control={control}
            rules={{ required: true, pattern: /^[a-zA-Z]+$/ }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.text, error ? styles.error : null]}>
                  First Name
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={value}
                  onChangeText={onChange}
                  placeholder={"First Name"}
                />
              </>
            )}
            name="firstName"
          />

          <Controller
            control={control}
            rules={{ required: true, pattern: /^[a-zA-Z]+$/ }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.text, error ? styles.error : null]}>
                  Last Name
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={value}
                  onChangeText={onChange}
                  placeholder={"Last Name"}
                />
              </>
            )}
            name="lastName"
          />

          <Controller
            control={control}
            rules={{ required: true, validate: validateEmail }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.text, error ? styles.error : null]}>
                  Email
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={value}
                  keyboardType="email-address"
                  onChangeText={onChange}
                  placeholder={"Email"}
                />
              </>
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{ required: true, validate: validateNumber }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text style={[styles.text, error ? styles.error : null]}>
                  Phone Number (10 digits)
                </Text>
                <TextInput
                  style={styles.inputBox}
                  value={value}
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                  placeholder={"Phone Number"}
                />
              </>
            )}
            name="phoneNumber"
          />

          <Text style={styles.headerText}>Email Notifications</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.section}>
                <Checkbox
                  style={styles.checkbox}
                  value={value}
                  onValueChange={onChange}
                  color={"#495e57"}
                />
                <Text style={styles.paragraph}>Order statuses</Text>
              </View>
            )}
            name="orderStatuses"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.section}>
                <Checkbox
                  style={styles.checkbox}
                  value={value}
                  onValueChange={onChange}
                  color={"#495e57"}
                />
                <Text style={styles.paragraph}>Password changes</Text>
              </View>
            )}
            name="passwordChanges"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.section}>
                <Checkbox
                  style={styles.checkbox}
                  value={value}
                  onValueChange={onChange}
                  color={"#495e57"}
                />
                <Text style={styles.paragraph}>Special offers</Text>
              </View>
            )}
            name="specialOffers"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.section}>
                <Checkbox
                  style={styles.checkbox}
                  value={value}
                  onValueChange={onChange}
                  color={"#495e57"}
                />
                <Text style={styles.paragraph}>Newsletter</Text>
              </View>
            )}
            name="newsletter"
          />

          <Pressable style={styles.btn} onPress={logout}>
            <Text style={styles.btnText}>Log out</Text>
          </Pressable>
          <View style={styles.buttons}>
            <Pressable style={styles.discardBtn} onPress={() => setDiscard(true)}>
              <Text style={styles.discardBtnText}>Discard Changes</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, !isFormValid() ? styles.btnDisabled : null]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isFormValid()}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  viewScroll: {
    flex: 1,
    padding: 10,
  },
  content: {
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    paddingBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputBox: {
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 9,
    borderColor: "#dfdfe5",
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btnDisabled: {
    backgroundColor: "#98b3aa",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#495e57",
    borderRadius: 9,
    alignSelf: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  saveBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    alignSelf: "center",
  },
  discardBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  discardBtnText: {
    fontSize: 18,
    color: "#3e524b",
    alignSelf: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  error: {
    color: "#d14747",
    fontWeight: "bold",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmpty: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0b9a6a',
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  avatarButtons: {
    flexDirection: "row",
  },
  changeBtn: {
    backgroundColor: "#495e57",
    borderRadius: 9,
    marginHorizontal: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  removeBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  changeBtnText: {
    fontSize: 16,
    color: "#FFFFFF",
    alignSelf: "center",
  },
  removeBtnText: {
    fontSize: 16,
    color: "#3e524b",
    alignSelf: "center",
  },
});

export default Profile;

