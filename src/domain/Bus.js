import DomainCommon from './Common';

const BusService = {
  loadBusStops: function () {
    return new Promise((resolve, reject) => {
      let endPoint = 'http://datamall2.mytransport.sg/' + 'ltaodataservice/BusStops';
      return DomainCommon.fetch(endPoint, resolve, reject);
    });
  },
  loadBusArrival: function (busStopCode) {
    return new Promise((resolve, reject) => {
      let endPoint = 'http://datamall2.mytransport.sg/' + `ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`;
      return DomainCommon.fetch(endPoint, resolve, reject);
    });
  },
};
export default BusService;