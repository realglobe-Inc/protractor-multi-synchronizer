"use strict";

var synchronizer = require('../../');
var ChatPage = require('./chat_page');

describe('test for socket.io chat example.', function() {
    var chatPage = new ChatPage();

    beforeEach(function() {
        synchronizer.run({wait: true}, function() {
            chatPage.get();
        });
        synchronizer.run({only: 'firefox'}, function() {
            chatPage.login('firefox');
        });
        synchronizer.run({only: 'chrome_1'}, function() {
            chatPage.login('chrome_1');
        });
        synchronizer.run({only: 'chrome_2'}, function() {
            chatPage.login('chrome_2');
        });
    });

    it('real-time chat.', function() {
        synchronizer.run({wait: true}, function() {
            expect(browser.getTitle()).toEqual('Socket.IO Chat Example');
            expect(chatPage.getLastLogMessage()).toEqual('there are 3 participants');
        });
        synchronizer.run({only: 'firefox'}, function() {
            chatPage.postMessage('Hello!');
        });
        synchronizer.run({only: ['chrome_1', 'chrome_2'], wait: true}, function() {
            expect(chatPage.getLastChatMessageUser()).toEqual('firefox');
            expect(chatPage.getLastChatMessageBody()).toEqual('Hello!');
        });
        synchronizer.run({only: 'chrome_1'}, function() {
            chatPage.postMessage('Hi!');
        });
        synchronizer.run({wait: true}, function() {
            expect(chatPage.getLastChatMessageUser()).toEqual('chrome_1');
            expect(chatPage.getLastChatMessageBody()).toEqual('Hi!');
        });
    });
});
