import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import ReduxBus from '../redux/Bus';

import LoadingIndicator from '../components/LoadingIndicator';
import StandardList from '../components/StandardList';

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home'
    };

    componentDidMount() {
        this.props.loadBusStops();
    }

    
    render() {
        if (this.props.isLoading) {
            return (<LoadingIndicator
                isLoading={this.props.isLoading}
            />);
        }

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.screen}>
                    <StandardList
                        data={this.props.busStops}
                        renderItem={({ item }) => this._renderItem({ item })}
                        onRefresh={() => this.props.loadBusStops()}
                        isRefreshing={this.props.isLoading}
                    />
                </View>
            </SafeAreaView>
        );
    }

    _renderItem = ({ item }) => {
        return (
            <ListItem
                titleStyle={styles.listItemTitle}
                title={item.code}
                subtitle={item.description + ', ' + item.street}
                chevron={true}
                onPress={() =>  this.props.navigation.navigate('BusDetail', { item })}
            />
        )
    };
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    listItemTitle: {
        fontWeight: 'bold',
    }
})

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    isLoading: state.bus.isFetching,
    busStops: state.bus.busStops,
    error: state.bus.error,
    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      loadBusStops() {
          return dispatch(ReduxBus.ActionCreator.loadBusStops());
      },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
