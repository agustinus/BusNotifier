import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import BusRedux from '../Bus'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const apiHearders = {
    'Accept': 'application/json',
    'AccountKey': 'VHfnVKshRZ+UvUCb4d6+dg=='
}

const jsonBusStops = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#BusStops",
    "value": [
        {
            "BusStopCode": "00481",
            "RoadName": "Woodlands Rd",
            "Description": "BT PANJANG TEMP BUS PK",
            "Latitude": 1.383764,
            "Longitude": 103.7583
        },
        {
            "BusStopCode": "01012",
            "RoadName": "Victoria St",
            "Description": "Hotel Grand Pacific",
            "Latitude": 1.29684825487647,
            "Longitude": 103.85253591654006
        },]
}

const jsonBusServices = {
    "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv2/@Element",
    "BusStopCode": "00481",
    "Services": [
        {
            "ServiceNo": "184",
            "Operator": "SMRT",
            "NextBus": {
                "OriginCode": "00481",
                "DestinationCode": "00481",
                "EstimatedArrival": "2019-06-18T13:01:00+08:00",
                "Latitude": "0",
                "Longitude": "0",
                "VisitNumber": "1",
                "Load": "SEA",
                "Feature": "WAB",
                "Type": "SD"
            },
            "NextBus2": {
                "OriginCode": "00481",
                "DestinationCode": "00481",
                "EstimatedArrival": "2019-06-18T13:10:00+08:00",
                "Latitude": "0",
                "Longitude": "0",
                "VisitNumber": "1",
                "Load": "SEA",
                "Feature": "WAB",
                "Type": "BD"
            },
            "NextBus3": {
                "OriginCode": "00481",
                "DestinationCode": "00481",
                "EstimatedArrival": "2019-06-18T13:19:00+08:00",
                "Latitude": "0",
                "Longitude": "0",
                "VisitNumber": "1",
                "Load": "SEA",
                "Feature": "WAB",
                "Type": "SD"
            }
        },
    ]
}

describe('Redux Bus Action', () => {
    afterEach(() => {
        fetchMock.restore()
    })
    it('should emit BUSSTOP_FETCH_SUCCESS when load bus stops is done', () => {
        
        fetchMock.getOnce('http://datamall2.mytransport.sg/ltaodataservice/BusStops', {
            body: jsonBusStops, 
            headers: apiHearders
        })

        const expectedAction = [
            { type: BusRedux.ActionType.BUSSTOP_FETCHING },
            {
                data: jsonBusStops,
                type: BusRedux.ActionType.BUSSTOP_FETCH_SUCCESS
            }
        ]

        const store = mockStore({ data: [] })
        return store.dispatch(BusRedux.ActionCreator.loadBusStops()).then(() => {
            expect(store.getActions()).toEqual(expectedAction)
        })
    })

    it('should emit BUSARRIVAL_FETCH_SUCCESS when load bus stops is done', () => {
        
        fetchMock.getOnce('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=00481', {
            body: jsonBusServices, 
            headers: apiHearders
        })

        const expectedAction = [
            { type: BusRedux.ActionType.BUSARRIVAL_FETCHING },
            {
                data: jsonBusServices,
                type: BusRedux.ActionType.BUSARRIVAL_FETCH_SUCCESS
            }
        ]

        const store = mockStore({ data: [] })
        return store.dispatch(BusRedux.ActionCreator.loadBusArrival('00481')).then(() => {
            expect(store.getActions()).toEqual(expectedAction)
        })
    })
})

describe('getMinArrival', () => {
    it('should give 0 min different when derived duration 0:00', () => {
        expect(BusRedux.getMinArrival("2019-06-18T13:00:00+08:00", "2019-06-18T13:00:00+08:00")).toEqual(0)
    })
    it('should give 1 min different when derived duration 1:00', () => {
        expect(BusRedux.getMinArrival("2019-06-18T13:01:00+08:00", "2019-06-18T13:02:00+08:00")).toEqual(1)
    })
    it('should give 3 min different when derived duration 3:49', () => {
        expect(BusRedux.getMinArrival("2019-06-18T13:00:00+08:00", "2019-06-18T13:03:49+08:00")).toEqual(3)
    })
    it('should give 0 min different when derived duration 0:59', () => {
        expect(BusRedux.getMinArrival("2019-06-18T13:00:00+08:00", "2019-06-18T13:00:59+08:00")).toEqual(0)
    })
})

describe('Redux Bus Reducer', () => {

    const initialState = {
        isFetching: undefined,
        error: undefined,
        busStops: [],
        busServices: [],
    };

    it('should return the initial state', () => {
        expect(BusRedux.Reducer(undefined, {})).toEqual(
            initialState
        )
    })

    it('should should return Bus Stops state', () => {
        const action = {
            type: BusRedux.ActionType.BUSSTOP_FETCH_SUCCESS,
            data: jsonBusStops,
        }
        expect(BusRedux.Reducer(undefined, action)).toEqual(
            {
                isFetching: false,
                error: undefined,
                busServices: [],
                busStops: action.data.value.map(busStop => {
                    return {
                        street: busStop.RoadName,
                        description: busStop.Description,
                        code: busStop.BusStopCode
                    }
                })
            }
        )
    })

    it('should should return Bus Services state', () => {
        const action = {
            type: BusRedux.ActionType.BUSARRIVAL_FETCH_SUCCESS,
            data: jsonBusServices,
        }
        let now = Date.now();
        
        expect(BusRedux.Reducer(undefined, action)).toEqual(
            {
                isFetching: false,
                error: undefined,
                busStops: [],
                busServices: action.data.Services.map(busService => {
                    return {
                        busNo: busService.ServiceNo,
                        arrivals: [{ arrival: BusRedux.getMinArrival(now, busService.NextBus.EstimatedArrival) },
                        { arrival: BusRedux.getMinArrival(now, busService.NextBus2.EstimatedArrival) },
                        { arrival: BusRedux.getMinArrival(now, busService.NextBus3.EstimatedArrival) }]
                    }
                })
            }
        )
    })
})