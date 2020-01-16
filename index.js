const shell = require('shelljs'), 
    kebabCase = require('kebab-case');

function shellExec(cmd, echo) {
    if (echo) {
        const colors = require('colors');
        console.log(cmd.green);
    }
    shell.exec(cmd);
    return cmd;
}

function tippecanoe(layerFiles=[], params, options = {}) {
    function quotify(s) {
        if (typeof s === 'object') {
            s = JSON.stringify(s);
        } else {
            s = String(s);
        }
        return s.match(/[ "[]/) ? `'${s}'` : s;
    }
    function makeParam(key, value) {
        if (Array.isArray(value)) {
            return value.map(v => makeParam(key, v)).join(' ');
        }
        const param = '--' + kebabCase(key);
        if (value === false) {
            return '';
        } else if (value === true) {
            return param;
        } else {
            return param + `=${quotify(value)}`
        }
    }
    let paramsStr = Object.keys(params)
        .map(k => makeParam(k, params[k]))
        .filter(Boolean)
        .join(' ');
    layerFiles = !Array.isArray(layerFiles) ? [layerFiles] : layerFiles;
   
        
    return shellExec(`tippecanoe ${paramsStr} ${layerFiles.map(quotify).join(' ')}`, options.echo);
}

module.exports = tippecanoe;