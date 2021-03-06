"use strict";

const ChildProcess = function() {
    const config = require('protractor-multi-synchronizer/config');
    const client = require('socket.io-client');
    const io = client.connect('http://localhost:' + config.port);
    const jobs = [];
    let aborted = false;

    io.emit('initialize', {pid: process.pid});

    io.on('start', function(data) {
        jobs[data.jobIndex].status = 'running';
    });

    io.on('abort', function(data) {
        if (data.pid == process.pid) {
            aborted = true;
            return;
        }
        fail('role ' + data.role + ' failed');
        aborted = true;
    });

    this.run = function(data) {
        const _this = this;
        browser.call(function() {
            const job = {
                status: 'waiting',
                callback: data.callback
            };
            jobs.push(job);
            io.emit('ready', {pid: process.pid});
            return job;
        }).then(function(job) {
            return browser.wait(function() {
                return (job.status == 'running') || aborted || !data.wait;
            }, jasmine.DEFAULT_TIMEOUT_INTERVAL).then(function() {
                if (!aborted) {
                    job.callback();
                }
                browser.call(function() {
                    io.emit('finish', {pid: process.pid});
                });
            });
        });
    };

    this.fail = function(role) {
        io.emit('fail', {pid: process.pid, role: role});
    };
};

module.exports = new ChildProcess();
