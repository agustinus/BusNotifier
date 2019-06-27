import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class StandardList extends React.PureComponent {
    static propTypes = {
        renderItem: PropTypes.func.isRequired,
        data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
        onRefresh: PropTypes.func,
        isRefreshing: PropTypes.bool, 
    }

    static defaultProps = {
        isRefreshing: false,
    }

    _keyExtractor = (item, index) => index.toString();

    constructor(props) {
        super(props);
    }

    _itemSeparator = () => {
        return (
            //Item Separator
            <View style={styles.listSeparator} />
        );
    };

    _buildArrivalView = (item) => {
        return (
            <View style={{flex: 0.6, flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={styles.textBox}>{item.arrivals[0].arrival}</Text>
                <Text style={styles.textBox}>{item.arrivals[1].arrival}</Text>
                <Text style={styles.textBox}>{item.arrivals[2].arrival}</Text>
            </View>
        );
    }

    render() {
        return (
            <FlatList
                style={{ backgroundColor: 'white' }}
                data={this.props.data}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={({ item }) => this.props.renderItem({ item })}
                ItemSeparatorComponent={this._itemSeparator}
                onRefresh={this.props.onRefresh}
                refreshing={this.props.isRefreshing}
            />
        );
    }
}

const styles = StyleSheet.create({
    listSeparator: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
    },
    textBox: {
        backgroundColor: "black",
        color: "white",
        width: 40,
        textAlign: "center",
        fontWeight: "bold"
    }
})