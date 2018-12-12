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

module.exports = ( app ) => {

	// Declare Controllers
	const afdeling = require( '../app/controllers/afdeling.js' );
	const block = require( '../app/controllers/block.js' );
	const comp = require( '../app/controllers/comp.js' );
	const est = require( '../app/controllers/est.js' );
	const region = require( '../app/controllers/region.js' );

	// Routing: Afdeling
	app.post( '/sync/afdeling', afdeling.createOrUpdate );
	app.post( '/afdeling', afdeling.create );
	app.get( '/afdeling', afdeling.find );
	app.get( '/afdeling/:id', afdeling.findOne );
	app.put( '/afdeling/:id', afdeling.update );
	app.delete( '/afdeling/:id', afdeling.delete );

	// Routing: Block
	app.post( '/sync/block', block.createOrUpdate );
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
	app.post( '/sync/est', est.createOrUpdate );
	app.post( '/est', est.create );
	app.get( '/est', est.find );
	app.get( '/est/:id', est.findOne );
	app.put( '/est/:id', est.update );
	app.delete( '/est/:id', est.delete );

	// Routing: Region
	app.post( '/sync/region', region.createOrUpdate );
	app.get( '/sync-mobile/region/:id', verifyToken, region.syncMobile );

	app.post( '/region', region.create );
	app.get( '/region', verifyToken, region.find );
	app.get( '/region/all', region.findAll );
	app.get( '/region/q', region.findAll );
	app.get( '/region/:id', region.findOne );
	app.put( '/region/:id', region.update );
	app.delete( '/region/:id', region.delete );


}