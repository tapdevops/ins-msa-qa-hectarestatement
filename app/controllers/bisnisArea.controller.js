const BisnisArea = require( '../models/bisnisArea.model.js' );
const dateFormat = require( 'dateformat' );
var qs = require('querystring');

// Create and Save new Note
exports.create = ( req, res ) => {

	if( !req.body.ba_code || !req.body.nama_area ) {
		return res.status( 400 ).send({
		    message: "Bisnis Area content can not be empty"
		});
	}

	const ba = new BisnisArea({
		ba_code: req.body.ba_code || "",
		nama_area: req.body.nama_area || ""
	});

	ba.save()
	.then(data => {
		res.send(data);
	}).catch(err => {
		res.status(500).send({
			message: err.message || "Some error occurred while creating the Bisnis Area."
		});
	});
};

// Retrieve and return all notes from the database.
exports.findAll = ( req, res ) => {
	BisnisArea.find()
	.then(ba => {
		res.send(ba);
	}).catch(err => {
		res.status(500).send({
			message: err.message || "Some error occurred while retrieving notes."
		});
	});
};

// Find a single note with a noteId
exports.findOne = ( req, res ) => {
	console.log(req.params);
	//BisnisArea.findById( req.params.baCode )
	BisnisArea.findOne( {ba_code: req.params.baCode} )
	.then(note => {
		if(!note) {
			return res.status(404).send({
				message: "BA Code not found with id " + req.params.baCode
			});
		}
		res.send(note);
	}).catch(err => {
		if(err.kind === 'ObjectId') {
			return res.status(404).send({
				message: "BA Code not found with id " + req.params.baCode
			});
		}
		return res.status(500).send({
			message: "Error retrieving BA Code with id " + req.params.baCode
		});
	});
};

// Update a note dentified by the noteId in the requirest
exports.update = ( req, res ) => {
	// Validate Request
	if(!req.body.nama_area) {
		return res.status(400).send({
			message: "Nama Area can not be empty"
		});
	}
	
	BisnisArea.findOneAndUpdate( {ba_code : req.params.baCode}, {
		ba_code: req.body.ba_code || "",
		nama_area: req.body.nama_area
	}, {new: true})
	.then(note => {
		if(!note) {
			return res.status(404).send({
				message: "BA Code not found with id " + req.params.baCode
			});
		}
		res.send(note);
	}).catch(err => {
		if(err.kind === 'ObjectId') {
			return res.status(404).send({
				message: "BA Code not found with id " + req.params.baCode
			});
		}
		return res.status(500).send({
			message: "BA Code updating note with id " + req.params.baCode
		});
	});
};

// Delete a note with the specified noteId in the request
exports.delete = ( req, res ) => {
	BisnisArea.findOneAndRemove( { ba_code : req.params.baCode } )
	.then(note => {
		if(!note) {
			return res.status(404).send({
				message: "BA Code not found with id " + req.params.baCode
			});
		}
		res.send({message: "BA Code deleted successfully!"});
	}).catch(err => {
		if(err.kind === 'ObjectId' || err.name === 'NotFound') {
			return res.status(404).send({
				message: "BA Code not found with id " + req.params.baCode
			});
		}
		return res.status(500).send({
			message: "Could not delete note with id " + req.params.baCode
		});
	});
};



