import BusService from '../domain/Bus'
const moment = require('moment');

const ActionType = {
    BUSSTOP_FETCHING: 'BUSSTOP_FETCHING',
    BUSSTOP_FETCH_SUCCESS: 'BUSSTOP_FETCH_SUCCESS',
    BUSSTOP_FETCH_FAILURE: 'BUSSTOP_FETCH_FAILURE',

    BUSARRIVAL_FETCHING: 'BUSARRIVAL_FETCHING',
    BUSARRIVAL_FETCH_SUCCESS: 'BUSARRIVAL_FETCH_SUCCESS',
    BUSARRIVAL_FETCH_FAILURE: 'BUSARRIVAL_FETCH_FAILURE',
};

let ActionCreator = {
    loadBusStops() {
        return function (dispatch) {
            dispatch({ type: ActionType.BUSSTOP_FETCHING });
            return BusService.loadBusStops().then(data => {
                dispatch({ type: ActionType.BUSSTOP_FETCH_SUCCESS, data: data });
                return data;
            }).catch(err => { 
                return dispatch({ type: ActionType.BUSSTOP_FETCH_FAILURE, error: err });
            })
        }
    },
    loadBusArrival(busCodeNumber) {
        return function (dispatch) {
            dispatch({ type: ActionType.BUSARRIVAL_FETCHING });
            return BusService.loadBusArrival(busCodeNumber).then(data => {
                dispatch({ type: ActionType.BUSARRIVAL_FETCH_SUCCESS, data: data });
                return data;
            }).catch(err => { 
                return dispatch({ type: ActionType.BUSARRIVAL_FETCH_FAILURE, error: err });
            })
        }
    }
};

const initialState = {
    isFetching: undefined,
    error: undefined,
    busStops: [],
    busServices: [],
};

function Reducer(state = initialState, action) {
    switch (action.type) {
        case ActionType.BUSSTOP_FETCHING:
        case ActionType.BUSARRIVAL_FETCHING:
            return {
                ...state,
                isFetching: true,
                error: undefined,
            };
        case ActionType.BUSSTOP_FETCH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: undefined,
                busStops: action.data.value.map(busStop => {
                    return {
                        street: busStop.RoadName,
                        description: busStop.Description,
                        code: busStop.BusStopCode
                    }
                })
            };
        case ActionType.BUSARRIVAL_FETCH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: undefined,
                busServices: action.data.Services.map(busService => {
                    return {
                        busNo: busService.ServiceNo,
                        arrivals: [{ arrival: getMinArrival(Date.now(), busService.NextBus.EstimatedArrival) },
                        { arrival: getMinArrival(Date.now(), busService.NextBus2.EstimatedArrival) },
                        { arrival: getMinArrival(Date.now(), busService.NextBus3.EstimatedArrival) }]
                    }
                })
            };
        case ActionType.BUSSTOP_FETCH_FAILURE:
        case ActionType.BUSARRIVAL_FETCH_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        default:
            return state;
    }
}

function getMinArrival(now, next) {
    let nextTiming = moment(next);
    let nowTiming = moment(now);
    let diffTiming = nextTiming.diff(nowTiming, 'minute');
   
    return diffTiming;
}

export default {ActionType, ActionCreator, Reducer, getMinArrival};