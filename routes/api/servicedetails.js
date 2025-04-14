/*
CAUTION - This api wrapper is deprecated and will be removed in a future release.
*/

const nre = require("../nre/main.js");

async function getServiceDetails(req, res) {
    try {
        if (req.body.serviceID == null) return res.status(400).json({error: "Missing service ID (key 'serviceID')"});
        nre.getServiceDetails(
            req.body.serviceID,
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
}

module.exports = getServiceDetails;