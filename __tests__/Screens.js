import 'react-native';
import React from 'react';

import SearchScreen from './../app/screens/SearchScreen';
import DetailsScreen from './../app//screens/DetailsScreen';
import PurchaseScreen from './../app//screens/PurchaseScreen';
import Drawer from './../app/screens/Drawer';
import { food, wine } from './../app/data/data.json';

import renderer from 'react-test-renderer';

describe('Search Screen', () => {
  it('renders Food correctly', () => {
    const tree = renderer.create(<SearchScreen navigation={{ state: { routeName: 'Food' } }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders Wine correctly', () => {
    const tree = renderer.create(<SearchScreen navigation={{ state: { routeName: 'Wine' } }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
})

describe('Details Screen', () => {
  it('renders Food details correctly', () => {
    const tree = renderer.create(<DetailsScreen navigation={{
      state: { params: { type: 'Food', item: food[0] } }
    }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('renders Wine details correctly', () => {
    const tree = renderer.create(<DetailsScreen navigation={{
      state: { params: { type: 'Wine', item: wine[0] } }
    }} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});


it('renders PurchaseScreen correctly', () => {
  const tree = renderer.create(<PurchaseScreen navigation={{
    state: { params: { type: 'Food', item: food[0] } }
  }} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders Drawer correctly', () => {
  const tree = renderer.create(<Drawer />);
});


