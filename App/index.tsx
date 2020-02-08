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
    setState({...state, error: null});
    if (state.atoms === null) {
      try {
        atoms = findAtoms(state.text);
        setState({...state, atoms: atoms});
        Animated.timing(animatedValueRef.current, ANIMATED_IN_CONFIG).start();
      } catch (e) {
        setState({...state, error: 'Please enter a valid formula'});
      }
    } else {
      Animated.timing(animatedValueRef.current, ANIMATED_OUT_CONFIG).start(() => {
        setState({...state, atoms: null, error: null});
      });
    }
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#121212" barStyle="light-content"/>
      <Animated.View style={{alignItems: 'center', height: animatedHeight}}>
        <Animated.View style={{marginBottom: 10, opacity: animatedOpacity}}>
          <TextInput
            onChangeText={text => setState({...state, text})}
            value={state.text}
            placeholder={'Molecule'}
            placeholderTextColor={'#D7CCC8'}
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
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#121212',
  },
  textInput: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    paddingHorizontal: 20,
    height: 40,
    width: Dimensions.get('window').width / 2 > 200 ? Dimensions.get('window').width / 2 : 200,
    marginBottom: 5,
  },
  textError: {
    color: '#f44336',
    alignSelf: 'center'
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
    borderColor: '#FF0266',
    borderRadius: 100,
    paddingHorizontal: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0266',
  },
  buttonText: {
    color: 'white',
  },
});

export default Index;
