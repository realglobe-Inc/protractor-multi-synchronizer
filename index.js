"use strict";

const argx = require('argx');
const config = require('protractor-multi-synchronizer/config');

module.exports = {
    config: function() {
        return config;
    },
    setConfig: function(kwargs) {
        Object.keys(kwargs).forEach(function(key) {
            config[key] = kwargs[key];
        });
    },
    init: function() {
        let handlerPath = 'protractor-multi-synchronizer/lib/';
        if (!process.send) {
            handlerPath += 'parent.js'
        }
        else {
            handlerPath += 'child.js'
        }
        this.connection = require(handlerPath);
    },
    run: function(values, options, callback) {
        const noop = function(){};
        const args = argx(arguments);
        callback = args.pop('function') || noop;
        options = args.pop('object') || {};
        values = args.remain();

        let onlyRoles = values;
        let exceptRoles = [];
        if (options.only) {
            onlyRoles = onlyRoles.concat(options.only);
        }
        if (options.except) {
            exceptRoles = exceptRoles.concat(options.except);
        }
        if ((onlyRoles.length > 0) && (onlyRoles.indexOf(this.role) == -1)) {
            callback = noop;
        }
        if (exceptRoles.indexOf(this.role) != -1) {
            callback = noop;
        }
        if (options.wait == undefined) {
            options.wait = config.wait;
        }

        const connection = this.connection;
        const role = this.role;
        browser.call(function() {
            connection.run({wait: options.wait, callback: callback});
        }).then(noop, function(e) {
            connection.fail(role);
            fail(e);
        });
    }
};
