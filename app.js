const express = require('express');
const bodyParser = require('body-parser');
const { get, init, put } = require('./gis');

const Logger = require('./logger_service');
const logger = new Logger('app');

const app = express();
app.use(bodyParser.json());

const port = 3000;
init();

app.get("/gis/testpoint/:lat/:long", (req, res) => {
    logger.info(`Request recieved at /gis/testpoint lat:${req.params.lat} long:${req.params.long}`);

    try {
        const lat = req.params.lat;
        const long = req.params.long;

        if (isNaN(lat) || isNaN(long)) {
            logger.error("long-lat is NaN");
            return res.sendStatus(400);
        }

        const result = get(lat, long);

        if (result.polygons.length === 0) {
            logger.info("polygon not found")
            return res.sendStatus(404);
        }

        logger.info("match found", result);
        res.send(result);
    } catch (error) {
        console.log(error);
        logger.error(error);
        res.sendStatus(500);
    }
})


app.put("/gis/addpolygon", (req, res) => {
    const body = req.body;
    logger.setLogData(body)
    logger.info("Request recieved at /gis/addpolygon", req.body)

    try {
        feature = req.body;

        if (!feature.type) {
            logger.error("Type non-existant");
        }
        if (!feature.properties) {
            logger.error("properties non-existant");
        }
        if (!feature.geometry) {
            logger.error("geometry non-existant");
        }
        if (!feature.properties.name) {
            logger.error("properties.name non-existant");
        }
        if (!feature.geometry.type) {
            logger.error("geometry.type non-existant");
        }
        if (!feature.geometry.coordinates) {
            logger.error("geometry.coordinates non-existant");
        }
        if (!Array.isArray(feature.geometry.coordinates)) {
            logger.error("geometry.coordinates is not an array");
        }
        if (!(feature.geometry.coordinates.length === 1)) {
            logger.error("geometry.coordinates is empty");
            res.sendStatus(400);
        }
        if (!(feature.geometry.coordinates[0].length === 4)) {
            logger.error(`mismatched number of coordinates ${feature.geometry.coordinates[0].length} out of 4`);
        }
        if (!Array.isArray(feature.geometry.coordinates[0][0])) {
            logger.error(`coordinate [0][0] is not an array`);
        }
        if (!Array.isArray(feature.geometry.coordinates[0][1])) {
            logger.error(`coordinate [0][1] is not an array`);
        }
        if (!Array.isArray(feature.geometry.coordinates[0][2])) {
            logger.error(`coordinate [0][2] is not an array`);
        }
        if (!Array.isArray(feature.geometry.coordinates[0][3])) {
            logger.error(`coordinate [0][3] is not an array`);
        }
        if (!(feature.type === "Feature")) {
            logger.error("type field is not Feature");
        }
        if (!(typeof feature.properties.name === 'string')) {
            logger.error("properties.name is not a string");
        }
        if (!(feature.geometry.type === "Polygon")) {
            logger.error("geometry.type is not Polygon");
        }
        if (!(feature.geometry.coordinates[0][0].length === 2) ||
            !(feature.geometry.coordinates[0][0].length === 2) ||
            !(feature.geometry.coordinates[0][1].length === 2) ||
            !(feature.geometry.coordinates[0][2].length === 2) ||
            !(feature.geometry.coordinates[0][3].length === 2)) {
            logger.error("missing lat-long");
        }

        if (isNaN(feature.geometry.coordinates[0][0][0]) ||
            isNaN(feature.geometry.coordinates[0][0][1]) ||
            isNaN(feature.geometry.coordinates[0][1][0]) ||
            isNaN(feature.geometry.coordinates[0][1][1]) ||
            isNaN(feature.geometry.coordinates[0][2][0]) ||
            isNaN(feature.geometry.coordinates[0][2][1]) ||
            isNaN(feature.geometry.coordinates[0][3][0]) ||
            isNaN(feature.geometry.coordinates[0][3][1])) {
            logger.error("coordinate is NaN");
        }

        if (!feature.type ||
            !feature.properties ||
            !feature.geometry ||
            !feature.properties.name ||
            !feature.geometry.type ||
            !feature.geometry.coordinates ||
            !Array.isArray(feature.geometry.coordinates) ||
            !(feature.geometry.coordinates.length === 1) ||
            !Array.isArray(feature.geometry.coordinates[0]) ||
            !(feature.geometry.coordinates[0].length === 4) ||
            !Array.isArray(feature.geometry.coordinates[0][0]) ||
            !Array.isArray(feature.geometry.coordinates[0][1]) ||
            !Array.isArray(feature.geometry.coordinates[0][2]) ||
            !Array.isArray(feature.geometry.coordinates[0][3]) ||
            !(feature.type === "Feature") ||
            !(typeof feature.properties.name === 'string') ||
            !(feature.geometry.type === "Polygon") ||
            !(feature.geometry.coordinates[0][0].length === 2) ||
            !(feature.geometry.coordinates[0][1].length === 2) ||
            !(feature.geometry.coordinates[0][2].length === 2) ||
            !(feature.geometry.coordinates[0][3].length === 2) ||
            isNaN(feature.geometry.coordinates[0][0][0]) ||
            isNaN(feature.geometry.coordinates[0][0][1]) ||
            isNaN(feature.geometry.coordinates[0][1][0]) ||
            isNaN(feature.geometry.coordinates[0][1][1]) ||
            isNaN(feature.geometry.coordinates[0][2][0]) ||
            isNaN(feature.geometry.coordinates[0][2][1]) ||
            isNaN(feature.geometry.coordinates[0][3][0]) ||
            isNaN(feature.geometry.coordinates[0][3][1])) {

            res.sendStatus(400);
        }
        else {
            put(feature);
            logger.info("put request completed successfully");
            res.sendStatus(200);
        }

    } catch (error) {
        console.log(error);
        logger.error(error);
        res.sendStatus(500);
    }
})

app.use((req, res) => {
    logger.info("welcome screen launched");
    res.send("welcome");
})

app.listen(process.env.PORT || port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    logger.info(`APP LAUNCHED IN PORT ${this.address().port}`);
});