const fs = require('fs')
const turf = require('@turf/turf')

let features = []

function readFile(path) {
    return fs.readFileSync(path, "utf8");
}

function writeFile(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
}

function init() {
    const json = readFile("input.json");
    if (!json) {
        writeFile("input.json", { type: "FeatureCollection", features: [] });
        return;
    };

    const data = JSON.parse(json);
    if (!data.features) {
        writeFile("input.json", { type: "FeatureCollection", features: [] });
        return;
    };
    features = data.features;
}

function get(lat, long) {
    const point = turf.point([long, lat]);
    const filter = features.filter(i => turf.booleanPointInPolygon(point, i.geometry));

    let result = {
        polygons: []
    }

    filter.forEach(feature => {
        result.polygons.push(feature.properties.name)
    });

    return result;
}

function put(feature) {
    //validate
    if (!feature.type ||
        !feature.properties) {

    }
    features.push(feature);
    writeFile("input.json", { type: "FeatureCollection", features: features });
}

module.exports = {
    init,
    get,
    put
}