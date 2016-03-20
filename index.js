/**
 * CaptainFives
 * @author Kelvin De Moya <kelvin.demoya@x-team.com>
 */
'use strict';
import mongoose from 'mongoose';
import captainBot from './app/captain';

mongoose.connect('mongodb://localhost/captain-fives');
captainBot();
