'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Beer Schema
 */
var BeerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Beer name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
    },
    bestBefore: {
        type: Date,
        default: Date.now
    },
    brewery: {
        type: String,
        default: '',
        trim: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

mongoose.model('Beer', BeerSchema);