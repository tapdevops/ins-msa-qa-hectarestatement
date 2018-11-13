const mongoose = require( 'mongoose' );

const AfdelingSchema = mongoose.Schema( {
	REGION_CODE: String,
	COMP_CODE: String,
	EST_CODE: String,
	WERKS: String,
	AFD_CODE: String,
	AFD_NAME: String,
	WERKS_AFD_CODE: String,
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
	INSERT_USER: String,
	INSERT_TIME: {
		type: Date,
		default: function() {
			return null;
		}
	},
	UPDATE_USER: String,
	UPDATE_TIME: {
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

module.exports = mongoose.model( 'Afdeling', AfdelingSchema, 'TM_AFD' );