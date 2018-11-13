const mongoose = require( 'mongoose' );

const BlockSchema = mongoose.Schema( {
	REGION_CODE: String,
	COMP_CODE: String,
	EST_CODE: String,
	WERKS: String,
	AFD_CODE: String,
	BLOCK_CODE: String,
	BLOCK_NAME: String,
	WERKS_AFD_BLOCK_CODE: String,
	LATITUDE_BLOCK: String,
	LONGITUDE_BLOCKS: String,
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
	}
});

module.exports = mongoose.model( 'Block', BlockSchema, 'TM_BLOCK' );