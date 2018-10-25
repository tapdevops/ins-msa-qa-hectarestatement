/**
 * Data Area
 * 
 * 
 *
 * @author Ferdinand
 * @version 1.0.0
 * @since 2014-10-24
 */

// Import Express
const express = require( 'express' );

// Import Mongoose
const mongoose = require( 'mongoose' );

// Import Body Parser
const bodyParser = require( 'body-parser' );

// Configuring the Database
const dbConfig = require( './config/database.config.js' );

// Define App
const app = express();

// Define Port
const port = process.env.PORT || 3000;

// Parse request of content-type - application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: true } ) )

// Parse request of content-type - application/json
app.use( bodyParser.json() )

// Setup Database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect( dbConfig.url, {
	useNewUrlParser: true,
	ssl: true
} ).then( () => {
	console.log( 'Successfully connected to the Database' );
} ).catch( err => {
	console.log( 'Could not connect to the Database. Exiting application.' )
} );

// Server Running Message
app.listen( port, () => {
	console.log( 'RESThub Mobile Inspection - Area running on ' + port )
} );

// Routes
app.get( '/', ( req, res ) => {
	res.json( { 'message': 'RESThub Mobile Inspection - Area' } )
} );

// Require Bisnis Area Routes
require( './app/routes/bisnisArea.route.js' )( app );