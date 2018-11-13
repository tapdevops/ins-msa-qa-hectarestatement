const mongoose = require( 'mongoose' );

const EstSchema = mongoose.Schema( {
	NATIONAL: String,
	REGION_CODE: String,
	COMP_CODE: String,
	EST_CODE: String,
	WERKS: String,
	EST_NAME: String,
	START_VALID: {
		type: Date,
		default: function() {
			return null;
		}
	},
	END_VALID: {
		type: Date,
		default: function() {
			return null;
		}
	},
	CITY: String
});

module.exports = mongoose.model( 'Est', EstSchema, 'TM_EST' );