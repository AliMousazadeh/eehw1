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
        put(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(port, () => console.log(`listening on port ${port}`));