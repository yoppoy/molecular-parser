import React, {useRef, useState, useEffect} from 'react';
import {Animated, Easing, StyleSheet, Text, View, Dimensions} from 'react-native';

interface Props {
  atoms: {[key: string]: number} | null;
}

export default function AtomDisplay({atoms}: Props) {
  const [atomsDisplayed, setAtomsDisplayed] = useState<{[key: string]: number} | null>(null);
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
      appear(atoms);
    } else {
      dissapear();
    }
  }, [atoms]);

  function appear(atoms: {[key: string]: number}) {
    setAtomsDisplayed(atoms);
    Animated.timing(animatedValueRef.current, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
    }).start();
  }

  function dissapear() {
    Animated.timing(animatedValueRef.current, {
      toValue: 0,
      duration: 250,
      easing: Easing.ease,
    }).start(() => {
      setAtomsDisplayed(null);
    });
  }

  return (
    <Animated.View style={{marginTop: 10, transform: [{translateY: animatedTranslate}], opacity: animatedOpacity}}>
      {atomsDisplayed !== null &&
        Object.keys(atomsDisplayed).map(key => {
          return (
            <View style={styles.atomContainer} key={key}>
              <Text style={[styles.atomText, {fontWeight: 'bold'}]}>{key}</Text>
              <Text style={styles.atomText}> ------> </Text>
              <Text style={styles.atomText}>{atomsDisplayed[key]}</Text>
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
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  atomText: {
    color: 'white',
    fontSize: 22,
  },
});
