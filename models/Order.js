var mongoose = require('mongoose');
var shortid = require('shortid');

var schema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    members: Array,
    operator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    official_guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    tour_operator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    travel_mode: Boolean,
    currentDay: Object,
    currentWaypoint: mongoose.Schema.Types.Mixed,
    nextWaypoint: mongoose.Schema.Types.Mixed,
    official_guides_count: {
        type: Number,
        default: 1
    },
    hotel_level: {
        type: Number,
        default: 3
    },
    vehicle_type: Number,
    vehicle_make: String,
    vehicle_model: String,
    vehicle_year: Number,
    vehicle_color: String,
    pin: Number,
    timestamp: {type: Date, default: Date.now},
    name: String,
    people: Number,
    generated: Boolean,
    additional_costs: [],
    booked: Boolean,
    ready: Boolean,
    trip: Array,
    destinations: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Destination'
    }],
    start_time: String,
    start_address: {type: String, default: '1 World Way, Los Angeles, CA 90045'},
    end_address: String,
    total: Object,
    paid: Object,
    order_status: {type: String, default: 'Pending'},
    payment_status: {type: String, default: 'Unpaid'},
    canceled: Boolean,
    completed: Boolean,
    hotel_count: Number,
    disputes: [{
        message: String,
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }],
    on_hold: Boolean,
    charge_id: String
});

schema.set('versionKey', false);

module.exports = mongoose.model('Order', schema, 'order');