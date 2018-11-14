module.exports = ( app ) => {

	// Declare Controllers
	const block = require( '../app/controllers/block.js' );
	const afdeling = require( '../app/controllers/afdeling.js' );
	const est = require( '../app/controllers/est.js' );
	const comp = require( '../app/controllers/comp.js' );
	const region = require( '../app/controllers/region.js' );

	// Routing: Block
	app.post( '/sync/block', block.createOrUpdate );
	app.post( '/block', block.create );
	app.get( '/block', block.find );
	app.get( '/block/:GET_WERKS_AFD_BLOCK_CODE', block.findOne );
	app.put( '/block/:GET_WERKS_AFD_BLOCK_CODE', block.update );
	app.delete( '/block/:GET_WERKS_AFD_BLOCK_CODE', block.delete );

	// Routing: Afdeling
	app.post( '/sync/afdeling', afdeling.createOrUpdate );
	app.post( '/afdeling', afdeling.create );
	app.get( '/afdeling', afdeling.find );
	app.get( '/afdeling/:GET_WERKS_AFD_CODE', afdeling.findOne );
	app.put( '/afdeling/:GET_WERKS_AFD_CODE', afdeling.update );
	app.delete( '/afdeling/:GET_WERKS_AFD_CODE', afdeling.delete );

	// Routing: Est
	app.post( '/sync/est', est.createOrUpdate );

	// Routing: Comp
	app.post( '/sync/comp', comp.createOrUpdate );

	// Routing: Region
	app.post( '/sync/region', region.createOrUpdate );
}