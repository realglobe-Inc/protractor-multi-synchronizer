"use strict";

var config = require('protractor-multi-synchronizer/config');

var ParentProcess = function() {
    var io = require('socket.io')(config.port);
    var children = {};

    function _runNextJob(jobIndex) {
        var childPids = Object.keys(children);

        if (childPids.length < config.multiplicity) {
            return;
        }

        var isReady = childPids.every(function(childPid) {
            var jobs = children[childPid].jobs;
            if (jobs.length < jobIndex + 1) {
                return false;
            }
            return jobs.slice(0, jobIndex).every(function(job) {
                return job.status == 'finished';
            });
        });

        if (isReady) {
            childPids.forEach(function(childPid) {
                var child = children[childPid];
                child.socket.emit('start', {jobIndex: jobIndex});
            });
        }
    }

    io.on('connection', function(socket) {
        socket.on('initialize', function(data) {
            children[data.pid] = {
                socket: socket,
                jobs: []
            };
        });

        socket.on('ready', function(data) {
            var child = children[data.pid];
            var job = {
                status: 'waiting'
            };
            child.jobs.push(job);
            _runNextJob(child.jobs.length - 1);
        });

        socket.on('finish', function(data) {
            var child = children[data.pid];
            child.jobs[child.jobs.length - 1].status = 'finished';
            _runNextJob(child.jobs.length);
        });

        socket.on('fail', function(data) {
            var childPids = Object.keys(children);
            childPids.forEach(function(childPid) {
                var child = children[childPid];
                child.socket.emit('abort', {pid: data.pid, role: data.role});
            });
        });
    });
}

module.exports = new ParentProcess();
