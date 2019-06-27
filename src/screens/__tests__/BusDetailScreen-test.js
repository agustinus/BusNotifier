import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { configure, shallow } from 'enzyme'
import { BusDetailScreen } from '../BusDetailScreen';

configure({ adapter: new Adapter() });

describe('Arrival time', () => {
    const props = {
        navigation: {getParam: jest.fn().mockReturnValue({code: '123'})},
        loadBusArrival: jest.fn,
        busServices: {}
    }
    
    const wrapper = shallow(<BusDetailScreen {...props}/>);
    const instance = wrapper.instance();

    it('should return Arr if minute is zero', () => {
        expect(instance._formatArrTime(0)).toEqual('Arr');
    })
    it('should return Left if minute < zero', () => {
        expect(instance._formatArrTime(-1)).toEqual('Left');
    })
    it('should return the minute if minute > zero', () => {
        expect(instance._formatArrTime(12)).toEqual('12');
    })
    it('should return dash if NaN', () => {
        expect(instance._formatArrTime(NaN)).toEqual('-');
    })
})