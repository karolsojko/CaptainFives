/**
 * CaptainFives
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */
'use strict';
import _ from 'lodash';
import { Five } from './models/five';

const captainConfig = require('./config.json');
const SlackBot = require('slackbots');

export default () => {
  captainConfig.token = process.env.SLACK_BOT_TOKEN || captainConfig.token;
  captainConfig.name = process.env.SLACK_BOT_NAME || captainConfig.token;

  const captain = new SlackBot(captainConfig);

  /**
   * Decides whether Captain intervention is needed or not.
   *
   * @param {String} messageText - Text of the message.
   * @returns {boolean} Is captain needed?
   */
  const captainIsNeeded = (messageText) => {
    const captainId = captain.self.id;
    const captainName = captain.self.name;
    const triggers = [captainId, captainName, '/fives'];

    return _.some(triggers, (trigger) => {
      return messageText.toLowerCase().indexOf(trigger.toLowerCase()) > -1;
    });
  };


  /**
   * Gets five count for each user and send them to the proper channel.
   *
   * @param {Object} message      - Message object.
   * @param {Array<String>} users - List of users requested.
   */
  const sendFiveCount = (message, users) => {
    const channelId = message.channel;
    const params = {
      as_user: true
    };

    _.forEach(users, (user) => {
      Five.count({
        toUserId: user
      }, (error, count) => {
        if (error) {
          console.log('Error getting fives counts for: ' + user);
        } else {
          const message = `<@${user}>'s fives count is ${count}.`;
          captain.postMessage(channelId, message, params);
        }
      })
    });
  };


  /**
   * Registers a new five in the DB.
   *
   * @param {Object} message  - Message object.
   * @param {String} userId   - Five receiver user id
   */
  const createNewFive = (message, userId) => {
    const fromUser = _.find(captain.users, { id: message.user });
    const toUser = _.find(captain.users, { id: userId });

    Five.create({
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      fromUserName: fromUser.name,
      toUserName: toUser.name,
      givenOn: new Date(),
      channel: message.channel
    }, (error, result) => {
      if (error) {
        console.log('Error saving five: ', message);
      }
    })
  };


  /**
   * If the captain is needed, let him handle the situation.
   *
   * @param {Object} message - Message object.
   */
  const handleMessage = (message) => {
    const isFive = message.text.toLowerCase().indexOf('/five') > -1;
    const userRegEx = /[^<@\]]+(?=>)/g;
    const usersMentioned = _.without(message.text.match(userRegEx), captain.self.id);

    if (isFive) {
      _.forEach(usersMentioned, (userId) => {
        createNewFive(message, userId);
      });
    } else if (usersMentioned.length > 0) {
      sendFiveCount(message, usersMentioned);
    }
  };


  /**
   * Handle message event.
   */
  captain.on('message', (message) => {
    const isMessage = message.type === 'message' && !message.subtype;

    if (isMessage && captainIsNeeded(message.text)) {
      handleMessage(message);
    }
  });

  captain.on('start', () => {
    console.log('Captain is watching.');
  });
};
