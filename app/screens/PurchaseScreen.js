import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableHighlight
} from 'react-native';

import Service, { Bill } from './../data/service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

let tips = 0;

export default class DetailsScreen extends Component {
  static navigationOptions = {
    title: 'Purchase',
    header: ({ goBack, state: { item, type }, navigate }) => ({
      left: (<TouchableHighlight onPress={() => goBack()}>
        <MaterialIcons name="chevron-left" size={30} />
      </TouchableHighlight>),
    })
  }

  state = {}

  componentDidMount() {
    let bill = new Bill(this.props.navigation.state.params.item.price, tips);
    bill.calculateTotal();
    this.setState(bill.get());
  }

  pay() {
    let bill = new Bill(this.props.navigation.state.params.item.price, tips);
    bill.calculateChargedTotal();
    this.setState({ paid: true, ...bill.get() });
  }

  setTips(val) {
    let bill = new Bill(this.props.navigation.state.params.item.price, val);
    bill.calculateTotal();
    this.setState(bill.get());
    tips = val;
  }

  paymentMessage() {
    if (!this.state.paid) {
      return (<Button title="Make Payment" icon="ios-card" onPress={() => this.pay()} />);
    }
    return (
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
        <Ionicons name="ios-checkmark-circle" size={70} color="#449d44" />
        <Text style={{ fontSize: 22 }}>Thank You</Text>
        <Text style={{ fontSize: 24, marginTop: 10 }}>
          You have been charged ${this.state.chargedTotal}.00
        </Text>
      </View>
    );
  }

  render() {
    const { item, type } = this.props.navigation.state.params;
    return (
      <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
          <Ionicons size={40} name={type === 'Food' ? 'ios-pizza' : 'ios-wine'} />
          <Text style={{ fontSize: 30, marginLeft: 10 }}>{item.name}</Text>
        </View>
        <Row label="Item Price" value={item.price} />
        <Row label="Discount" value={this.state.discount} style={{ color: '#ff3333' }} />
        <Row label="Tax" value={this.state.tax} />
        <Row label="Tips" >
          <TextInput
            style={styles.value}
            value={`${this.state.tips}`}
            onChangeText={tips => this.setTips(tips)}
            keyboardType="numeric"
          />
        </Row>
        <Row label="Subtotal" value={this.state.subtotal} style={{ fontWeight: 'bold', fontSize: 20 }} />
        <Row label="Surcharge" value={this.state.surcharge} />
        <Row label="Total" value={this.state.total} style={{ fontWeight: 'bold', fontSize: 30, borderColor: '#222', color: '#111', marginBottom: 25 }} />
        {this.paymentMessage()}
      </ScrollView>
    );
  }
}

const BITCOINT_RATE = 100;

const Row = (props) => (<View style={styles.row}>
  <Text style={[styles.label, props.style]}>{props.label}</Text>
  {props.children ? props.children : <Text style={[styles.value, props.style]}>{format(props.value)}</Text>}
</View>)

const format = (val) => {
  let parts = `${val}`.split('.');
  (parts.length < 2) && parts.push('00');
  parts[1] = (`${parts[1]}00`).slice(0, 2);
  return parts.join('.');
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5
  },
  label: {
    fontSize: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
    padding: 5,
    flex: 1,
    color: '#333'
  },
  value: {
    fontSize: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
    padding: 5,
    flex: 1,
    textAlign: 'right',
    marginLeft: 5,
    color: '#333'
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0275d8',
    padding: 5,
    marginTop: 10
  }
});

const validateTips = (tips) => {
  tips = parseInt(tips);
  if (Number.isNaN(tips)) {
    tips = 0;
  }
  return tips;
}