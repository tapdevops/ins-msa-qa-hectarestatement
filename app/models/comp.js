const mongoose = require( 'mongoose' );

const CompSchema = mongoose.Schema( {
	NATIONAL: String,
	REGION_CODE: String,
	COMP_CODE: String,
	COMP_NAME: String,
	ADDRESS: String,
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

module.exports = mongoose.model( 'Comp', CompSchema, 'TM_COMP' );