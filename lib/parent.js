"use strict";

const config = require('protractor-multi-synchronizer/config');

const ParentProcess = function() {
    const io = require('socket.io')(config.port);
    const children = {};

    function _runNextJob(jobIndex) {
        const childPids = Object.keys(children);

        if (childPids.length < config.multiplicity) {
            return;
        }

        const isReady = childPids.every(function(childPid) {
            const jobs = children[childPid].jobs;
            if (jobs.length < jobIndex + 1) {
                return false;
            }
            return jobs.slice(0, jobIndex).every(function(job) {
                return job.status == 'finished';
            });
        });

        if (isReady) {
            childPids.forEach(function(childPid) {
                const child = children[childPid];
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
            const child = children[data.pid];
            const job = {
                status: 'waiting'
            };
            child.jobs.push(job);
            _runNextJob(child.jobs.length - 1);
        });

        socket.on('finish', function(data) {
            const child = children[data.pid];
            child.jobs[child.jobs.length - 1].status = 'finished';
            _runNextJob(child.jobs.length);
        });

        socket.on('fail', function(data) {
            const childPids = Object.keys(children);
            childPids.forEach(function(childPid) {
                const child = children[childPid];
                child.socket.emit('abort', {pid: data.pid, role: data.role});
            });
        });
    });
}

module.exports = new ParentProcess();
