"use strict";

const synchronizer = require('../../');
const ChatPage = require('./chat_page');

describe('test for socket.io chat example.', function() {
    const chatPage = new ChatPage();

    beforeEach(function() {
        synchronizer.run({wait: true}, function() {
            chatPage.get();
        });
        synchronizer.run({only: 'client_1'}, function() {
            chatPage.login('client_1');
        });
        synchronizer.run({only: 'client_2'}, function() {
            chatPage.login('client_2');
        });
        synchronizer.run({only: 'client_3'}, function() {
            chatPage.login('client_3');
        });
    });

    it('real-time chat.', function() {
        synchronizer.run({wait: true}, function() {
            expect(browser.getTitle()).toEqual('Socket.IO Chat Example');
            expect(chatPage.getLastLogMessage()).toEqual('there are 3 participants');
        });
        synchronizer.run({only: 'client_1'}, function() {
            chatPage.postMessage('Hello!');
        });
        synchronizer.run({only: ['client_2', 'client_3'], wait: true}, function() {
            expect(chatPage.getLastChatMessageUser()).toEqual('client_1');
            expect(chatPage.getLastChatMessageBody()).toEqual('Hello!');
        });
        synchronizer.run({only: 'client_2'}, function() {
            chatPage.postMessage('Hi!');
        });
        synchronizer.run({wait: true}, function() {
            expect(chatPage.getLastChatMessageUser()).toEqual('client_2');
            expect(chatPage.getLastChatMessageBody()).toEqual('Hi!');
        });
    });
});
