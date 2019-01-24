const tippecanoe = require('.');
jest.mock('shelljs');
const shelljs = require('shelljs');
shelljs.exec = jest.fn(); // automock isn't working for some reason
test('test everything ', () => {
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