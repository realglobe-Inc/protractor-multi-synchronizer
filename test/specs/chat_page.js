"use strict";

var ChatPage = function() {
    var usernameInput = $('.usernameInput');
    var inputMessage = $('.inputMessage');
    var logMessages = $$('.chatArea .messages .log');
    var chatMessages = $$('.chatArea .messages .message');

    this.get = function() {
        browser.get('http://localhost:3000');
    };

    this.login = function(name) {
        usernameInput.sendKeys(name).sendKeys(protractor.Key.ENTER);
    };

    this.getLastLogMessage = function() {
        return logMessages.last().getText();
    };

    this.getLastChatMessageUser = function() {
        return chatMessages.last().$('.username').getText();
    };

    this.getLastChatMessageBody = function() {
        return chatMessages.last().$('.messageBody').getText();
    };

    this.postMessage = function(message) {
        inputMessage.sendKeys(message).sendKeys(protractor.Key.ENTER);
    };
}

module.exports = ChatPage;
