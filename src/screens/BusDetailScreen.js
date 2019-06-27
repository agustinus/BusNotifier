import React from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import ReduxBus from '../redux/Bus';

import LoadingIndicator from '../components/LoadingIndicator';
import StandardList from '../components/StandardList';


export class BusDetailScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Bus Stop ' + navigation.getParam('item', undefined).code,
        };
    };

    componentDidMount() {
        this.props.loadBusArrival(this.props.navigation.getParam('item', undefined).code);
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
                        data={this.props.busServices}
                        renderItem={({ item }) => this._renderItem({ item })}
                        onRefresh={() => this.props.loadBusArrival(this.props.navigation.getParam('item', undefined).code)}
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
                title={item.busNo}
                onPress={() => {}}
                rightElement={this._buildArrivalView(item)}
            />
        )
    };

    _buildArrivalView = (item) => {
        let arrivals = [];
        let i = 0;
        item.arrivals.forEach(bus => {
            arrivals.push(<Text key={i++} style={styles.textBox}>
                {this._formatArrTime(bus.arrival)}
            </Text>);
        });
        return (
            <View style={styles.arrivalsView}>
                {arrivals}
            </View>
        );
    }

    _formatArrTime = (minute) => {
        if (minute == 0) {
            return 'Arr';
        } else if (minute < 0) {
            return 'Left';
        } else if (minute > 0) {
            return minute.toString();
        }

        return '-';
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.bus.isFetching,
        busServices: state.bus.busServices,
        error: state.bus.error,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadBusArrival(code) {
            return dispatch(ReduxBus.ActionCreator.loadBusArrival(code));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BusDetailScreen);

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    listItemTitle: {
        fontWeight: 'bold',
    },
    arrivalsView: {
        flex: 0.6,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    textBox: {
        backgroundColor: "black",
        color: "white",
        width: 40,
        textAlign: "center",
        fontWeight: "bold"
    }
})
