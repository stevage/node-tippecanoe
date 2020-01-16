const tippecanoe = require('.');
jest.mock('shelljs');
const shelljs = require('shelljs');

test('a single layer file works ', () => {
    shelljs.exec = jest.fn(); // automock isn't working for some reason
    tippecanoe('buildings.geojson', { });
    expect(shelljs.exec).toBeCalledWith("tippecanoe  buildings.geojson");
});

test('test everything ', () => {
    shelljs.exec = jest.fn(); // automock isn't working for some reason
    tippecanoe(['buildings.geojson', 'more buildings.geojson'], {
        zg: true,
        notThis: false,
        readParallel: true,
        simplification: 10,
        layer: 'buildings',
        output: 'buildings.mbtiles',
        description: 'Building footprints'
    });
    expect(shelljs.exec).toBeCalledWith("tippecanoe --zg --read-parallel --simplification=10 --layer=buildings --output=buildings.mbtiles --description='Building footprints' buildings.geojson 'more buildings.geojson'");    
});

test('parameters given as arrays should be repeated individually', () => {
    tippecanoe('buildings.geojson', {
        include: ['name', 'id']
    });
    expect(shelljs.exec).toBeCalledWith("tippecanoe --include=name --include=id buildings.geojson");    
});

test.only('named-layer object', () => {
    shelljs.exec = jest.fn();
    tippecanoe(undefined, {
        namedLayer: [{
            file: 'buildings.geojson',
            layer: 'builds',
        }, {
            file: 'roads.geojson',
            layer: 'streets'
        }]
    });
    expect(shelljs.exec).toBeCalledWith(`tippecanoe --named-layer='{"file":"buildings.geojson","layer":"builds"}' --named-layer='{"file":"roads.geojson","layer":"streets"}' `);

});