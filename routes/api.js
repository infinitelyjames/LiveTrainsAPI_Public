const express = require('express');
const router = express.Router();
const nre = require('./nre/main');
const config = require('../config.js');

async function liveDepartures(req, res) {
    try {
        // Assertions for the request body
        if (req.body.station == null) return res.status(400).json({error: "Missing station code"});
        // Note, we do not care if destination and rows are not present, they are optional
        response = await nre.getDepartureBoardWithDetails(
            req.body.station,
            req.body.destination,
            req.body.filterType || "to",
            req.body.timeOffset || 0,
            req.body.timeWindow || 120,
            req.body.rows || 10,
        )
        return res.status(200).json(response);
    } catch {
        return res.status(500).json({error: "Internal server error, but is assumed to be with the NRE API"});
    }
}

// Can fetch more departures at once, but cannot fetch details
async function liveDeparturesNoDetails(req, res) {
    try {
        // Assertions for the request body
        if (req.body.station == null) return res.status(400).json({error: "Missing station code"});
        // Note, we do not care if destination and rows are not present, they are optional
        response = await nre.getDepartureBoard(
            req.body.station,
            req.body.destination,
            req.body.filterType || "to",
            req.body.timeOffset || 0,
            req.body.timeWindow || 120,
            req.body.rows || 150,
        )
        return res.status(200).json(response);
    } catch {
        return res.status(500).json({error: "Internal server error, but is assumed to be with the NRE API"});
    }
}

async function liveArrivalsDepartures(req, res) {
    try {
        // Assertions for the request body
        if (req.body.station == null) return res.status(400).json({error: "Missing station code"});
        // Note, we do not care if destination and rows are not present, they are optional
        response = await nre.getArrivalDepartureBoardWithDetails(
            req.body.station,
            req.body.destination,
            req.body.filterType || "to",
            req.body.timeOffset || 0,
            req.body.timeWindow || 120,
            req.body.rows || 10,
        )
        console.log(response);
        return res.status(200).json(response);
    } catch (e){
        console.error(e)
        return res.status(500).json({error: "Internal server error, but is assumed to be with the NRE API"});
    }
}

async function liveArrivalsDeparturesNoDetails(req, res) {
    try {
        // Assertions for the request body
        if (req.body.station == null) return res.status(400).json({error: "Missing station code"});
        // Note, we do not care if destination and rows are not present, they are optional
        response = await nre.getArrivalDepartureBoard(
            req.body.station,
            req.body.destination,
            req.body.filterType || "to",
            req.body.timeOffset || 0,
            req.body.timeWindow || 120,
            req.body.rows || 10,
        )
        return res.status(200).json(response);
    } catch {
        return res.status(500).json({error: "Internal server error, but is assumed to be with the NRE API"});
    }
}

async function serviceDetails(req, res) {
    try {
        if (req.body.serviceID == null) return res.status(400).json({error: "Mission ServiceID from body"});
        response = await nre.getServiceDetails(req.body.serviceID);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e.stack)
        return res.status(500).json({error: "Executing the request with your provided details caused an unexplained error"});
    }
}

async function handleOption(option, req, res) {
    try {
        switch (option){
            case "livedepartures": await liveDepartures(req, res); break;
            case "livedeparturesnodetails": await liveDeparturesNoDetails(req, res); break;
            case "livearrivalsdepartures": await liveArrivalsDepartures(req,res); break;
            case "livearrivalsdeparturesnodetails": await liveArrivalsDeparturesNoDetails(req, res); break;
            case "servicedetails": await serviceDetails(req, res); break;
            default:
                res.status(400).json({error: "Invalid API option"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

async function checkAuth(req, res, next) {
    if (req.headers.authorization == null) return res.status(401).json({error: "Missing authorization header"});
    if (!config.apiKeys.includes(req.headers.authorization)) return res.status(401).json({error: "Invalid API key"});
    next();
}

router.post("/api/v1/:option", checkAuth, async (req, res) => {
    handleOption(req.params.option, req, res);
})

module.exports = router;