/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
 	const RegionModel = require( _directory_base + '/app/v1.0/Http/Models/RegionModel.js' );

 	// Modules
	const Validator = require( 'ferds-validator');
 	
	// Libraries
 	const HelperLib = require( _directory_base + '/app/v1.0/Http/Libraries/HelperLib.js' );

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Find
	 * ...
	 * --------------------------------------------------------------------------
	 */
 		exports.find = async ( req, res ) => {
			var auth = req.auth;
			var location_code = auth.LOCATION_CODE;
			var location_code_final = [];
			var ref_role = auth.REFFERENCE_ROLE;
			var location_code = location_code.split( ',' );
			
			if ( ref_role == 'NATIONAL' ) {
				var query = await RegionModel.find().select( { _id:0, NATIONAL: 1, REGION_CODE: 1, REGION_NAME: 1 } );
				res.json({
					status: true,
					message: "Success! ",
					data: query
				})
			}
			else {
				location_code.forEach( function( data ) {
					if ( ref_role == 'REGION_CODE' ) {
						location_code_final.push( data );
					}
					else if ( ref_role == 'COMP_CODE' || ref_role == 'AFD_CODE' || ref_role == 'BA_CODE' ) {
						location_code_final.push( '0' + data.substr( 0, 1 ) );
					}
					
				} );

				var query = await RegionModel.find( {
					REGION_CODE: { $in: location_code_final },
					DELETE_TIME: ""
				} ).select( { _id:0, NATIONAL: 1, REGION_CODE: 1, REGION_NAME: 1 } );

				res.json({
					status: true,
					message: "Success! ",
					data: query
				});
			}

		};

		exports.find_all = async ( req, res ) => {

			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
				url_query.DELETE_TIME = "";

			RegionModel.find( url_query )
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				REGION_NAME: 1
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				return res.send( {
					status: true,
					message: 'Success',
					data: data
				} );
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'Data not found 1',
						data: {}
					} );
				}
				return res.send( {
					status: false,
					message: 'Error retrieving data',
					data: {}
				} );
			} );

		};

	/**
	 * Sync Mobile
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.sync_mobile = ( req, res ) => {

			// Auth Data
			var auth = req.auth;
			var start_date = HelperLib.date_format( req.params.start_date, 'YYYYMMDDhhmmss' );
			var end_date = HelperLib.date_format( req.params.end_date, 'YYYYMMDDhhmmss' );
			var location_code_group = auth.LOCATION_CODE.split( ',' );
			var ref_role = auth.REFFERENCE_ROLE;
			var location_code_final = [];
			var key = [];
			var query = {};
			
			if ( ref_role != 'ALL' ) {
				location_code_group.forEach( function( data ) {
					switch ( ref_role ) {
						case 'REGION_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'COMP_CODE':
							location_code_final.push( '0' + data.substr( 0, 1 ) );
						break;
						case 'AFD_CODE':
							location_code_final.push( '0' + data.substr( 0, 1 ) );
						break;
						case 'BA_CODE':
							location_code_final.push( '0' + data.substr( 0, 1 ) );
						break;
					}
				} );
			}

			switch ( ref_role ) {
				case 'REGION_CODE':
					key = ref_role;
					query[key] = location_code_final;
				break;
				case 'COMP_CODE':
					key = 'REGION_CODE';
					query[key] = location_code_final;
				break;
				case 'AFD_CODE':
					key = 'REGION_CODE';
					query[key] = location_code_final;
				break;
				case 'BA_CODE':
					key = 'REGION_CODE';
					query[key] = location_code_final;
				break;
				case 'NATIONAL':
					key = 'NATIONAL';
					query[key] = 'NATIONAL';
				break;
			}

			// Set Data
			RegionModel.find( 
				query,
				{
					$and: [
						{
							$or: [
								{
									INSERT_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								},
								{
									UPDATE_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								},
								{
									DELETE_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								}
							]
						}
					]
				}
			)
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				REGION_NAME: 1,
				DELETE_TIME: 1,
				INSERT_TIME: 1,
				UPDATE_TIME: 1
			} )
			.then( data_insert => {

				console.log( start_date + ' - ' + end_date );
				console.log(data_insert);

				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];

				data_insert.forEach( function( data ) {

					if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

				} );

				res.json({
					status: true,
					message: 'Data Sync tanggal ' + HelperLib.date_format( req.params.start_date, 'YYYY-MM-DD' ) + ' s/d ' + HelperLib.date_format( req.params.end_date, 'YYYY-MM-DD' ),
					data: {
						"hapus": temp_delete,
						"simpan": temp_insert,
						"ubah": temp_update
					}
				});
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send({
						status: false,
						message: "ObjectId Error",
						data: {}
					});
				}

				return res.send({
					status: false,
					message: "Error",
					data: {}
				} );
			});
			
		}