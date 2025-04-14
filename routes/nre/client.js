/*
SOAP client for NationalRail API

- Need to deal with random timeouts

*/
const soap = require('soap');

const url = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/wsdl.aspx?ver=2021-11-01';

function _fixService(service) {
    if (service == null) throw Error("Service supplied cannot be null")
    // Previous calling points
    if (service.previousCallingPoints != null && service.previousCallingPoints.callingPointList != null && service.previousCallingPoints.callingPointList.callingPoint != null && !Array.isArray(service.previousCallingPoints.callingPointList.callingPoint)) {
        // Fix for single number of calling points
        service.previousCallingPoints.callingPointList.callingPoint = [service.previousCallingPoints.callingPointList.callingPoint];
    }
    if (service.previousCallingPoints != null && !service.previousCallingPoints.callingPointList != null && !Array.isArray(service.previousCallingPoints.callingPointList)) {
        // Fix for when a train has a single set of calling points (ie. does not split)
        service.previousCallingPoints.callingPointList = [service.previousCallingPoints.callingPointList]
    }

    // Subsequent calling points
    if (service.subsequentCallingPoints != null && service.subsequentCallingPoints.callingPointList != null && service.subsequentCallingPoints.callingPointList.callingPoint != null && !Array.isArray(service.subsequentCallingPoints.callingPointList.callingPoint)) {
        // Fix for single number of calling points
        service.subsequentCallingPoints.callingPointList.callingPoint = [service.subsequentCallingPoints.callingPointList.callingPoint];
        
    }
    if (service.subsequentCallingPoints != null && !service.subsequentCallingPoints.callingPointList != null && !Array.isArray(service.subsequentCallingPoints.callingPointList)) {
        // Fix for when a train has a single set of calling points (ie. does not split)
        service.subsequentCallingPoints.callingPointList = [service.subsequentCallingPoints.callingPointList]
    }
}

function _fixServicesCallingPoints(services) {
    /*
    Fix the calling points in the services array. Current things that need fixing:
    - If there is only one calling point, it will be returned as an attribute, not an array
    */
    if (services == null) return null;
    for (let service of services) {
        _fixService(service);
    }
    console.debug(`Fixed calling points`);
    return services;
}

function fixDataTrainData(departureBoardData) {
    /*
    Fix the data in the train services array. Current things that need fixing:
    - If there is only one calling point, it will be returned as an attribute, not an array
    */
    
    if (departureBoardData == null) return null;
    // Fix for train services
    if (departureBoardData.trainServices != null) departureBoardData.trainServices.services = _fixServicesCallingPoints(departureBoardData.trainServices == null ? null : departureBoardData.trainServices.service);
    // Fix for bus services
    if (departureBoardData.busServices != null) departureBoardData.busServices.services = _fixServicesCallingPoints(departureBoardData.busServices == null ? null : departureBoardData.busServices.service);
    // Fix for ferry services
    if (departureBoardData.ferryServices != null) departureBoardData.ferryServices.services = _fixServicesCallingPoints(departureBoardData.ferryServices == null ? null : departureBoardData.ferryServices.service);
    
    return departureBoardData;
}

class Client {
    constructor(TOKEN) {
        this.TOKEN = TOKEN;
        this.soapClient = null;
        soap.createClient(url, {} , (err, client) => {
            if (err) {
                console.error('Error creating SOAP client:', err);
                return;
            }
            console.log("SOAP client created");
            this.soapClient = client;
            client.addSoapHeader({ AccessToken: { TokenValue: this.TOKEN } }, '', 'typ', 'http://thalesgroup.com/RTTI/2013-11-28/Token/types');
        });
    }

