require("dotenv").config();
const Client = require("./client.js");


//console.log(process.env.NRE_API_KEY)
const nreClient = new Client(process.env.NRE_API_KEY);

async function getDepartureBoard(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
    // Don't include anything else apart from the GetStationBoardResult object
    return (await nreClient.getDepartureBoard(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows)).GetStationBoardResult;
}

async function getDepartureBoardWithDetails(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
    return (await nreClient.getDepartureBoardWithDetails(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows)).GetStationBoardResult;
}

async function getArrivalDepartureBoard(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
    return (await nreClient.getArrivalDepartureBoard(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows)).GetStationBoardResult;
}

async function getArrivalDepartureBoardWithDetails(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows) {
    return (await nreClient.getArrivalDepartureBoardWithDetails(startCRS, filterCrs, filterType, timeOffset, timeWindow, numRows)).GetStationBoardResult;
}

async function getServiceDetails(serviceID) {
    return (await nreClient.getServiceDetails(serviceID)).GetServiceDetailsResult;
}

module.exports = {
    getDepartureBoard,
    getDepartureBoardWithDetails,
    getArrivalDepartureBoard,
    getArrivalDepartureBoardWithDetails,
    getServiceDetails,
}


/* Old code with old module 
var Rail = require('national-rail-darwin');
var rail = new Rail("APIKEY"); // <-- API Key

function getDepartureBoardWithDetails(station, destination=null, rows=null, callback, errCallback) {
    *
    Station and destination supplied must be in the form of a 3 letter code, and in uppercase for the API.
    This function will automatically convert the station and destination to uppercase.
    *
    // Format the optional JSON to send to the API
    let data = {};
    if (destination != null) {
        data.destination = destination.toUpperCase();
    }
    if (rows != null) {
        data.rows = rows;
    }

    // Get the departure board
    rail.getDepartureBoardWithDetails(station.toUpperCase(), data, function(err, result) {
        if (err) {
            errCallback(err);
        }
        else {
            callback(result);
        }
    });
}

function getServiceDetails(serviceID, callback, errCallback) {
    rail.getServiceDetails(serviceID, function(err, result) {
        if (err) {
            errCallback(err);
        }
        else {
            callback(result);
        }
    });
}

module.exports = {
    getDepartureBoardWithDetails,
    getServiceDetails
} */