import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ListView,
  Image,
  Platform,
  Dimensions,
  TouchableHighlight
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Service from './../data/service';

export default class Search extends Component {
  state = {
    results: [],
    searchTerm: ''
  }

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  componentDidMount() {
    Service.search('', this.props.navigation.state.routeName)
      .then(results => this.setState({ results }));
  }

  search(searchTerm, type) {
    this.setState({ searchTerm });
    Service.search(searchTerm, type).then(results => this.setState({ results }));
  }

  showDetails(item, type) {
    this.props.navigation.navigate('Details', { item, type });
  }

  static navigationOptions = {
    title: ({ state }) => `Select ${state.routeName}`,
    tabBar: ({ state }) => ({
      label: `${state.routeName}`,
      icon: ({ tintColor, focused }) => (
        <Ionicons
          name={(state.routeName === 'Food' ? 'ios-pizza' : 'ios-wine') + (focused ? '' : '-outline')}
          size={40}
          style={{ color: tintColor }}
        />
      ),
    }),
    header: ({ navigate }) => ({
      left:
      <TouchableHighlight onPress={() => navigate('DrawerOpen')}>
        <Ionicons
          name="ios-menu"
          size={30}
          style={{ marginLeft: 10, marginTop: 10 }}
        />
      </TouchableHighlight>
    })
  }

  renderItem(item, type) {
    return (
      <TouchableHighlight
        style={styles.searchItem}
        onPress={() => this.showDetails(item, type)}
        underlayColor="#eee"
      >
        <View style={styles.searchItemContainer}>
          <View style={{ marginRight: 15, borderColor: '#e5e5e5', borderWidth: 1 }}>
            <Image
              resizeMode="cover"
              source={{ uri: item.imageURL }}
              style={{ width: 70, height: 70 }}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={{ fontSize: 16 }}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>
              {item.category}{item.region} {item.country}
            </Text>
            <Text style={{ fontSize: 14 }}>
              $ {item.price}.00
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <MaterialIcons name="chevron-right" size={30} color="#b8c3c9" />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    let { searchTerm, results } = this.state;
    let { routeName } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search"
            onChangeText={text => this.search(text, routeName)}
            value={this.state.searchTerm}
          />
          <Text style={styles.searchHint}>
            {searchTerm ? `Showing ${results.length} items for ${searchTerm}` : `Showing all ${results.length} items`}
          </Text>
        </View>
        {results.length === 0 ?
          <View style={styles.noResults}>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>
              No results found
            </Text>
          </View>
          :
          <ListView
            style={styles.searchList}
            dataSource={this.dataSource.cloneWithRows(results)}
            renderRow={item => this.renderItem(item, routeName)}
          />}
      </View >
    );
  }
}

const Layout = {
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  searchContainer: {
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: Platform.OS === 'android' ? 1 : StyleSheet.hairlineWidth,
    margin: 15,
    marginBottom: 0
  },
  searchBox: {
    height: 40,
    borderColor: '#e5e5e5',
    borderWidth: 1,
    padding: 5,
    marginBottom: 5,
    borderRadius: 10
  },
  searchHint: {
    textAlign: 'right',
    fontStyle: 'italic',
    paddingTop: 3,
    paddingBottom: 10
  },

  searchItem: {
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: Platform.OS === 'android' ? 1 : StyleSheet.hairlineWidth
  },

  searchItemContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  noResults: {
    padding: 10,
    margin: 10,
    flex: 1
  }
});