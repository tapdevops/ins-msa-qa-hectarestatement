const estModel = require( '../models/est.js' );
const dateFormat = require( 'dateformat' );
const dateAndTimes = require( 'date-and-time' );
var querystring = require('querystring');
const yyyymmdd = require( 'yyyy-mm-dd' );
const date = require( '../libraries/date.js' );
var url = require( 'url' );
const Client = require('node-rest-client').Client; 	
const config = require( '../../config/config.js' );

// Create or update data
exports.createOrUpdate = ( req, res ) => {

	if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.EST_NAME  ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	estModel.findOne( { 
		WERKS: req.body.WERKS
	} ).then( data => {

		// Kondisi belum ada data, create baru dan insert ke Sync List
		if( !data ) {

			const est = new estModel( {
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
			} );

			est.save()
			.then( data => {
				console.log(data);
				res.send({
					status: true,
					message: 'Success 2',
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
		// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
		else {

			if ( data.EST_NAME != req.body.EST_NAME || data.CITY != req.body.CITY ) {
				estModel.findOneAndUpdate( { 
					WERKS: req.body.WERKS
				}, {
					EST_NAME: req.body.EST_NAME || "",
					START_VALID: req.body.START_VALID || "",
					END_VALID: req.body.END_VALID || "",
					CITY: req.body.CITY || "",
					INSERT_TIME_DW: req.body.INSERT_TIME_DW || "",
					UPDATE_TIME_DW: req.body.UPDATE_TIME_DW || "",
					FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
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

};

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
	if( !req.body.EST_NAME || !req.body.CITY  ) {
		return res.status( 400 ).send( {
			status: false,
			message: 'Invalid Input',
			data: {}
		});
	}
	
	estModel.findOneAndUpdate( { 
		WERKS : req.params.id 
	}, {
		EST_NAME: req.body.EST_NAME || "",
		START_VALID: req.body.START_VALID || "",
		END_VALID: req.body.END_VALID || "",
		CITY: req.body.CITY || "",
		INSERT_TIME_DW: req.body.INSERT_TIME_DW || "",
		UPDATE_TIME_DW: req.body.UPDATE_TIME_DW || "",
		FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
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
	estModel.findOneAndRemove( { WERKS : req.params.id } )
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