import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import PagerView from "react-native-pager-view";
import { validateEmail } from "../utils";
import { AuthContext } from "../AuthContext";

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const onChangeText = (text) => {
    setValue(text);
    setError(null);
  };

  return { value, onChangeText, error, setError };
};

const Onboarding = () => {
  const firstName = useInputState("");
  const lastName = useInputState("");
  const email = useInputState("");

  const isEmailValid = validateEmail(email.value);
  const viewPagerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { onboard } = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = (page) => {
    if (page === 1 && !firstName.value) {
      firstName.setError("First name is required.");
    } else if (page === 2 && !lastName.value) {
      lastName.setError("Last name is required.");
    } else {
      viewPagerRef.current.setPage(page);
    }
  };

  const handleSubmit = () => {
    if (!isEmailValid) {
      email.setError("Invalid email address.");
    } else {
      onboard({ firstName: firstName.value, lastName: lastName.value, email: email.value });
    }
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
          accessibilityLabel="Little Lemon Logo"
        />
      </View>
      <PagerView
        style={styles.viewPager}
        scrollEnabled={false}
        initialPage={0}
        ref={viewPagerRef}
      >
        <View style={styles.page} key="1">
          <Animated.View style={[styles.pageContainer, { opacity: fadeAnim }]}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName.value}
              onChangeText={firstName.onChangeText}
              placeholder="First Name"
              accessible={true}
              accessibilityLabel="First Name Input"
              accessibilityHint="Enter your first name"
            />
            {firstName.error && <Text style={styles.errorText}>{firstName.error}</Text>}
          </Animated.View>
          <View style={styles.pageIndicator}>
            <View style={[styles.pageDot, styles.pageDotActive]}></View>
            <View style={styles.pageDot}></View>
            <View style={styles.pageDot}></View>
          </View>
          <Pressable
            style={[styles.btn, firstName.value ? "" : styles.btnDisabled]}
            onPress={() => handleNext(1)}
            disabled={!firstName.value}
          >
            <Text style={styles.btntext}>Next</Text>
          </Pressable>
        </View>
        <View style={styles.page} key="2">
          <Animated.View style={[styles.pageContainer, { opacity: fadeAnim }]}>
            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName.value}
              onChangeText={lastName.onChangeText}
              placeholder="Last Name"
              accessible={true}
              accessibilityLabel="Last Name Input"
              accessibilityHint="Enter your last name"
            />
            {lastName.error && <Text style={styles.errorText}>{lastName.error}</Text>}
          </Animated.View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot}></View>
            <View style={[styles.pageDot, styles.pageDotActive]}></View>
            <View style={styles.pageDot}></View>
          </View>
          <View style={styles.buttons}>
            <Pressable style={styles.halfBtn} onPress={() => viewPagerRef.current.setPage(0)}>
              <Text style={styles.btntext}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfBtn, lastName.value ? "" : styles.btnDisabled]}
              onPress={() => handleNext(2)}
              disabled={!lastName.value}
            >
              <Text style={styles.btntext}>Next</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.page} key="3">
          <Animated.View style={[styles.pageContainer, { opacity: fadeAnim }]}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email.value}
              onChangeText={email.onChangeText}
              placeholder="Email"
              keyboardType="email-address"
              accessible={true}
              accessibilityLabel="Email Input"
              accessibilityHint="Enter your email address"
            />
            {email.error && <Text style={styles.errorText}>{email.error}</Text>}
          </Animated.View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot}></View>
            <View style={styles.pageDot}></View>
            <View style={[styles.pageDot, styles.pageDotActive]}></View>
          </View>
          <View style={styles.buttons}>
            <Pressable style={styles.halfBtn} onPress={() => viewPagerRef.current.setPage(1)}>
              <Text style={styles.btntext}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfBtn, isEmailValid ? "" : styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={!isEmailValid}
            >
              <Text style={styles.btntext}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </PagerView>
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
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
  inputBox: {
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 24,
    borderRadius: 9,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginHorizontal: 18,
    marginBottom: 60,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btnDisabled: {
    backgroundColor: "#f1f4f7",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 60,
  },
  halfBtn: {
    flex: 1,
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btntext: {
    fontSize: 22,
    color: "#3e524b",
    fontWeight: "bold",
    alignSelf: "center",
  },
  pageIndicator: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pageDot: {
    backgroundColor: "#67788a",
    width: 22,
    height: 22,
    marginHorizontal: 10,
    borderRadius: 11,
  },
  pageDotActive: {
    backgroundColor: "#f4ce14",
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
  },
});

export default Onboarding;

