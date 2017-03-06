import React from 'react';

import { TouchableHighlight, Text, View, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';


export default Button = (props) => (
  <TouchableHighlight onPress={() => props.onPress()} underlayColor="#e8e8e8">
    <View style={styles.button}>
      <Ionicons name={props.icon} color='#fff' size={30} style={{ marginRight: 10 }} />
      <Text style={{ fontSize: 18, color: '#fff' }}>{props.title}</Text>
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingLeft: 15,
    justifyContent: 'center',
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#0275d8',
  },
});