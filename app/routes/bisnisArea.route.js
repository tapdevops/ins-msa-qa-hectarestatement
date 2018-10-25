module.exports = ( app ) => {

	const bisnisArea = require( '../controllers/bisnisArea.controller.js' );

	app.post('/bisnis-area', bisnisArea.create);
	app.get('/bisnis-area', bisnisArea.findAll);
	app.get('/bisnis-area/:baCode', bisnisArea.findOne);
	app.put('/bisnis-area/:baCode', bisnisArea.update);
	app.delete('/bisnis-area/:baCode', bisnisArea.delete);

}