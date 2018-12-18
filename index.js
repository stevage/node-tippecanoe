const shell = require('shelljs'), 
    kebabCase = require('kebab-case');

function shellExec(cmd, echo) {
    if (echo) {
        const colors = require('colors');
        console.log(cmd.green);
    }
    shell.exec(cmd);
}

function tippecanoe(layerFiles, params, options = {}) {
    function prop(k) {
        if (params[k] === false) {
            return '';
        }
        const predicate = params[k] === true ? '' : `=${params[k]}`;
        return '--' + kebabCase(k) + predicate;
    }
    let paramsStr = Object.keys(params).map(prop).join(' ');
    shellExec(`tippecanoe ${paramsStr} ${layerFiles.join(' ')}`, options.echo);
    return cmd;
}

module.exports = tippecanoe;