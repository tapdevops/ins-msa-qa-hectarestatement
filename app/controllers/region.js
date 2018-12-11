const regionModel = require( '../models/region.js' );
const dateFormat = require( 'dateformat' );
const dateAndTimes = require( 'date-and-time' );
var querystring = require('querystring');
const yyyymmdd = require( 'yyyy-mm-dd' );
const date = require( '../libraries/date.js' );
var url = require( 'url' );
const Client = require('node-rest-client').Client; 	
const config = require( '../../config/config.js' );

let moment = require( 'moment-timezone' );
let jwt = require( 'jsonwebtoken' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );

exports.syncMobile1 = ( req, res ) => {

	console.log( today );
	console.log( tomorrow );

	var today = moment( "11/12/2018", "DD/MM/YYYY" ).startOf( 'day' );
	var tomorrow = moment( today ).endOf( 'day' );
	var data_sync = [];

	// Select All (Insert Update Delete)
	/*
	regionModel.find( { 
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
	} )
	*/

	regionModel.find( { 
		$and: [
			{
				$or: [
					{
						INSERT_TIME: {
							$gte: today.toDate(),
							$lt: tomorrow.toDate()
						}
					}
				]
			}
		]
	} ).then( data_insert => {

		data_sync.insert = data_insert;

		regionModel.find( { 
			$and: [
				{
					$or: [
						{
							UPDATE_TIME: {
								$gte: today.toDate(),
								$lt: tomorrow.toDate()
							}
						}
					]
				}
			]
		} ).then( data_update => {
			data_sync.update = data_update;
			regionModel.find( { 
				$and: [
					{
						$or: [
							{
								DELETE_TIME: {
									$gte: today.toDate(),
									$lt: tomorrow.toDate()
								}
							}
						]
					}
				]
			} ).then( data_delete => {
				data_sync.delete = data_delete;
				res.send({
					status: false,
					message: "X",
					data: data_sync
				});
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

exports.syncMobile = ( req, res ) => {

	console.log( today );
	console.log( tomorrow );
	var date_target = req.params.id;
	var today = moment( date_target, "YYYY-MM-DD" ).startOf( 'day' );
	var tomorrow = moment( today ).endOf( 'day' );
	var data_sync = [];

	// Select All (Insert Update Delete)
	regionModel.find( { 
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

// Create or update data
exports.createOrUpdate = ( req, res ) => {
	
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
				INSERT_TIME: new Date(),
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
				res.status( 500 ).send( {
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
					UPDATE_TIME: new Date()
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
	
	if( !req.body.NATIONAL || !req.body.REGION_CODE ) {
		return res.status( 400 ).send({
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
	
};

// Retrieve and return all notes from the database.
exports.find = ( req, res ) => {

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
	}

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	regionModel.findOne( { 
		REGION_CODE: req.params.id 
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
		REGION_NAME: req.body.REGION_NAME || "",
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
	regionModel.findOneAndUpdate( { 
		REGION_CODE: req.params.id
	}, {
		DELETE_TIME: new Date()
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