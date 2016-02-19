const synchronizer = require('../');

synchronizer.setConfig({
    multiplicity: 3,
    wait: false
});

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [
        {
            browserName: 'firefox',
            specs: [
                'specs/client_1.js'
            ]
        },
        {
            browserName: 'firefox',
            specs: [
                'specs/client_2.js'
            ]
        },
        {
            browserName: 'firefox',
            specs: [
                'specs/client_3.js'
            ]
        }
    ],
    beforeLaunch: function() {
        synchronizer.init();
    },
    onPrepare: function() {
        synchronizer.init();
        browser.ignoreSynchronization = true;
    }
}
