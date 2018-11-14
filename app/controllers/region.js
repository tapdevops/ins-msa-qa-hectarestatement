const regionModel = require( '../models/region.js' );
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
	console.log(req.body);
	if( !req.body.NATIONAL || !req.body.REGION_CODE ) {
		return res.status( 400 ).send({
			status: false,
			message: 'Invalid inputs',
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
				INSERT_TIME_DW: ( req.body.INSERT_TIME_DW != '' ) ? date.parse( req.body.INSERT_TIME_DW, 'YYYY-MM-DD HH:mm:ss' ) : "",
				UPDATE_TIME_DW: ( req.body.UPDATE_TIME_DW != '' ) ? date.parse( req.body.UPDATE_TIME_DW, 'YYYY-MM-DD HH:mm:ss' ) : "",
				FLAG_UPDATE: dateAndTimes.format( new Date(), 'YYYYMMDD' )
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
					COMP_CODE: req.body.COMP_CODE
				}, {
					REGION_NAME: req.body.REGION_NAME || "",
					INSERT_TIME_DW: ( req.body.INSERT_TIME_DW != '' ) ? date.parse( req.body.INSERT_TIME_DW, 'YYYY-MM-DD HH:mm:ss' ) : "",
					UPDATE_TIME_DW: ( req.body.UPDATE_TIME_DW != '' ) ? date.parse( req.body.UPDATE_TIME_DW, 'YYYY-MM-DD HH:mm:ss' ) : "",
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