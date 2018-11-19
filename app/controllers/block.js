const blockModel = require( '../models/block.js' );
const dateFormat = require( 'dateformat' );
var querystring = require('querystring');
const yyyymmdd = require( 'yyyy-mm-dd' );
const date = require( '../libraries/date.js' );
var url = require( 'url' );
const dateAndTimes = require( 'date-and-time' );

// Create or update data
exports.createOrUpdate = ( req, res ) => {

	if( !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.AFD_CODE ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	blockModel.findOne( { 
		WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE
	} ).then( data => {

		// Kondisi belum ada data, create baru dan insert ke Sync List
		if( !data ) {

			const block = new blockModel( {
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
				START_VALID: req.body.START_VALID || "",
				END_VALID: req.body.END_VALID || "",
				INSERT_USER: req.body.INSERT_USER || "",
				INSERT_TIME: req.body.INSERT_TIME || "",
				UPDATE_USER: req.body.UPDATE_USER || "",
				UPDATE_TIME: req.body.UPDATE_TIME || "",
				FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
			} );

			block.save()
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
			
			if ( data.BLOCK_NAME != req.body.BLOCK_NAME ) {
				blockModel.findOneAndUpdate( { 
					WERKS_AFD_BLOCK_CODE: req.body.WERKS_AFD_BLOCK_CODE
				}, {
					BLOCK_NAME: req.body.BLOCK_NAME || "",
					LATITUDE_BLOCK: req.body.LATITUDE_BLOCK || "",
					LONGITUDE_BLOCK: req.body.LONGITUDE_BLOCK || "",
					START_VALID: req.body.START_VALID || "",
					END_VALID: req.body.END_VALID || "",
					INSERT_USER: req.body.INSERT_USER || "",
					INSERT_TIME: req.body.INSERT_TIME || "",
					UPDATE_USER: req.body.UPDATE_USER || "",
					UPDATE_TIME: req.body.UPDATE_TIME || "",
					FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
				}, { new: true } )
				.then( data => {
					if( !data ) {
						return res.status( 404 ).send( {
							status: false,
							message: "Data error updating 2 " + req.body.WERKS_AFD_BLOCK_CODEs,
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
		WERKS_AFD_BLOCK_CODE: req.params.GET_WERKS_AFD_BLOCK_CODE 
	} ).then( data => {
		if( !data ) {
			return res.status(404).send({
				status: false,
				message: "Data not found 2 with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
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
				message: "Data not found 1 with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
				data: {}
			});
		}
		return res.status( 500 ).send({
			status: false,
			message: "Error retrieving Data with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
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
		WERKS_AFD_BLOCK_CODE : req.params.GET_WERKS_AFD_BLOCK_CODE 
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
				message: "Data not found 1 with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
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
				message: "Data not found 2 with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Data error updating with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
			data: {}
		} );
	});
};

// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	blockModel.findOneAndRemove( { WERKS_AFD_BLOCK_CODE : req.params.GET_WERKS_AFD_BLOCK_CODE } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
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
				message: "Data not found 1 with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Could not delete data with id " + req.params.GET_WERKS_AFD_BLOCK_CODE,
			data: {}
		} );
	} );
};


