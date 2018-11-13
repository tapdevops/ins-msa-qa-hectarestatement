module.exports = ( app ) => {

	// Declare Controllers
	const block = require( '../app/controllers/block.js' );
	const afdeling = require( '../app/controllers/afdeling.js' );
	const est = require( '../app/controllers/est.js' );

	// Routing: Block
	app.post( '/block', block.create );
	app.get( '/block', block.find );
	app.get( '/block/:GET_WERKS_AFD_BLOCK_CODE', block.findOne );
	app.put( '/block/:GET_WERKS_AFD_BLOCK_CODE', block.update );
	app.delete( '/block/:GET_WERKS_AFD_BLOCK_CODE', block.delete );

	// Routing: Afdeling
	app.post( '/afdeling', afdeling.create );
	app.get( '/afdeling', afdeling.find );
	app.get( '/afdeling/:GET_WERKS_AFD_CODE', afdeling.findOne );
	app.put( '/afdeling/:GET_WERKS_AFD_CODE', afdeling.update );
	app.delete( '/afdeling/:GET_WERKS_AFD_CODE', afdeling.delete );

	// Routing: Est
	app.post( '/est', est.createOrUpdate );
}