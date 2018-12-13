const mongoose = require( 'mongoose' );

const RegionSchema = mongoose.Schema( {
	NATIONAL: String,
	REGION_CODE: String,
	REGION_NAME: String,
	INSERT_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i'
	},
	UPDATE_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i'
	},
	DELETE_TIME: {
		type: Number,
		get: v => Math.floor( v ),
		set: v => Math.floor( v ),
		alias: 'i'
	}
});

module.exports = mongoose.model( 'Region', RegionSchema, 'TM_REGION' );