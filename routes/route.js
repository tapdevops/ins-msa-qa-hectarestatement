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
	const landUse = require( '../app/controllers/landUse.js' );

	// Routing: Land Use
	app.get( '/land-use/all', token_verify, landUse.findAll );
	app.get( '/land-use/q', token_verify, landUse.findAll );
	app.get( '/report/land-use/:id', token_verify, landUse.findOneForReport );

	app.get( '/land-use/q', token_verify, landUse.findAll );
	app.get( '/land-use', token_verify, landUse.find );
	app.post( '/sync-tap/land-use', token_verify, landUse.createOrUpdate );
	app.get( '/sync-mobile/land-use/:start_date/:end_date', token_verify, landUse.syncMobile );

	// Routing: Afdeling
	app.get( '/afdeling/all', token_verify, afdeling.findAll );
	app.get( '/afdeling/q', token_verify, afdeling.findAll );
	app.post( '/sync-tap/afdeling', afdeling.createOrUpdate );
	app.get( '/sync-mobile/afdeling/:start_date/:end_date', token_verify, afdeling.syncMobile );
	app.get( '/afdeling', token_verify, afdeling.find );


	app.post( '/afdeling', afdeling.create );
	
	app.get( '/afdeling/:id', afdeling.findOne );
	app.put( '/afdeling/:id', afdeling.update );
	app.delete( '/afdeling/:id', afdeling.delete );

	// Routing: Block
	app.get( '/block/all', token_verify, block.findAll );
	app.get( '/block/q', token_verify, block.findAll );
	app.post( '/sync-tap/block', block.createOrUpdate );
	app.get( '/sync-mobile/block/:start_date/:end_date', token_verify, block.syncMobile );
	app.get( '/block', token_verify, block.find );

	
	app.post( '/block', block.create );
	app.get( '/block/:id', block.findOne );
	app.put( '/block/:id', block.update );
	app.delete( '/block/:id', block.delete );
	
	


	



	// Routing: Comp
	app.get( '/comp/all', token_verify, comp.findAll );
	app.get( '/comp/q', token_verify, comp.findAll );
	app.post( '/sync-tap/comp', token_verify, comp.createOrUpdate );
	app.get( '/sync-mobile/comp/:start_date/:end_date', token_verify, comp.syncMobile );
	app.delete( '/comp/:id', token_verify, comp.delete );
	app.get( '/comp', token_verify, comp.find );




	app.post( '/comp', comp.create );
	
	app.get( '/comp/:id', comp.findOne );
	app.put( '/comp/:id', comp.update );






	// Routing: Est
	app.get( '/est/all', token_verify, est.findAll );
	app.get( '/est/q', token_verify, est.findAll );
	app.post( '/sync-tap/est', verifyToken, est.createOrUpdate );

	app.get( '/sync-mobile/est/:start_date/:end_date', token_verify, est.syncMobile );
	app.get( '/est', token_verify, est.find );

	app.post( '/est', est.create );
	
	app.get( '/est/:id', est.findOne );
	app.put( '/est/:id', est.update );
	app.delete( '/est/:id', est.delete );

	// Routing: Region
	app.get( '/region/all', verifyToken, region.findAll );
	app.get( '/region/q', verifyToken, region.findAll );
	app.post( '/sync-tap/region', verifyToken, region.createOrUpdate );


	app.get( '/sync-mobile/region/:start_date/:end_date', token_verify, region.syncMobile );
	app.post( '/region', verifyToken, region.create );
	app.get( '/region', token_verify, region.find );
	app.get( '/region/:id', verifyToken, region.findOne );
	app.put( '/region/:id', verifyToken, region.update );
	app.delete( '/region/:id', verifyToken, region.delete );

	// Geometry
	app.get( '/geom/design/block/:id', block.findSKMDesignGeoJSON );

}