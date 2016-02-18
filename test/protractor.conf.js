var synchronizer = require('../');

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
                'specs/firefox.js'
            ]
        },
        {
            browserName: 'chrome',
            specs: [
                'specs/chrome_1.js'
            ]
        },
        {
            browserName: 'chrome',
            specs: [
                'specs/chrome_2.js'
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
