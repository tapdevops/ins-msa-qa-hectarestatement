const compModel = require( '../models/comp.js' );
const dateFormat = require( 'dateformat' );
const dateAndTimes = require( 'date-and-time' );
var querystring = require('querystring');
const yyyymmdd = require( 'yyyy-mm-dd' );
const date = require( '../libraries/date.js' );
var url = require( 'url' );
const Client = require('node-rest-client').Client; 	
const config = require( '../../config/config.js' );

// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	compModel.findOneAndUpdate( { 
		COMP_CODE: req.params.id
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

// Create and Save new Data
exports.create = ( req, res ) => {
	
	if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid inputz',
			data: {}
		});
	}

	const set = new compModel({
		NATIONAL: req.body.NATIONAL || "",
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		COMP_NAME: req.body.COMP_NAME || "",
		ADDRESS: req.body.ADDRESS || "",
		INSERT_TIME_DW: req.body.INSERT_TIME_DW || "",
		UPDATE_TIME_DW: req.body.UPDATE_TIME_DW || "",
		FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
	});

	set.save()
	.then( data => {
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
	
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

	url_query = req.query;
	var url_query_length = Object.keys( url_query ).length;
	
	if ( url_query_length > 0 ) {

		compModel.find( url_query )
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
		compModel.find()
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
	compModel.findOne( { 
		COMP_CODE: req.params.id 
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
	if( !req.body.COMP_NAME || !req.body.ADDRESS  ) {
		return res.status( 400 ).send( {
			status: false,
			message: 'Invalid Input',
			data: {}
		});
	}
	
	compModel.findOneAndUpdate( { 
		COMP_CODE : req.params.id 
	}, {
		COMP_NAME: req.body.COMP_NAME || "",
		ADDRESS: req.body.ADDRESS || "",
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

/*
|--------------------------------------------------------------------------
| Clear Function
|--------------------------------------------------------------------------
*/
	// Create or update data
	exports.createOrUpdate = ( req, res ) => {
	
		if( !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.COMP_NAME ) {
			return res.send({
				status: false,
				message: 'Invalid input',
				data: {}
			});
		}

		compModel.findOne( { 
			COMP_CODE: req.body.COMP_CODE
		} ).then( data => {
			// Kondisi belum ada data, create baru dan insert ke Sync List
			if( !data ) {
				
				const set = new compModel( {
					NATIONAL: req.body.NATIONAL || "",
					REGION_CODE: req.body.REGION_CODE || "",
					COMP_CODE: req.body.COMP_CODE || "",
					COMP_NAME: req.body.COMP_NAME || "",
					ADDRESS: req.body.ADDRESS || "",
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
					data.COMP_NAME != req.body.COMP_NAME || 
					data.ADDRESS != req.body.ADDRESS
				) {
					var data_update;
					if ( date.convert( req.body.END_VALID, 'YYYYMMDD' ) == '99991231' ) {
						data_update = {
							NATIONAL: req.body.NATIONAL || "",
							REGION_CODE: req.body.REGION_CODE || "",
							COMP_NAME: req.body.COMP_NAME || "",
							ADDRESS: req.body.ADDRESS || "",
							UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
						}
					}
					else {
						data_update = {
							NATIONAL: req.body.NATIONAL || "",
							REGION_CODE: req.body.REGION_CODE || "",
							COMP_NAME: req.body.COMP_NAME || "",
							ADDRESS: req.body.ADDRESS || "",
							DELETE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' )
						}
					}

					compModel.findOneAndUpdate( { 
						COMP_CODE: req.body.COMP_CODE
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
	};

	// Find All
	exports.findAll = ( req, res ) => {
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;

		compModel.find( url_query )
		.select( {
			_id: 0,
			NATIONAL: 1,
			REGION_CODE: 1,
			COMP_CODE: 1,
			COMP_NAME: 1,
			ADDRESS: 1
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