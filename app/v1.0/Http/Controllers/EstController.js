/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
 	const EstModel = require( _directory_base + '/app/v1.0/Http/Models/EstModel.js' );

 	// Modules
	const Validator = require( 'ferds-validator');
 	
	// Libraries
 	const HelperLib = require( _directory_base + '/app/v1.0/Http/Libraries/HelperLib.js' );

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */

		// Create or update data
		exports.createOrUpdate = ( req, res ) => {
			if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.EST_NAME  ) {
				return res.send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			EstModel.findOne( { 
				WERKS: req.body.WERKS,
				START_VALID: HelperLib.date_format( req.body.START_VALID, 'YYYYMMDD' )
			} ).then( data => {
				// Kondisi belum ada data, create baru dan insert ke Sync List
				if( !data ) {					
					const set = new EstModel( {
						NATIONAL: req.body.NATIONAL || "",
						REGION_CODE: req.body.REGION_CODE || "",
						COMP_CODE: req.body.COMP_CODE || "",
						EST_CODE: req.body.EST_CODE || "",
						EST_NAME: req.body.EST_NAME || "",
						WERKS: req.body.WERKS || "",
						CITY: req.body.CITY || "",
						START_VALID: HelperLib.date_format( req.body.START_VALID, 'YYYYMMDD' ),
						END_VALID: HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ),
						INSERT_TIME: HelperLib.date_format( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_TIME: null,
						UPDATE_TIME: null
					} );

					set.save()
					.then( data => {
						res.send({
							status: true,
							message: 'Success 2',
							data: {}
						});
					} ).catch( err => {
						res.send( {
							status: false,
							message: 'Some error occurred while creating data',
							data: {}
						} );
					} );
					
				}
				// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
				else {
					
					if ( 
						data.NATIONAL != req.body.NATIONAL || 
						data.REGION_CODE != req.body.REGION_CODE || 
						data.COMP_CODE != req.body.COMP_CODE || 
						data.EST_CODE != req.body.EST_CODE || 
						data.EST_NAME != req.body.EST_NAME || 
						data.END_VALID != HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' )
					) {
						var data_update;
						if ( HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ) == '99991231' ) {
							data_update = {
								NATIONAL: req.body.NATIONAL || "",
								REGION_CODE: req.body.REGION_CODE || "",
								COMP_CODE: req.body.COMP_CODE || "",
								EST_CODE: req.body.EST_CODE || "",
								EST_NAME: req.body.EST_NAME || "",
								CITY: req.body.CITY || "",
								END_VALID: HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ),
								UPDATE_TIME: HelperLib.date_format( 'now', 'YYYYMMDDhhmmss' )
							}
						}
						else {
							data_update = {
								NATIONAL: req.body.NATIONAL || "",
								REGION_CODE: req.body.REGION_CODE || "",
								COMP_CODE: req.body.COMP_CODE || "",
								EST_CODE: req.body.EST_CODE || "",
								EST_NAME: req.body.EST_NAME || "",
								CITY: req.body.CITY || "",
								END_VALID: HelperLib.date_format( req.body.END_VALID, 'YYYYMMDD' ),
								DELETE_TIME: HelperLib.date_format( 'now', 'YYYYMMDDhhmmss' )
							}
						}

						EstModel.findOneAndUpdate( { 
							REGION_CODE: req.body.REGION_CODE,
							START_VALID: HelperLib.date_format( req.body.START_VALID, 'YYYYMMDD' )
						}, data_update, { new: true } )
						.then( data => {
							if( !data ) {
								return res.send( {
									status: false,
									message: "Data error updating 2",
									data: {}
								} );
							}
							else {
								res.send({
									status: true,
									message: 'Success',
									data: {}
								});
							}
						}).catch( err => {
							if( err.kind === 'ObjectId' ) {
								return res.send( {
									status: false,
									message: "Data not found 2",
									data: {}
								} );
							}
							return res.send( {
								status: false,
								message: "Data error updating",
								data: {}
							} );
						});
					}
					else {
						res.send( {
							status: true,
							message: 'Skip Update',
							data: {}
						} );
					}
					
				}
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send({
						status: false,
						message: "Data not found 1",
						data: {}
					});
				}
				console.log( err );
				return res.send({
					status: false,
					message: "Error retrieving Data",
					data: {}
				} );
			} );
		};
 	/**
	 * Find
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {

			url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
			var auth = req.auth;
			var location_code_group = auth.LOCATION_CODE.split( ',' );
			var ref_role = auth.REFFERENCE_ROLE;
			var location_code_final = [];
			var key = [];
			var query = {};
				query["END_VALID"] = 99991231;
			
			// Testing
			console.log( auth );




			if ( ref_role != 'ALL' ) {
				location_code_group.forEach( function( data ) {
					console.log( data );
					switch ( ref_role ) {
						case 'REGION_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'COMP_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'AFD_CODE':
							location_code_final.push( data.substr( 0, 4 ) );
						break;
						case 'BA_CODE':
							location_code_final.push( data.substr( 0, 4 ) );
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
					key = ref_role;
					query[key] = location_code_final;
				break;
				case 'AFD_CODE':
					key = 'WERKS';
					query[key] = location_code_final;
				break;
				case 'BA_CODE':
					key = 'WERKS';
					query[key] = location_code_final;
				break;
				case 'NATIONAL':
					key = 'NATIONAL';
					query[key] = 'NATIONAL';
				break;
			}

			EstModel.find( query )
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				EST_NAME: 1,
				CITY: 1,
				LATITUDE: 1,
				LONGITUDE: 1
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				res.send( {
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
		exports.find_all = ( req, res ) => {
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
			
			url_query.END_VALID = 99991231;

			EstModel.find( url_query )
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				EST_NAME: 1,
				CITY: 1
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
		}

		exports.find_one = ( req, res ) => {
			EstModel.findOne( { 
				WERKS: req.params.id 
			} )
			.select( {
				_id: 0,
				NATIONAL: 1,
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				WERKS: 1,
				EST_NAME: 1,
				CITY: 1
			} )
			.then( data => {
				if( !data ) {
					return res.status(404).send({
						status: false,
						message: "Data not found 2 with id " + req.params.id,
						data: {}
					});
				}
				return res.send( {
					status: true,
					message: 'Success',
					data: data
				} );
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.status( 404 ).send({
						status: false,
						message: "Data not found 1 with id " + req.params.id,
						data: {}
					});
				}
				return res.status( 500 ).send({
					status: false,
					message: "Error retrieving Data with id " + req.params.id,
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

			var auth = req.auth;
			var start_date = HelperLib.date_format( req.params.start_date, 'YYYYMMDDhhmmss' );
			var end_date = HelperLib.date_format( req.params.end_date, 'YYYYMMDDhhmmss' );
			var location_code_group = auth.LOCATION_CODE.split( ',' );
			var ref_role = auth.REFFERENCE_ROLE;
			var location_code_final = [];
			var key = [];
			var query = {};
				query["END_VALID"] = 99991231;
			
			if ( ref_role != 'ALL' ) {
				location_code_group.forEach( function( data ) {
					switch ( ref_role ) {
						case 'REGION_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'COMP_CODE':
							location_code_final.push( data.substr( 0, 2 ) );
						break;
						case 'AFD_CODE':
							location_code_final.push( data.substr( 0, 4 ) );
						break;
						case 'BA_CODE':
							location_code_final.push( data.substr( 0, 4 ) );
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
					key = ref_role;
					query[key] = location_code_final;
				break;
				case 'AFD_CODE':
					key = 'WERKS';
					query[key] = location_code_final;
				break;
				case 'BA_CODE':
					key = 'WERKS';
					query[key] = location_code_final;
				break;
				case 'NATIONAL':
					key = 'NATIONAL';
					query[key] = 'NATIONAL';
				break;
			}

			// Set Data
			EstModel.find( 
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
				REGION_CODE: 1,
				COMP_CODE: 1,
				EST_CODE: 1,
				EST_NAME: 1,
				WERKS: 1,
				CITY: 1,
				DELETE_TIME: 1,
				INSERT_TIME: 1,
				UPDATE_TIME: 1
			} )
			.then( data_insert => {
				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];

				data_insert.forEach( function( data ) {

					if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							EST_CODE: data.EST_CODE,
							EST_NAME: data.EST_NAME,
							WERKS: data.WERKS,
							CITY: data.CITY
						} );
					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							EST_CODE: data.EST_CODE,
							EST_NAME: data.EST_NAME,
							WERKS: data.WERKS,
							CITY: data.CITY
						} );
					}

					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							REGION_CODE: data.REGION_CODE,
							COMP_CODE: data.COMP_CODE,
							EST_CODE: data.EST_CODE,
							EST_NAME: data.EST_NAME,
							WERKS: data.WERKS,
							CITY: data.CITY
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