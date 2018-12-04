/**
 * --------------------------------------------------
 * VARIABLE
 * --------------------------------------------------
 */
var test_name = 'REGION';
var data_model = require( '../app/models/region.js' );
var data_dummy = [
	{
		// With Null UPDATE_TIME_DW
		"NATIONAL": "NATIONAL",
		"REGION_CODE": "02",
		"REGION_NAME": "TESTING 1",
		"INSERT_TIME_DW": "2018-01-01 00:00:00",
		"UPDATE_TIME_DW": ""
	},
	{
		// With Null INSERT_TIME_DW
		"NATIONAL": "NATIONAL",
		"REGION_CODE": "02",
		"REGION_NAME": "TESTING 2",
		"INSERT_TIME_DW": "",
		"UPDATE_TIME_DW": "2018-01-01 00:00:00"
	},
	{
		// With Null Date
		"NATIONAL": "NATIONAL",
		"REGION_CODE": "02",
		"REGION_NAME": "TESTING 2",
		"INSERT_TIME_DW": "",
		"UPDATE_TIME_DW": ""
	},
	{
		// With Null Date
		"NATIONAL": "NATIONAL",
		"REGION_CODE": "02",
		"REGION_NAME": "TESTING 2*^*",
		"INSERT_TIME_DW": "",
		"UPDATE_TIME_DW": "7575957575"
	}
];

const date_and_time = require( 'date-and-time' );

/**
 * --------------------------------------------------
 * BEGIN TESTING
 * --------------------------------------------------
 */
describe( test_name, function() {


	// Inserting Data
	// --------------------------------------------------\
	it ( 'INSERTING DATA', function() {

		var i = 1;

		data_dummy.forEach( function( result ) {

			const set = new data_model( {
				NATIONAL: result.NATIONAL || "",
				REGION_CODE: result.REGION_CODE || "",
				REGION_NAME: result.REGION_NAME || "",
				INSERT_TIME_DW: result.INSERT_TIME_DW || "",
				UPDATE_TIME_DW: result.UPDATE_TIME_DW || "",
				FLAG_UPDATE: date_and_time.format( new Date(), 'YYYYMMDD' )
			} );

			set.save()
			.then( data => {
				if ( !data ) {
					console.log( data );
					console.log( '    - INSERTING ' + i + ' -> FAILED' );
				}
				else {
					console.log( '    - INSERTING ' + i + ' -> SUCCESS' );
				}
			} ).catch( err => {
				console.log( '    - INSERTING ' + i + ' -> ERROR' );
			} );

			i++;
		} );

	} );

} );
