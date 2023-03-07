const { Router } = require('express');

const { viewChat, addMessage } = require('../controller/chatController');

const chatRouter = Router();
chatRouter.get(`/`, viewChat);
chatRouter.post('/', addMessage);

module.exports = chatRouter;
