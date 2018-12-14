const regionModel = require( '../models/region.js' );
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

			regionModel.find( url_query )
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

			var start_date = date.convert( req.params.start_date, 'YYYYMMDD' ) + '000000';
			var end_date = date.convert( req.params.end_date, 'YYYYMMDD' ) + '235959';

			var data_sync = [];

			console.log( parseInt( start_date ) + '/' + parseInt( end_date ) );
			

			// Select All (Insert Update Delete)
			regionModel.find( { 
				REGION_CODE: { $in: location_code_final },
				$and: [
					{
						$or: [
							{
								INSERT_TIME: {
									$gte: parseInt( start_date ),
									$lt: parseInt( end_date )
								}
							},
							{
								UPDATE_TIME: {
									$gte: parseInt( start_date ),
									$lt: parseInt( end_date )
								}
							},
							{
								DELETE_TIME: {
									$gte: parseInt( start_date ),
									$lt: parseInt( end_date )
								}
							}
						]
					}
				]
			} ).then( data_insert => {
				console.log( data_insert );

				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];

				data_insert.forEach( function( data ) {
					var convert_date = {
						INSERT_TIME: parseInt( date.convert( String( data.INSERT_TIME ), 'YYYYMMDD' ) ),
						UPDATE_TIME: parseInt( date.convert( String( data.UPDATE_TIME ), 'YYYYMMDD' ) ),
						DELETE_TIME: parseInt( date.convert( String( data.DELETE_TIME ), 'YYYYMMDD' ) ),
					};
					console.log( convert_date );
					
					if ( convert_date.INSERT_TIME <= end_date && convert_date.INSERT_TIME >= start_date ) {
						temp_insert.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}
					
					if ( convert_date.UPDATE_TIME <= end_date && convert_date.UPDATE_TIME >= start_date ) {
						temp_update.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

					if ( convert_date.DELETE_TIME <= end_date && convert_date.DELETE_TIME >= start_date ) {
						temp_delete.push( {
							NATIONAL: data.NATIONAL,
							REGION_CODE: data.REGION_CODE,
							REGION_NAME: data.REGION_NAME
						} );
					}

				} );

				start_date = date.convert( String( start_date ), 'YYYY-MM-DD' );
				end_date = date.convert( String( end_date ), 'YYYY-MM-DD' );

				res.json( {
					status: true,
					message: "Data sync dari tanggal " + start_date + " s/d " + end_date,
					data: {
						"insert": temp_insert,
						"update": temp_update,
						"delete": temp_delete
					}
				} );
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
	
}

// Create or update data
exports.createOrUpdate = ( req, res ) => {
	
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			if( !req.body.NATIONAL || !req.body.REGION_CODE ) {
				return res.status( 400 ).send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			regionModel.findOne( { 
				REGION_CODE: req.body.REGION_CODE
			} ).then( data => {
				// Kondisi belum ada data, create baru dan insert ke Sync List
				if( !data ) {

					const region = new regionModel( {
						NATIONAL: req.body.NATIONAL || "",
						REGION_CODE: req.body.REGION_CODE || "",
						REGION_NAME: req.body.REGION_NAME || "",
						INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_TIME: null,
						UPDATE_TIME: null
					} );

					region.save()
					.then( data => {
						console.log(data);
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
					
					if ( data.REGION_NAME != req.body.REGION_NAME ) {
						regionModel.findOneAndUpdate( { 
							REGION_CODE: req.body.REGION_CODE
						}, {
							REGION_NAME: req.body.REGION_NAME || "",
							UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
						}, { new: true } )
						.then( data => {
							if( !data ) {
								return res.status( 404 ).send( {
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
								return res.status( 404 ).send( {
									status: false,
									message: "Data not found 2",
									data: {}
								} );
							}
							return res.status( 500 ).send( {
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
};

// Create and Save new Data
exports.create = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
	
			if( !req.body.NATIONAL || !req.body.REGION_CODE ) {
				return res.send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			const set = new regionModel({
				NATIONAL: req.body.NATIONAL || "",
				REGION_CODE: req.body.REGION_CODE || "",
				REGION_NAME: req.body.REGION_NAME || "",
				INSERT_TIME: req.body.INSERT_TIME_DW || "",
				DELETE_TIME: req.body.UPDATE_TIME_DW || "",
				UPDATE_TIME: req.body.UPDATE_TIME_DW || ""
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
					message: 'Success',
					data: {}
				});
			} ).catch( err => {
				res.status( 500 ).send( {
					status: false,
					message: 'Some error occurred while creating data',
					data: {}
				} );
			} );
		}
	} );
	
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.sendStatus( 403 );
		}
		else {
			var auth = jwtDecode( req.token );
			var location_code = auth.LOCATION_CODE;
			var location_code = location_code.split( ',' );
			var location_code_final = [];
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;

			location_code.forEach( function( data ) {
				location_code_final.push( '0' + data.substr( 0, 1 ) );
			} );

			if ( url_query_length > 0 ) {
				res.json({
					status: false,
					message: "URL Salah"
				});
			}
			else {
				regionModel.find( {
					REGION_CODE: { $in: location_code_final },
					DELETE_TIME: ""
				} )
				.select( {
					_id: 0,
					NATIONAL: 1,
					REGION_CODE: 1,
					REGION_NAME: 1
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
					res.status( 500 ).send( {
						status: false,
						message: err.message || "Some error occurred while retrieving data.",
						data: {}
					} );
				} );
			}
		}
	} );

	/*
	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	
	if ( url_query_length > 0 ) {

		regionModel.find( url_query )
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
		regionModel.find()
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
	}*/

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	regionModel.findOne( { 
		REGION_CODE: req.params.id 
	} ).
	select( {
		_id: 0,
		NATIONAL: 1,
		REGION_CODE: 1,
		REGION_NAME: 1
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
	if( !req.body.REGION_NAME  ) {
		return res.status( 400 ).send( {
			status: false,
			message: 'Invalid Input',
			data: {}
		});
	}
	
	regionModel.findOneAndUpdate( { 
		REGION_CODE : req.params.id 
	}, {
		NATIONAL: req.body.NATIONAL || "",
		REGION_NAME: req.body.REGION_NAME || ""
	}, { new: true } )
	.select( {
		_id: 0,
		NATIONAL: 1,
		REGION_CODE: 1,
		REGION_NAME: 1
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
	regionModel.findOneAndUpdate( { 
		REGION_CODE: req.params.id
	}, {
		DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
	}, { new: true } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
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
			return res.status( 404 ).send( {
				status: false,
				message: "ObjectID Error",
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Error",
			data: {}
		} );
	});
};

// Delete data with the specified ID in the request
/*
exports.delete = ( req, res ) => {
	regionModel.findOneAndRemove( { REGION_CODE : req.params.id } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.id,
				data: {}
			} );
		}
		res.send( {
			status: true,
			message: 'Success',
			data: {}
		} );
	}).catch( err => {
		if( err.kind === 'ObjectId' || err.name === 'NotFound' ) {
			return res.status(404).send({
				status: false,
				message: "Data not found 1 with id " + req.params.id,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Could not delete data with id " + req.params.id,
			data: {}
		} );
	} );
};*/