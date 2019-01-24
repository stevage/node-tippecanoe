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

function tippecanoe(layerFiles, params, options = {}) {
    function quotify(s) {
        s = String(s);
        return s.match(/\s/) ? `'${s}'` : s;
    }
    function makeParam(k) {
        const val = params[k];
        const param = '--' + kebabCase(k);
        if (val === false) {
            return '';
        } else if (val === true) {
            return param;
        } else {
            return param + `=${quotify(val)}`
        }
    }
    let paramsStr = Object.keys(params).map(makeParam).filter(Boolean).join(' ');
    return shellExec(`tippecanoe ${paramsStr} ${layerFiles.map(quotify).join(' ')}`, options.echo);
}

module.exports = tippecanoe;