    async _waitUntilClientResolved() {
        // Wait for the SOAP client to be created
        while (this.soapClient == null) {
            console.log("Waiting for SOAP client to be created...");
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async getDepartureBoard(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
        /*
        Example parameters:
        startCRS = "WAT"
        filterCrs = null
        filterType = "to"
        timeOffset = 0
        timeWindow = 120
        */
        // Wait for the SOAP client to be created
        await this._waitUntilClientResolved();
        // Perform the SOAP request
        const args = {
            numRows: numRows,
            crs: startCRS.toUpperCase(),
            filterCrs: (filterCrs == null) ? null : filterCrs.toUpperCase(),
            filterType: filterType,
            timeOffset: timeOffset,
            timeWindow: timeWindow,
        };
        const soapAction = 'http://thalesgroup.com/RTTI/2021-11-01/ldb/GetDepartureBoard';
        return new Promise((resolve, reject) => {
            this.soapClient.GetDepartureBoard(args, (err, result) => {
                if (result) {
                    result.GetStationBoardResult = fixDataTrainData(result.GetStationBoardResult); // Fix the data, currently does nothing as the data does not contain any calling points
                    resolve(result);
                } else {
                    console.error('Error calling GetDepartureBoard:', err);
                    reject(err);
                }
            }, '', soapAction);
        });
        

    }

    async getDepartureBoardWithDetails(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
        /*
        Example parameters:
        startCRS = "WAT"
        filterCrs = null
        filterType = "to"
        timeOffset = 0
        timeWindow = 120
        */
        // Wait for the SOAP client to be created
        await this._waitUntilClientResolved();
        // Perform the SOAP request
        const args = {
            numRows: numRows,
            crs: startCRS.toUpperCase(),
            filterCrs: (filterCrs == null) ? null : filterCrs.toUpperCase(),
            filterType: filterType,
            timeOffset: timeOffset,
            timeWindow: timeWindow,
        };
        const soapAction = 'http://thalesgroup.com/RTTI/2021-11-01/ldb/GetDepBoardWithDetails';
        return new Promise((resolve, reject) => {
            this.soapClient.GetDepBoardWithDetails(args, (err, result) => {
                if (result) {
                    result.GetStationBoardResult = fixDataTrainData(result.GetStationBoardResult); // Fix the data
                    resolve(result);
                } else {
                    console.error('Error calling GetDepartureBoard:', err);
                    reject(err);
                }
            }, '', soapAction);
        });
    }
    
    async getArrivalDepartureBoard(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
        /*
        Example parameters:
        startCRS = "WAT"
        filterCrs = null
        filterType = "to"
        timeOffset = 0
        timeWindow = 120
        */
        // Wait for the SOAP client to be created
        await this._waitUntilClientResolved();
        // Perform the SOAP request
        const args = {
            numRows: numRows,
            crs: startCRS.toUpperCase(),
            filterCrs: (filterCrs == null) ? null : filterCrs.toUpperCase(),
            filterType: filterType,
            timeOffset: timeOffset,
            timeWindow: timeWindow,
        };
        const soapAction = 'http://thalesgroup.com/RTTI/2021-11-01/ldb/GetArrivalDepartureBoard';
        return new Promise((resolve, reject) => {
            this.soapClient.GetArrivalDepartureBoard(args, (err, result) => {
                if (result) {
                    result.GetStationBoardResult = fixDataTrainData(result.GetStationBoardResult); // Fix the data
                    resolve(result);
                } else {
                    console.error('Error calling GetArrivalDepartureBoard:', err);
                    reject(err);
                }
            }, '', soapAction);
        });
    }

    async getArrivalDepartureBoardWithDetails(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
        /*
        Example parameters:
        startCRS = "WAT"
        filterCrs = null
        filterType = "to"
        timeOffset = 0
        timeWindow = 120
        */
        // Wait for the SOAP client to be created
        await this._waitUntilClientResolved();
        // Perform the SOAP request
        const args = {
            numRows: numRows,
            crs: startCRS.toUpperCase(),
            filterCrs: (filterCrs == null) ? null : filterCrs.toUpperCase(),
            filterType: filterType,
            timeOffset: timeOffset,
            timeWindow: timeWindow,
        };
        const soapAction = 'http://thalesgroup.com/RTTI/2021-11-01/ldb/GetArrDepBoardWithDetails';
        return new Promise((resolve, reject) => {
            this.soapClient.GetArrDepBoardWithDetails(args, (err, result) => {
                if (result) {
                    console.log(result);
                    result.GetStationBoardResult = fixDataTrainData(result.GetStationBoardResult); // Fix the data
                    resolve(result);
                } else {
                    console.error('Error calling GetArrivalDepartureBoardWithDetails:', err);
                    reject(err);
                }
            }, '', soapAction);
        });
    }

    // Used for getting previous calling points of train, or for getting train details when board is feteched from API without details
    async getServiceDetails(serviceID) {
        await this._waitUntilClientResolved();

        const args = {
            serviceID: serviceID,
        };
        const soapAction = 'http://thalesgroup.com/RTTI/2021-11-01/ldb/GetServiceDetails';
        return new Promise((resolve, reject) => {
            this.soapClient.GetServiceDetails(args, (err, result) => {
                if (result) {
                    _fixService(result.GetServiceDetailsResult)
                    resolve(result);
                } else {
                    console.error('Error retrieving service details: ', err);
                    reject(err);
                }
            })
        })
    }
}

/*const args = {
    numRows: 10,
    crs: "WAT",
    filterCrs: null,
    filterType: "to",
    timeOffset: 0,
    timeWindow: 120,
};

soap.createClient(url, {} , (err, client) => {
    if (err) {
      console.error('Error creating SOAP client:', err);
      return;
    }
  
    // Set the SOAP action for the GetDepartureBoard operation
    const soapAction = 'http://thalesgroup.com/RTTI/2017-10-01/ldb/GetDepartureBoard';
    client.addSoapHeader({ AccessToken: { TokenValue: TOKEN } }, '', 'typ', 'http://thalesgroup.com/RTTI/2013-11-28/Token/types');
  
    client.GetDepartureBoard(args, (err, result) => {
      if (err) {
        console.error('Error calling GetDepartureBoard:', err);
      } else {
        // Process the result here
        console.log(result);
        const departureBoard = result.GetStationBoardResult;
        console.log(departureBoard.trainServices);
        console.log(departureBoard.busServices);
      }
    }, '', soapAction);
  });*/

module.exports = Client;