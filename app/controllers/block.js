const blockModel = require( '../models/block.js' );
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

// Create and Save new Data
exports.create = ( req, res ) => {
	
	if( !req.body.BLOCK_CODE || !req.body.BLOCK_NAME ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	const block = new blockModel({
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		WERKS: req.body.WERKS || "",
		AFD_CODE: req.body.AFD_CODE || "",
		BLOCK_CODE: req.body.BLOCK_CODE || "",
		BLOCK_NAME: req.body.BLOCK_NAME || "",
		WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE || "",
		LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
		LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
		START_VALID: ( req.body.START_VALID != '' ) ? date.parse( req.body.START_VALID, 'YYYY-MM-DD' ) : "",
		END_VALID: ( req.body.END_VALID != '' ) ? date.parse( req.body.END_VALID, 'YYYY-MM-DD' ) : "",
		INSERT_USER: req.body.INSERT_USER || "",
		INSERT_TIME: ( req.body.INSERT_TIME != '' ) ? date.parse( req.body.INSERT_TIME, 'YYYY-MM-DD HH:mm:ss' ) : "",
		UPDATE_USER: req.body.UPDATE_USER || "",
		UPDATE_TIME: ( req.body.UPDATE_TIME != '' ) ? date.parse( req.body.UPDATE_TIME, 'YYYY-MM-DD HH:mm:ss' ) : ""
	});

	block.save()
	.then( data => {

		res.send({
			status: true,
			message: 'Success',
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

	// Output Query URL
	//console.log(req.query);
	// Count JSON length
	//console.log( Object.keys( req.query ).length );

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	
	if ( url_query_length > 0 ) {
		console.log( req.query );

		blockModel.find( url_query )
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
		blockModel.find()
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
	blockModel.findOne( { 
		WERKS_AFD_BLOCK_CODE: req.params.id 
	} ).then( data => {
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
	if( !req.body.COMP_CODE ) {
		return res.status( 400 ).send( {
			status: false,
			message: 'Invalid Input',
			data: {}
		});
	}
	
	blockModel.findOneAndUpdate( { 
		WERKS_AFD_BLOCK_CODE : req.params.id 
	}, {
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		WERKS: req.body.WERKS || "",
		AFD_CODE: req.body.AFD_CODE || "",
		BLOCK_CODE: req.body.BLOCK_CODE || "",
		BLOCK_NAME: req.body.BLOCK_NAME || "",
		WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE || "",
		LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
		LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
		START_VALID: ( req.body.START_VALID != '' ) ? date.parse( req.body.START_VALID, 'YYYY-MM-DD' ) : "",
		END_VALID: ( req.body.END_VALID != '' ) ? date.parse( req.body.END_VALID, 'YYYY-MM-DD' ) : "",
		UPDATE_USER: req.body.UPDATE_USER || "",
		UPDATE_TIME: new Date()
	}, { new: true } )
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
	blockModel.findOneAndRemove( { WERKS_AFD_BLOCK_CODE : req.params.id } )
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
};











/*
|--------------------------------------------------------------------------
| Clear Function
|--------------------------------------------------------------------------
*/
	// Create or update data
	exports.createOrUpdate = ( req, res ) => {

		if ( 
			!req.body.NATIONAL || 
			!req.body.REGION_CODE || 
			!req.body.COMP_CODE || 
			!req.body.EST_CODE || 
			!req.body.WERKS || 
			!req.body.AFD_CODE || 
			!req.body.WERKS_AFD_BLOCK_CODE ||
			!req.body.START_VALID ||
			!req.body.END_VALID
		) {
			return res.send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}

		blockModel.findOne( { 
			WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE,
			START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' )
		} ).then( data => {

			// Kondisi belum ada data, create baru dan insert ke Sync List
			if( !data ) {
				
				const set = new blockModel( {
					NATIONAL: req.body.NATIONAL || "",
					REGION_CODE: req.body.REGION_CODE || "",
					COMP_CODE: req.body.COMP_CODE || "",
					EST_CODE: req.body.EST_CODE || "",
					WERKS: req.body.WERKS || "",
					AFD_CODE: req.body.AFD_CODE || "",
					BLOCK_CODE: req.body.BLOCK_CODE || "",
					BLOCK_NAME: req.body.BLOCK_NAME || "",
					WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE || "",
					LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
					LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
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
					data.WERKS != req.body.WERKS || 
					data.AFD_CODE != req.body.AFD_CODE || 
					data.BLOCK_NAME != req.body.BLOCK_NAME || 
					data.LATITUDE_BLOCK != req.body.LATITUDE_BLOCK || 
					data.LONGITUDE_BLOCK != req.body.LONGITUDE_BLOCK || 
					data.END_VALID != date.convert( req.body.END_VALID, 'YYYYMMDD' )
				) {

					var data_update;
					if ( date.convert( req.body.END_VALID, 'YYYYMMDD' ) == '99991231' ) {
						data_update = {
							NATIONAL: req.body.NATIONAL || "",
							REGION_CODE: req.body.REGION_CODE || "",
							COMP_CODE: req.body.COMP_CODE || "",
							EST_CODE: req.body.EST_CODE || "",
							WERKS: req.body.WERKS || "",
							AFD_CODE: req.body.AFD_CODE || "",
							BLOCK_CODE: req.body.BLOCK_CODE || "",
							BLOCK_NAME: req.body.BLOCK_NAME || "",
							WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE || "",
							LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
							LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
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
							WERKS: req.body.WERKS || "",
							AFD_CODE: req.body.AFD_CODE || "",
							BLOCK_CODE: req.body.BLOCK_CODE || "",
							BLOCK_NAME: req.body.BLOCK_NAME || "",
							WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE || "",
							LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
							LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
							END_VALID: date.convert( req.body.END_VALID, 'YYYYMMDD' ),
							DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
						}
					}

					blockModel.findOneAndUpdate( { 
						WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE,
						START_VALID: date.convert( req.body.START_VALID, 'YYYYMMDD' )
					}, data_update, { new: true } )
					.then( data => {
						if( !data ) {
							return res.send( {
								status: false,
								message: "Data error updating 2 ",
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
	};