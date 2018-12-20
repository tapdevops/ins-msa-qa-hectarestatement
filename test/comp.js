/**
 * --------------------------------------------------
 * SETUP VARIABLE
 * --------------------------------------------------
 */
	// Libraries
	const request = require( 'supertest' );
	const app = require( '../app.js' );
	const expect = require( 'chai' ).expect;

	// Setup Testing
	const testing_name = "TEST COMP";
	const url = {}
	const model = require( '../app/models/comp.js' );

	// MENAMPILKAN SELURUH COMP DENGAN PARAMETER
	const data_dummy_test_01 = [ '33', '41', '42' ];

/**
 * --------------------------------------------------
 * BEGIN TESTING
 * --------------------------------------------------
 */
	describe( testing_name, function() {

		// TEST - 01
		// MENAMPILKAN SELURUH COMP DENGAN PARAMETER
		// --------------------------------------------------\
		it ( 'MENAMPILKAN SELURUH COMP DENGAN PARAMETER', function() {
			var key = 'COMP_CODE';
			model.find( {
				COMP_CODE: {
					$in: data_dummy_test_01
				}
			} )
			.select({
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				COMP_NAME: 1,
				ADDRESS: 1
			})
			.then( data => {
				if ( !data ) {
					console.log( 'Error' );
				}
				else {
					console.log( data );
				}
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					console.log( 'ObjectId error' );
				}
				else {
					console.log( 'Error retrieving data' );
				}
			} );

		} );

	} );
