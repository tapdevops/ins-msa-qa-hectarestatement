const mongoose = require( 'mongoose' );

const RegionSchema = mongoose.Schema( {
	NATIONAL: String,
	REGION_CODE: String,
	REGION_NAME: String,
	INSERT_TIME_DW: {
		type: Date,
		default: function() {
			return null;
		}
	},
	UPDATE_TIME_DW: {
		type: Date,
		default: function() {
			return null;
		}
	},
	FLAG_UPDATE: {
		type: String,
		default: function() {
			return null;
		}
	}
});

module.exports = mongoose.model( 'Region', RegionSchema, 'TM_REGION' );