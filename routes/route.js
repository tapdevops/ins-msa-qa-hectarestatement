const jwt = require( 'jsonwebtoken' );
const config = require( '../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );

function verifyToken( req, res, next ) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	if ( typeof bearerHeader !== 'undefined' ) {
		const bearer = bearerHeader.split( ' ' );
		const bearerToken = bearer[1];

		req.token = bearerToken;
		next();
	}
	else {
		// Forbidden
		res.sendStatus( 403 );
	}
}

function token_verify( req, res, next ) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	if ( typeof bearerHeader !== 'undefined' ) {
		const bearer = bearerHeader.split( ' ' );
		const bearer_token = bearer[1];

		req.token = bearer_token;

		nJwt.verify( bearer_token, config.secret_key, config.token_algorithm, ( err, authData ) => {
			if ( err ) {
				res.send({
					status: false,
					message: "Invalid Token",
					data: []
				} );
			}
			else {
				req.auth = jwtDecode( req.token );
				req.auth.LOCATION_CODE_GROUP = req.auth.LOCATION_CODE.split( ',' );
				req.config = config;
				next();
			}
		} );
		
	}
	else {
		// Forbidden
		res.sendStatus( 403 );
	}
}

module.exports = ( app ) => {

	// Declare Controllers
	const afdeling = require( '../app/controllers/afdeling.js' );
	const block = require( '../app/controllers/block.js' );
	const comp = require( '../app/controllers/comp.js' );
	const est = require( '../app/controllers/est.js' );
	const region = require( '../app/controllers/region.js' );
	const testut = require( '../app/controllers/testut.js' );

	app.get( '/testut', token_verify, testut.find );
	app.post( '/testut', token_verify, testut.createOrUpdate );

	// Routing: Afdeling
	app.post( '/sync/afdeling', afdeling.createOrUpdate );
	app.post( '/afdeling', afdeling.create );
	app.get( '/afdeling', afdeling.find );
	app.get( '/afdeling/:id', afdeling.findOne );
	app.put( '/afdeling/:id', afdeling.update );
	app.delete( '/afdeling/:id', afdeling.delete );

	// Routing: Block
	app.post( '/sync-tap/block', block.createOrUpdate );

	
	app.post( '/block', block.create );
	app.get( '/block', block.find );
	app.get( '/block/:id', block.findOne );
	app.put( '/block/:id', block.update );
	app.delete( '/block/:id', block.delete );

	// Routing: Comp
	app.post( '/sync/comp', comp.createOrUpdate );
	app.post( '/comp', comp.create );
	app.get( '/comp', comp.find );
	app.get( '/comp/:id', comp.findOne );
	app.put( '/comp/:id', comp.update );
	app.delete( '/comp/:id', comp.delete );

	// Routing: Est
	app.get( '/est/all', verifyToken, est.findAll );
	app.get( '/est/q', verifyToken, est.findAll );
	app.post( '/sync-tap/est', verifyToken, est.createOrUpdate );
	app.post( '/sync/est', est.createOrUpdate );
	app.post( '/est', est.create );
	app.get( '/est', est.find );
	app.get( '/est/:id', est.findOne );
	app.put( '/est/:id', est.update );
	app.delete( '/est/:id', est.delete );

	// Routing: Region
	app.get( '/region/all', verifyToken, region.findAll );
	app.get( '/region/q', verifyToken, region.findAll );
	app.post( '/sync-tap/region', verifyToken, region.createOrUpdate );
	app.get( '/sync-mobile/region/:start_date/:end_date', verifyToken, region.syncMobile );
	app.post( '/region', verifyToken, region.create );
	app.get( '/region', verifyToken, region.find );
	app.get( '/region/:id', verifyToken, region.findOne );
	app.put( '/region/:id', verifyToken, region.update );
	app.delete( '/region/:id', verifyToken, region.delete );

}