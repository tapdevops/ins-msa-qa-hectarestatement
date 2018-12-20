/*
 |--------------------------------------------------------------------------
 | App Config
 |--------------------------------------------------------------------------
 */

	// Models
	const landUseModel 		= require( '../models/landUse.js' );

	// Config
	const config 			= require( '../../config/config.js' );

	// Security
	const jwt 				= require( 'jsonwebtoken' );
	const uuid 				= require( 'uuid' );
	const nJwt 				= require( 'njwt' );
	const jwtDecode 		= require( 'jwt-decode' );

	// Libraries
	const date 				= require( '../libraries/date.js' );

	// Plugin
	const Client 			= require('node-rest-client').Client; 
	const querystring 		= require('querystring');
	const url 				= require( 'url' );
	const moment_pure 		= require( 'moment' );
	const moment 			= require( 'moment-timezone' );


/*
 |--------------------------------------------------------------------------
 | Land Use
 |--------------------------------------------------------------------------
 */
	// Create or update data
	// Untuk proses sync menggunakan cronjob dari database Oracle ke MongoDB (TAP_DW)
	exports.createOrUpdate = ( req, res ) => {

		//if( !req.body.NATIONAL || !req.body.REGION_CODE || !req.body.COMP_CODE ) {
		//	return res.send({
		//		status: false,
		//		message: 'Invalid input',
		//		data: {}
		//	});
		//}

		landUseModel.findOne( { 
			REGION_CODE: req.body.REGION_CODE,
			COMP_CODE: req.body.COMP_CODE,
			WERKS: req.body.WERKS,
			AFD_CODE: req.body.AFD_CODE,
			BLOCK_CODE: req.body.BLOCK_CODE,
			SPMON: date.convert( req.body.SPMON, 'YYYYMMDDhhmmss' )
		} ).then( data => {

			// Kondisi belum ada data, create baru dan insert ke Sync List
			if( !data ) {

				const set = new landUseModel( {
					NATIONAL 				: req.body.NATIONAL || "",
					REGION_CODE 			: req.body.REGION_CODE || "",
					COMP_CODE 				: req.body.COMP_CODE || "",
					WERKS 					: req.body.WERKS || "", 
					SUB_BA_CODE 			: req.body.SUB_BA_CODE || "",
					KEBUN_CODE 				: req.body.KEBUN_CODE || "",
					AFD_CODE 				: req.body.AFD_CODE || "",
					AFD_NAME 				: req.body.AFD_NAME || "",
					WERKS_AFD_CODE 			: req.body.WERKS + req.body.AFD_CODE,
					BLOCK_CODE 				: req.body.BLOCK_CODE || "",
					BLOCK_NAME 				: req.body.BLOCK_NAME || "",
					WERKS_AFD_BLOCK_CODE 	: req.body.WERKS + req.body.AFD_CODE + req.body.BLOCK_CODE,
					LAND_USE_CODE 			: req.body.LAND_USE_CODE || "",
					LAND_USE_NAME 			: req.body.LAND_USE_NAME|| "",
					LAND_USE_CODE_GIS 		: req.body.LAND_USE_CODE_GIS || "",
					SPMON 					: date.convert( req.body.SPMON, 'YYYYMMDDhhmmss' ),
					LAND_CAT 				: req.body.LAND_CAT || "",
					LAND_CAT_L1_CODE 		: req.body.LAND_CAT_L1_CODE || "",
					LAND_CAT_L1 			: req.body.LAND_CAT_L1 || "",

					LAND_CAT_L2_CODE 		: req.body.LAND_CAT_L2_CODE || "",
					MATURITY_STATUS 		: req.body.MATURITY_STATUS || "",
					SCOUT_STATUS 			: req.body.SCOUT_STATUS || "",
					AGES 					: req.body.AGES || "",
					HA_SAP 					: req.body.HA_SAP || "",
					PALM_SAP 				: req.body.PALM_SAP || "",
					SPH_SAP 				: req.body.SPH_SAP || "",
					HA_GIS 					: req.body.HA_GIS || "",
					PALM_GIS 				: req.body.PALM_GIS || "",
					SPH_GIS 				: req.body.SPH_GIS || "",

					INSERT_TIME 			: date.convert( 'now', 'YYYYMMDDhhmmss' )
				} );

				set.save()
				.then( data => {
					
					if ( !data ) {
						res.send({
							status: true,
							message: 'Error',
							data: []
						});
					}

					res.send({
						status: true,
						message: 'Success',
						data: []
					});
				} ).catch( err => {
					if( err.kind === 'ObjectId' ) {
						return res.send( {
							status: false,
							message: "Error ObjectId",
							data: []
						} );
					}
					return res.send( {
						status: false,
						message: "Error retrieving data",
						data: []
					} );
				} );
			}
			// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
			else {
				if ( 
					data.REGION_CODE != req.body.REGION_CODE || 
					data.NATIONAL 				!= req.body.NATIONAL || 
					data.REGION_CODE 			!= req.body.REGION_CODE || 
					data.COMP_CODE 				!= req.body.COMP_CODE || 
					data.WERKS 					!= req.body.WERKS  || 
					data.SUB_BA_CODE 			!= req.body.SUB_BA_CODE || 
					data.KEBUN_CODE 			!= req.body.KEBUN_CODE || 
					data.AFD_CODE 				!= req.body.AFD_CODE || 
					data.AFD_NAME 				!= req.body.AFD_NAME || 
					data.WERKS_AFD_CODE 		!= req.body.WERKS + req.body.AFD_CODE || 
					data.BLOCK_CODE 			!= req.body.BLOCK_CODE || 
					data.BLOCK_NAME 			!= req.body.BLOCK_NAME || 
					data.WERKS_AFD_BLOCK_CODE 	!= req.body.WERKS + req.body.AFD_CODE + req.body.BLOCK_CODE || 
					data.LAND_USE_CODE 			!= req.body.LAND_USE_CODE || 
					data.LAND_USE_NAME 			!= req.body.LAND_USE_NAME || 
					data.LAND_USE_CODE_GIS 		!= req.body.LAND_USE_CODE_GIS || 
					data.SPMON 					!= date.convert( req.body.SPMON, 'YYYYMMDDhhmmss' ) || 
					data.LAND_CAT 				!= req.body.LAND_CAT || 
					data.LAND_CAT_L1_CODE 		!= req.body.LAND_CAT_L1_CODE || 
					data.LAND_CAT_L1 			!= req.body.LAND_CAT_L1 || 

					data.LAND_CAT_L2_CODE 		!= req.body.LAND_CAT_L2_CODE ||
					data.MATURITY_STATUS 		!= req.body.MATURITY_STATUS ||
					data.SCOUT_STATUS 			!= req.body.SCOUT_STATUS ||
					data.AGES 					!= req.body.AGES ||
					data.HA_SAP 				!= req.body.HA_SAP ||
					data.PALM_SAP 				!= req.body.PALM_SAP ||
					data.SPH_SAP 				!= req.body.SPH_SAP ||
					data.HA_GIS 				!= req.body.HA_GIS ||
					data.PALM_GIS 				!= req.body.PALM_GIS ||
					data.SPH_GIS 				!= req.body.SPH_GIS
				) {
					landUseModel.findOneAndUpdate( { 
						COMP_CODE: req.body.COMP_CODE
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


exports.find = ( req, res ) => {
	res.json( {
		auth: req.auth,
		config: req.config
	} );
	/*
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		console.log(err);
		if ( err ) {
			res.send({
				status: false,
				message: "Invalid Tokenzz",
				token: req.token,
				data: {}
			} );
		}
		else {
			var auth = jwtDecode( req.token );
			res.json( {
				auth: auth
			} );
			
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
	*/

};