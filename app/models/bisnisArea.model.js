const mongoose = require( 'mongoose' );

const BisnisAreaSchema = mongoose.Schema( {
	ba_code: String,
	nama_area: String,
}, {
	timestamp: true
} );

module.exports = mongoose.model( 'BisnisArea', BisnisAreaSchema, 'tm_ba' );