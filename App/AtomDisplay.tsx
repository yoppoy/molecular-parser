import React, {useRef, useState, useEffect} from 'react';
import {Animated, Easing, StyleSheet, Text, View, Dimensions} from 'react-native';

interface Props {
  atoms: any;
}

export default function AtomDisplay({atoms}: Props) {
  const animatedValue = new Animated.Value(0);
  const animatedValueRef = useRef(animatedValue);
  const animatedOpacity = animatedValueRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const animatedTranslate = animatedValueRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  useEffect(() => {
    if (atoms !== null) {
      appear();
    } else {
      dissapear();
    }
  }, [atoms]);

  function appear() {
    Animated.timing(animatedValueRef.current, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      delay: 100,
    }).start(() => {
    });
  }

  function dissapear() {
    Animated.timing(animatedValueRef.current, {
      toValue: 0,
      duration: 250,
      easing: Easing.linear,
      delay: 100,
    }).start();
  }

  return (
    <Animated.View style={{transform: [{translateY: animatedTranslate}], opacity: animatedOpacity}}>
      {atoms !== null && Object.keys(atoms).map(
        key => {
          return (
            <View style={styles.atomContainer} key={key}>
              <Text style={[styles.atomText, {fontWeight: 'bold'}]}>{key}</Text>
              <Text style={styles.atomText}> --------> </Text>
              <Text style={styles.atomText}>{atoms[key]}</Text>
            </View>
          );
        })}
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  atomContainer: {
    marginTop: 10,
    flexDirection: 'row',
    height: 30,
  },
  atomText: {
    color: 'white',
    fontSize: 22,
  },
});
