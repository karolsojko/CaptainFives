/**
 * CaptainFives
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */
'use strict';

import mongoose from 'mongoose';

/**
 * Five Schema
 * @type {Schema}
 */
const FiveSchema = mongoose.Schema({
  fromUserId: String,
  toUserId: String,
  fromUserName: String,
  toUserName: String,
  givenOn: Date,
  channel: String
});

FiveSchema.methods = {};

exports.Five = mongoose.model('Five', FiveSchema);
