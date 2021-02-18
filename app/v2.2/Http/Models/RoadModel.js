const mongoose = require('mongoose');

const RoadSchema = mongoose.Schema({
    ID: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    COMPANY_CODE: String,
    WERKS: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    AFDELING_CODE: String,
    BLOCK_CODE: String,
    ROAD_CODE: String,
    ROAD_NAME: String,
    STATUS_PEKERASAN: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    STATUS_AKTIF: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    DELETED_AT: { type: Date, default: null },
    CREATED_AT: { type: Date, default: null },
    UPDATED_AT: { type: Date, default: null },
    ESTATE_CODE: String,
    UPDATED_BY: String,
    TOTAL_LENGTH:{
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    ASSET_CODE: String,
    SEGMENT: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    STATUS_ID: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    STATUS_NAME: String,
    CATEGORY_ID: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	},
    CATEGORY_NAME: String,
    COMPANY_NAME: String,
    ESTATE_NAME: String,
    AFDELING_NAME: String,
    BLOCK_NAME: String,
    BLOCK_ID: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return null;
		}
	}, 
});

module.exports = mongoose.model('Road_v_2_2', RoadSchema, 'TM_ROAD');
