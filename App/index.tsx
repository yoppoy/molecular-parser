import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Easing,
  TouchableOpacity,
  Text,
  StatusBar,
  Keyboard,
  Animated,
  Dimensions,
  ImageBackground
} from 'react-native';
import AtomDisplay from './components/AtomDisplay';
import {findAtoms} from './helpers/molecularParser';

const ANIMATED_IN_CONFIG = {
  toValue: 1,
  duration: 300,
  easing: Easing.circle,
};

const ANIMATED_OUT_CONFIG = {
  toValue: 0,
  duration: 250,
  easing: Easing.circle,
};

interface State {
  text: string;
  atoms: { [key: string]: number } | null;
  error: string | null;
};

const Index = () => {
  const [state, setState] = useState<State>({
    text: '',
    atoms: null,
    error: null,
  });
  const animatedValue = new Animated.Value(0);
  const animatedValueRef = useRef(animatedValue);
  const animatedWidth = animatedValueRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 90],
  });
  const animatedHeight = animatedValueRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 250],
  });
  const animatedOpacity = animatedValueRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  function onPress() {
    let atoms: { [key: string]: number } = {};

    Keyboard.dismiss();
    if (state.atoms === null) {
      try {
        atoms = findAtoms(state.text);
        setState({...state, atoms: atoms, error: null});
        Animated.timing(animatedValueRef.current, ANIMATED_IN_CONFIG).start();
      } catch (e) {
        setState({...state, error: 'Please enter a valid formula'});
      }
    } else {
      Animated.timing(animatedValueRef.current, ANIMATED_OUT_CONFIG).start(() => {
        setState({...state, atoms: null, error: null, text: ''});
      });
    }
  }

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={{width: '100%', height: '100%'}}>
      <View style={styles.mainContainer}>
        <StatusBar backgroundColor='#61d38a' barStyle="light-content"/>
        <Animated.View style={{alignItems: 'center', height: animatedHeight, alignSelf: 'stretch'}}>
          <Animated.View style={{marginBottom: 10, alignSelf: 'stretch'}}>
            <TextInput
              onFocus={() => {
                Animated.timing(animatedValueRef.current, ANIMATED_OUT_CONFIG).start(() => {
                  setState({...state, atoms: null, error: null, text: ''});
                });
              }}
              onChangeText={text => setState({...state, text})}
              value={state.text}
              placeholder={'Enter a Molecule'}
              placeholderTextColor={'white'}
              style={styles.textInput}
              selectTextOnFocus
            />
            {state.error && (
              <Text style={styles.textError}>{state.error}</Text>
            )}
          </Animated.View>
          <Animated.View
            style={{
              width: animatedWidth,
            }}>
            <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={onPress}>
              <Text style={styles.buttonText}>{state.atoms === null ? 'COUNT ATOMS' : 'RESET'}</Text>
            </TouchableOpacity>
          </Animated.View>
          <AtomDisplay atoms={state.atoms}/>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    color: '#1b1e80',
    fontFamily: 'Montserrat-Black',
    fontWeight: '800',
    fontSize: 30,
    paddingHorizontal: 20,
    textAlign: 'center',
    alignSelf: 'stretch',
    height: 60,
  },
  textError: {
    color: '#f44336',
    alignSelf: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  atomText: {
    color: 'white',
  },
  atomContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    paddingHorizontal: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonText: {
    color: '#00e183',
  },
});

export default Index;
