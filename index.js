const shell = require('shelljs'), 
    kebabCase = require('kebab-case');
const colors = require('colors');

function shellExec(args, echo) {
    const cmd = `tippecanoe ${args.join(' ')}`;
    if (echo) {
        console.log(cmd.green);
    }
    shell.exec(cmd);
    return cmd;
}

function execAsync(args, echo) {
    const spawn = require('child-process-promise').spawn;
    if (echo) {
        console.log(`tippecanoe ${args.join(' ')}`.green);
    }
    const promise = spawn('tippecanoe', args);
    promise.childProcess.stderr.pipe(process.stdout);
    return promise;
}

function tippecanoe(layerFiles=[], params, options = {}) {
    function quotify(s) {
        if (typeof s === 'object') {
            s = JSON.stringify(s);
        } else {
            s = String(s);
        }
        return !options.async && s.match(/[ "[]/) ? `'${s}'` : s;
    }
    function makeParam(key, value) {
        if (Array.isArray(value)) {
            return value.map(v => makeParam(key, v)).join(' ');
        }
        if (value === false) { // why do we do this?
            return '';
        }
        const short = key.length <= 2;
        const param = short ? `-${key}` : `--${kebabCase(key)}`;
        if (value === true) {
            return param;
        }
        return short ? `${param}${quotify(value)}` : `${param}=${quotify(value)}`
    }
    let paramStrs = Object.keys(params)
        .map(k => makeParam(k, params[k]))
        .filter(Boolean)
    layerFiles = !Array.isArray(layerFiles) ? [layerFiles] : layerFiles;
   
    // const cmd = `tippecanoe ${paramsStr} ${layerFiles.map(quotify).join(' ')}`;
    const args = [...paramStrs, ...layerFiles.map(quotify)];
    if (options.async) {
        return execAsync(args, options.echo);
    } else {
        return shellExec(args, options.echo);
    }
}

module.exports = tippecanoe;
tippecanoe.tippecanoeSync = (layerFiles, params, options = {}) => tippecanoe(layerFiles, params, {...options, async: false });
tippecanoe.tippecanoeAsync = (layerFiles, params, options = {}) => tippecanoe(layerFiles, params, {...options, async: true });