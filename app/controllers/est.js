const estModel = require( '../models/est.js' );
const querystring = require('querystring');
const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );
const Client = require('node-rest-client').Client; 
const moment_pure = require( 'moment' );
const moment = require( 'moment-timezone' );
const date = require( '../libraries/date.js' );

exports.findAll = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
			
			url_query.DELETE_TIME = "";

			estModel.find( url_query )
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
		}
	} );

};

exports.syncMobile = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
			var auth = jwtDecode( req.token );
			var location_code = auth.LOCATION_CODE;
			var location_code = location_code.split( ',' );
			var location_code_final = [];

			location_code.forEach( function( data ) {
				location_code_final.push( '0' + data.substr( 0, 1 ) );
			} );

			var date_target = req.params.id;
			var today = moment( date_target, "YYYY-MM-DD" ).startOf( 'day' );
			var tomorrow = moment( today ).endOf( 'day' );
			var data_sync = [];

			// Select All (Insert Update Delete)
			estModel.find( { 
				REGION_CODE: { $in: location_code_final },
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: today.toDate(),
									$lt: tomorrow.toDate()
								}
							},
							{
								UPDATE_TIME: {
									$gte: today.toDate(),
									$lt: tomorrow.toDate()
								}
							},
							{
								DELETE_TIME: {
									$gte: today.toDate(),
									$lt: tomorrow.toDate()
								}
							}
						]
					}
				]
			} ).then( data_insert => {

				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];

				data_insert.forEach( function( data ) {
					var convert_date = {
						INSERT_TIME: moment( data.INSERT_TIME ).format( "YYYY-MM-DD" ),
						UPDATE_TIME: moment( data.UPDATE_TIME ).format( "YYYY-MM-DD" ),
						DELETE_TIME: moment( data.DELETE_TIME ).format( "YYYY-MM-DD" ),
					};

					if ( convert_date.INSERT_TIME == date_target ) {
						temp_insert.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

					if ( convert_date.UPDATE_TIME == date_target ) {
						temp_update.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

					if ( convert_date.DELETE_TIME == date_target ) {
						temp_delete.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

				} );

				res.json( {
					status: true,
					message: "Success",
					data: {
						"insert": temp_insert,
						"update": temp_update,
						"delete": temp_delete
					}
				} );
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.status( 404 ).send({
						status: false,
						message: "Data not found 1",
						data: {}
					});
				}

				return res.status( 500 ).send({
					status: false,
					message: "Error retrieving Data",
					data: {}
				} );
			} );
		}
	} );
	
}



// Create and Save new Data
exports.create = ( req, res ) => {

	if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.EST_NAME  ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	const set = new estModel({
		NATIONAL: req.body.NATIONAL || "",
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		WERKS: req.body.WERKS || "",
		EST_NAME: req.body.EST_NAME || "",
		START_VALID: req.body.START_VALID || "",
		END_VALID: req.body.END_VALID || "",
		CITY: req.body.CITY || "",
		INSERT_TIME_DW: req.body.INSERT_TIME_DW || "",
		UPDATE_TIME_DW: req.body.UPDATE_TIME_DW || "",
		FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
	});

	set.save()
	.then( data => {
		if ( !data ) {
			res.send({
				status: false,
				message: 'Failed',
				data: {}
			});
		}
		res.send({
			status: true,
			message: 'Successs',
			data: data
		});
	} ).catch( err => {
		res.status( 500 ).send( {
			status: false,
			message: 'Some error occurred while creating data',
			data: {}
		} );
	} );
	
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	
	if ( url_query_length > 0 ) {

		estModel.find( url_query )
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
				return res.status( 404 ).send( {
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
				return res.status( 404 ).send( {
					status: false,
					message: 'Data not found 1',
					data: {}
				} );
			}
			return res.status( 500 ).send( {
				status: false,
				message: 'Error retrieving data',
				data: {}
			} );
		} );
	}
	else {
		estModel.find()
		.then( data => {
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		} ).catch( err => {
			res.status( 500 ).send( {
				status: false,
				message: err.message || "Some error occurred while retrieving data.",
				data: {}
			} );
		} );
	}

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	estModel.findOne( { 
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
		res.send( {
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

// Update single data with ID
exports.update = ( req, res ) => {

	// Validation
	estModel.findOneAndUpdate( { 
		WERKS : req.params.id 
	}, {
		NATIONAL: req.body.NATIONAL || "",
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		EST_NAME: req.body.EST_NAME || "",
		CITY: req.body.CITY || "",
		UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
	}, { new: true } )
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
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 1 with id " + req.params.id,
				data: {}
			} );
		}
		res.send( {
			status: true,
			message: 'Success',
			data: data
		} );
	}).catch( err => {
		if( err.kind === 'ObjectId' ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.id,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Data error updating with id " + req.params.id,
			data: {}
		} );
	});
};

// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	estModel.findOneAndUpdate( { 
		WERKS: req.params.id
	}, {
		DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
	}, { new: true } )
	.then( data => {
		if( !data ) {
			return res.send( {
				status: false,
				message: "Data failed to delete",
				data: {}
			} );
		}
		else {
			return res.send({
				status: true,
				message: 'Data successfully deleted',
				data: {}
			});
		}
	}).catch( err => {
		if( err.kind === 'ObjectId' ) {
			return res.send( {
				status: false,
				message: "ObjectID Error",
				data: {}
			} );
		}
		return res.send( {
			status: false,
			message: "Error",
			data: {}
		} );
	});
};













/*
|--------------------------------------------------------------------------
| Clear Function
|--------------------------------------------------------------------------
*/
	// Create or update data
	exports.createOrUpdate = ( req, res ) => {
		
		nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
			if ( err ) {
				res.sendStatus( 403 );
			}
			else {
				if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.EST_NAME  ) {
					return res.send({
						status: false,
						message: 'Invalid input',
						data: {}
					});
				}

				estModel.findOne( { 
					WERKS: req.body.WERKS,
					START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' )
				} ).then( data => {
					// Kondisi belum ada data, create baru dan insert ke Sync List
					if( !data ) {
						
						const set = new estModel( {
							NATIONAL: req.body.NATIONAL || "",
							REGION_CODE: req.body.REGION_CODE || "",
							COMP_CODE: req.body.COMP_CODE || "",
							EST_CODE: req.body.EST_CODE || "",
							EST_NAME: req.body.EST_NAME || "",
							WERKS: req.body.WERKS || "",
							CITY: req.body.CITY || "",
							START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' ),
							END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
							INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
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
							data.END_VALID != date.convert( req.body.END_VALID, 'YYYYMMDD' )
						) {
							var data_update;
							if ( date.convert( req.body.END_VALID, 'YYYYMMDD' ) == '99991231' ) {
								data_update = {
									NATIONAL: req.body.NATIONAL || "",
									REGION_CODE: req.body.REGION_CODE || "",
									COMP_CODE: req.body.COMP_CODE || "",
									EST_CODE: req.body.EST_CODE || "",
									EST_NAME: req.body.EST_NAME || "",
									CITY: req.body.CITY || "",
									END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
									UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
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
									END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
									DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
								}
							}

							estModel.findOneAndUpdate( { 
								REGION_CODE: req.body.REGION_CODE,
								START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' )
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

					return res.send({
						status: false,
						message: "Error retrieving Data",
						data: {}
					} );
				} );
			}
		} );
	};