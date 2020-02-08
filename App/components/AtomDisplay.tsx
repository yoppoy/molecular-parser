import React, {useRef, useState, useEffect} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';

const ANIMATE_IN_CONFIG = {
  toValue: 1,
  duration: 250,
  easing: Easing.out(Easing.ease),
};

const ANIMATE_OUT_CONFIG = {
  toValue: 0,
  duration: 250,
  easing: Easing.ease,
};

export default function AtomDisplay({atoms}: Props) {
  const [atomsDisplayed, setAtomsDisplayed] = useState<{ [key: string]: number } | null>(null);
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
      slideIn(atoms);
    } else {
      slideOut();
    }
  }, [atoms]);

  function slideIn(atoms: { [key: string]: number }) {
    setAtomsDisplayed(atoms);
    Animated.timing(animatedValueRef.current, ANIMATE_IN_CONFIG).start();
  }

  function slideOut() {
    Animated.timing(animatedValueRef.current, ANIMATE_OUT_CONFIG).start(() => {
      setAtomsDisplayed(null);
    });
  }

  return (
    <Animated.View
      style={{
        justifyContent: 'center',
        transform: [{translateY: animatedTranslate}],
        opacity: animatedOpacity
      }}>
      <View style={styles.mainContainer}>
        {atomsDisplayed !== null && (
          Object.keys(atomsDisplayed).map(key => {
            return (
              <View style={styles.atomContainer} key={key}>
                <View style={styles.atomBubble}>
                  <Text style={styles.atomName}>{key}</Text>
                </View>
                <Text style={styles.atomCount}>{atomsDisplayed[key]}</Text>
              </View>
            );
          }))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  atomContainer: {
    margin: 10,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#61d38a',
    borderRadius: 30,
    elevation: 1,
  },
  atomCount: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  atomBubble: {
    backgroundColor: '#1b1e80',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
    minWidth: 30,
    borderRadius: 30,
    paddingHorizontal: 5,
  },
  atomName: {
    fontFamily: 'Montserrat-Black',
    color: 'white',
  },
});

interface Props {
  atoms: { [key: string]: number } | null;
}
