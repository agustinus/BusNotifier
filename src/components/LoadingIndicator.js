import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';

export default class LoadingIndicator extends React.Component {
    render() {
        return (<ActivityIndicator
            animating={this.props.isLoading}
            style={this.props.isLoading ? styles.loadingContainer : {}}
            size='large'
        />);
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        marginTop: 80,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF88'
    }
})