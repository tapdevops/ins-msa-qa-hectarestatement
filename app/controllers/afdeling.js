const afdelingModel = require( '../models/afdeling.js' );
const dateFormat = require( 'dateformat' );
var querystring = require('querystring');
const yyyymmdd = require( 'yyyy-mm-dd' );
var url = require( 'url' );
const date = require( '../libraries/date.js' );
const dateAndTimes = require( 'date-and-time' );

// Create or update data
exports.createOrUpdate = ( req, res ) => {

	//if( !req.body.REGION_CODE || !req.body.COMP_CODE || !req.body.EST_CODE || !req.body.WERKS || !req.body.AFD_CODE  ) {
	if( !req.body.REGION_CODE  ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	afdelingModel.findOne( { 
		WERKS_AFD_CODE: req.body.WERKS_AFD_CODE
	} ).then( data => {

		// Kondisi belum ada data, create baru dan insert ke Sync List
		if( !data ) {

			const afdeling = new afdelingModel( {
				REGION_CODE: req.body.REGION_CODE || "",
				COMP_CODE: req.body.COMP_CODE || "",
				EST_CODE: req.body.EST_CODE || "",
				WERKS: req.body.WERKS || "",
				AFD_CODE: req.body.AFD_CODE || "",
				AFD_NAME: req.body.AFD_NAME || "",
				WERKS_AFD_CODE: req.body.WERKS_AFD_CODE || "",
				START_VALID: ( req.body.START_VALID != '' ) ? date.parse( req.body.START_VALID, 'YYYY-MM-DD' ) : "",
				END_VALID: ( req.body.END_VALID != '' ) ? date.parse( req.body.END_VALID, 'YYYY-MM-DD' ) : "",
				INSERT_USER: req.body.INSERT_USER || "",
				INSERT_TIME: ( req.body.INSERT_TIME != '' ) ? date.parse( req.body.INSERT_TIME, 'YYYY-MM-DD HH:mm:ss' ) : "",
				UPDATE_USER: req.body.UPDATE_USER || "",
				UPDATE_TIME: ( req.body.UPDATE_TIME != '' ) ? date.parse( req.body.UPDATE_TIME, 'YYYY-MM-DD HH:mm:ss' ) : "",
				FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
			} );

			afdeling.save()
			.then( data => {
				console.log( data );
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
			
			if ( data.AFD_NAME != req.body.AFD_NAME ) {
				afdelingModel.findOneAndUpdate( { 
					WERKS_AFD_CODE: req.body.WERKS_AFD_CODE
				}, {
					AFD_NAME: req.body.AFD_NAME || "",
					START_VALID: ( req.body.START_VALID != '' ) ? date.parse( req.body.START_VALID, 'YYYY-MM-DD' ) : "",
					END_VALID: ( req.body.END_VALID != '' ) ? date.parse( req.body.END_VALID, 'YYYY-MM-DD' ) : "",
					INSERT_USER: req.body.INSERT_USER || "",
					INSERT_TIME: ( req.body.INSERT_TIME != '' ) ? date.parse( req.body.INSERT_TIME, 'YYYY-MM-DD HH:mm:ss' ) : "",
					UPDATE_USER: req.body.UPDATE_USER || "",
					UPDATE_TIME: ( req.body.UPDATE_TIME != '' ) ? date.parse( req.body.UPDATE_TIME, 'YYYY-MM-DD HH:mm:ss' ) : "",
					FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
				}, { new: true } )
				.then( data => {
					if( !data ) {
						return res.status( 404 ).send( {
							status: false,
							message: "Data error updating 2 " + req.body.WERKS_AFD_CODE,
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
	
	if( !req.body.AFD_CODE ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	const afdeling = new afdelingModel( {
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		WERKS: req.body.WERKS || "",
		AFD_CODE: req.body.AFD_CODE || "",
		AFD_NAME: req.body.AFD_NAME || "",
		WERKS_AFD_CODE: req.body.WERKS_AFD_CODE || "",
		START_VALID: ( req.body.START_VALID != '' ) ? date.parse( req.body.START_VALID, 'YYYY-MM-DD' ) : "",
		END_VALID: ( req.body.END_VALID != '' ) ? date.parse( req.body.END_VALID, 'YYYY-MM-DD' ) : "",
		INSERT_USER: req.body.INSERT_USER || "",
		INSERT_TIME: ( req.body.INSERT_TIME != '' ) ? date.parse( req.body.INSERT_TIME, 'YYYY-MM-DD HH:mm:ss' ) : "",
		UPDATE_USER: req.body.UPDATE_USER || "",
		UPDATE_TIME: ( req.body.UPDATE_TIME != '' ) ? date.parse( req.body.UPDATE_TIME, 'YYYY-MM-DD HH:mm:ss' ) : ""
	} );

	afdeling.save()
	.then( data => {
		res.send( {
			status: true,
			message: 'Success',
			data: {}
		} );
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
	 console.log(req.query);
	// Count JSON length
	// console.log( Object.keys( req.query ).length );

	url_query = req.query;
	
	var url_query_length = Object.keys( url_query ).length;
	
	if ( url_query_length > 0 ) {
		console.log( req.query );

		afdelingModel.find( url_query )
		.then( data => {
			if(!data) {
				return res.status( 404 ).send({
					status: false,
					message: 'Data not found 2',
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
		afdelingModel.find()
		.then( data => {
			res.send( {
				status: true,
				message: 'Success',
				data: data
			} );
		}).catch( err => {
			res.status( 500 ).send( {
				status: false,
				message: err.message || "Some error occurred while retrieving data.",
				data: {}
			});
		});
	}

};

// Find a single data with a ID
exports.findOne = ( req, res ) => {
	afdelingModel.findOne( { 
		WERKS_AFD_CODE: req.params.GET_WERKS_AFD_CODE 
	} ).then( data => {
		if( !data ) {
			return res.status(404).send({
				status: false,
				message: "Data not found 2 with id " + req.params.GET_WERKS_AFD_CODE,
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
				message: "Data not found 1 with id " + req.params.GET_WERKS_AFD_CODE,
				data: {}
			});
		}
		return res.status( 500 ).send({
			status: false,
			message: "Error retrieving Data with id " + req.params.GET_WERKS_AFD_CODE,
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
	
	afdelingModel.findOneAndUpdate( { 
		WERKS_AFD_CODE : req.params.GET_WERKS_AFD_CODE 
	}, {
		REGION_CODE: req.body.REGION_CODE || "",
		COMP_CODE: req.body.COMP_CODE || "",
		EST_CODE: req.body.EST_CODE || "",
		WERKS: req.body.WERKS || "",
		AFD_CODE: req.body.AFD_CODE || "",
		AFD_NAME: req.body.AFD_NAME || "",
		WERKS_AFD_CODE: req.body.WERKS_AFD_CODE || "",
		START_VALID: ( req.body.START_VALID != '' ) ? date.parse( req.body.START_VALID, 'YYYY-MM-DD' ) : "",
		END_VALID: ( req.body.END_VALID != '' ) ? date.parse( req.body.END_VALID, 'YYYY-MM-DD' ) : "",
		UPDATE_USER: req.body.UPDATE_USER || "",
		UPDATE_TIME: new Date()
	}, { new: true } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 1 with id " + req.params.GET_WERKS_AFD_CODE,
				data: {}
			} );
		}
		res.send( {
			status: true,
			message: 'Success',
			data: {}
		} );
	}).catch( err => {
		if( err.kind === 'ObjectId' ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.GET_WERKS_AFD_CODE,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Data error updating with id " + req.params.GET_WERKS_AFD_CODE,
			data: {}
		} );
	});
};

// Delete data with the specified ID in the request
exports.delete = ( req, res ) => {
	afdelingModel.findOneAndRemove( { WERKS_AFD_CODE : req.params.GET_WERKS_AFD_CODE } )
	.then( data => {
		if( !data ) {
			return res.status( 404 ).send( {
				status: false,
				message: "Data not found 2 with id " + req.params.GET_WERKS_AFD_CODE,
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
				message: "Data not found 1 with id " + req.params.GET_WERKS_AFD_CODE,
				data: {}
			} );
		}
		return res.status( 500 ).send( {
			status: false,
			message: "Could not delete data with id " + req.params.GET_WERKS_AFD_CODE,
			data: {}
		} );
	} );
};

