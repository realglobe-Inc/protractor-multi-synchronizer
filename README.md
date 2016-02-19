# protractor-multi-synchronizer

![Build Status](https://travis-ci.com/realglobe-Inc/protractor-multi-synchronizer.svg?token=N9bn3XyaYHv9C82Qt4Hu&branch=master)

Protractor helper lib for real-time web app.

## Installation

```sh
npm install protractor-multi-synchronizer
```

## Usage

`protractor.conf.js`

```js
var synchronizer = require('protractor-multi-synchronizer');
synchronizer.setConfig({
    multiplicity: 3, // number of multiCapabilities. default is 2
    port: 8765, // socket.io port. default is 8765
    wait: true  // wait other processes on synchronizer.run(). default is true.
});

exports.config = {
    // ...

    multiCapabilities: [
        {
            browserName: 'firefox',
            specs: [
                '/path/to/spec/for/firefox.js'
            ]
        },
        {
            browserName: 'chrome',
            specs: [
                '/path/to/spec/for/chrome.js'
            ]
        },
        {
            browserName: 'safari',
            specs: [
                '/path/to/spec/for/safari.js'
            ]
        }
    ],
    beforeLaunch: function() {
        synchronizer.init(); // initialize parent process.
    },
    onPrepare: function() {
        synchronizer.init(); // initialize child processes.
    }

    // ...
}
```

`/path/to/spec/for/firefox.js`

```js
"use strict";

var synchronizer = require('protractor-multi-synchronizer');
synchronizer.role = 'firefox';

require('./shared_test');
```

`/path/to/spec/for/chrome.js`

```js
"use strict";

var synchronizer = require('protractor-multi-synchronizer');
synchronizer.role = 'chrome';

require('./shared_test');
```

`/path/to/spec/for/safari.js`

```js
"use strict";

var synchronizer = require('protractor-multi-synchronizer');
synchronizer.role = 'safari';

require('./shared_test');
```

`/path/to/spec/for/shared_test.js`

```js
"use strict";

var synchronizer = require('protractor-multi-synchronizer');

describe('test for real-time chat app.', function() {
    beforeEach(function() {
        // wait for all children is ready.
        synchronizer.run({wait: true}, function() {
            browser.get('http://test.example.com');
        });

        // don't wait other children.
        synchronizer.run({wait: false}, function() {
            expect(browser.getTitle()).toBe('My Chat App');
        });

        // wait if (config.wait == true)
        synchronizer.run(function() {
            // open chat window.
        });
    });

    it('like real-time chat', function() {
        // run only 'firefox' role.
        synchronizer.run({only: 'firefox'}, function() {
            // post message.
        });

        // run only 'firefox' or 'chrome' role.
        synchronizer.run({only: ['chrome', 'safari']}, function() {
            // receive message.
        });

        // run only 'chrome' or 'safari' role.
        synchronizer.run('chrome', 'safari', function() {
            // mark as read.
        });

        // run only 'safari' role.
        synchronizer.run({except: ['firefox', 'chrome']}, function() {
            // reply.
        });
    });
});
```
