/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Store from './redux/Store'
import Routes from './Routes';


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={Store}>
        <Routes />
      </Provider>
    );
  }
}

