/*
|--------------------------------------------------------------------------
| APP Setup
|--------------------------------------------------------------------------
*/
	// Node Modules
	const bodyParser = require( 'body-parser' );
	const express = require( 'express' );
	const mongoose = require( 'mongoose' );

	// Primary Variable
	const app = express();

	// Config
	const config = {};
		  config.app = require( './config/config.js' );
		  config.database = require( './config/database.js' )[config.app.env];

/*
|--------------------------------------------------------------------------
| Global APP Init
|--------------------------------------------------------------------------
*/
	global._directory_base = __dirname;

/*
|--------------------------------------------------------------------------
| APP Init
|--------------------------------------------------------------------------
*/
	// Routing Folder SKM Design
	app.use( '/skm-design-block/', express.static( 'assets/geo-json/SKM_DESIGN_BLOCK' ) );

	// Parse request of content-type - application/x-www-form-urlencoded
	app.use( bodyParser.urlencoded( { extended: false } ) );

	// Parse request of content-type - application/json
	app.use( bodyParser.json() );

	// Setup Database
	mongoose.Promise = global.Promise;
	mongoose.connect( config.database.url, {
		useNewUrlParser: true,
		ssl: config.database.ssl
	} ).then( () => {
		console.log( 'Successfully connected to the Database' );
	} ).catch( err => {
		console.log( 'Could not connect to the Database. Exiting application.' )
	} );
	
	// Server Running Message
	app.listen( config.app.port, () => {
		console.log( 'Server ' + config.app.name + ' Berjalan di port ' + config.app.port );
	} );

	// Routing
	app.get( '/', ( req, res ) => {
		res.json( { 'message': config.app.name, 'date': '28 March 2019'  } )
	} );

	require( './routes/route.js' )( app );
	module.exports = app;