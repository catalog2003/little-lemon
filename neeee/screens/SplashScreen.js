import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

const SplashScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image style={styles.logo} source={require('../img/littleLemonLogo.png')} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 100,
    width: '90%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
