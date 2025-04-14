/*
CAUTION - This api wrapper is deprecated and will be removed in a future release.
*/

const nre = require('../nre/main');
// Get live departures

async function getLiveDepartures(req, res) {
    try {
        // Assertions for the request body
        if (req.body.station == null) return res.status(400).json({error: "Missing station code"});
        // Note, we do not care if destination and rows are not present, they are optional
        nre.getDepartureBoardWithDetails(
            req.body.station,
            req.body.destination,
            req.body.rows,
            (result) => {
                return res.status(200).json(result);
            },
            (err) => {
                console.error(err);
                return res.status(422).json({error: "Unprocessable entity, please ensure the data in each attribute supplied is valid"});
            }
        )
    } catch (error) {
        console.error(error);
        return res.status(504).json({error: "An internal server error occurred, but is assumed to be with the NRE API"});
    }
    /* Placeholders for old code
    return res.status(200).json({
        "departures": [
            {
                "serviceCode": "SW123",
                "destination": "London Waterloo",
                "platform": "1b",
                "scheduledDepartureTime": "12:00",
                "estDepartureTime": "12:05",
                "estArrivalTime": "13:00",
                "operator": "South Western Railway",
                "coaches": "12",
                "callingPoints": [
                    "Ewell West",
                    "Stoneleigh",
                    "Worcester Park",
                    "Motspur Park",
                    "Raynes Park",
                    "Wimbledon",
                    "Earlsfield",
                    "Clapham Junction",
                    "Vauxhall",
                    "London Waterloo"
                ]
            },
            {
                "serviceCode": "SW456",
                "destination": "London Waterloo",
                "platform": "2a",
                "scheduledDepartureTime": "12:30",
                "estDepartureTime": "12:30",
                "estArrivalTime": "13:05",
                "operator": "South Western Railway",
                "coaches": "8",
                "callingPoints": [
                    "Worcester Park",
                    "Wimbledon",
                    "Earlsfield",
                    "Clapham Junction",
                    "Vauxhall",
                    "London Waterloo"
                ]
            },
            {
                "serviceCode": "SW789",
                "destination": "London Waterloo",
                "platform": "1a",
                "scheduledDepartureTime": "12:45",
                "estDepartureTime": "Cancelled",
                "estArrivalTime": "Cancelled",
                "operator": "South Western Railway",
                "coaches": "10",
                "callingPoints": [
                    "Ewell West",
                    "Stoneleigh",
                    "Worcester Park",
                    "Motspur Park",
                    "Raynes Park",
                    "Wimbledon",
                    "Earlsfield",
                    "Clapham Junction",
                    "Vauxhall",
                    "London Waterloo"
                ]
            },
            {
                "serviceCode": "SN123",
                "destination": "London Victoria",
                "platform": null,
                "scheduledDepartureTime": "13:00",
                "estDepartureTime": "13:05",
                "estArrivalTime": "14:00",
                "operator": "Southern",
                "coaches": null,
                "callingPoints": []
            }
        ]
    })
    //return res.status(410).json({error: "This API is not yet available"}); */
}

module.exports = getLiveDepartures;