const express = require('express');
const bodyParser = require('body-parser');
const { get, init, put } = require('./gis');
const app = express();
app.use(bodyParser.json());

const port = 3000;
init();

app.get("/gis/testpoint/:lat/:long", (req, res) => {
    try {
        const lat = req.params.lat;
        const long = req.params.long;

        if (isNaN(lat) || isNaN(long)) return res.sendStatus(400);

        const result = get(lat, long);

        if (result.polygons.length === 0) res.sendStatus(404);

        res.send(result);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.put("/gis/addpolygon", (req, res) => {
    try {
        feature = req.body;
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
            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.use((req, res) => {
    res.send("welcome");
})

app.listen(process.env.PORT || port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});