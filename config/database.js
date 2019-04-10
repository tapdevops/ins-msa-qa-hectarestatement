/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = {
		production: {
			url: 'mongodb://s_hectare_statement:h52019@dbapp.tap-agri.com:4848/s_hectare_statement?authSource=s_hectare_statement',
			ssl: false
		},
		development: {
			url: 'mongodb://s_hectare_statement:s_hectare_statement@dbappdev.tap-agri.com:4848/s_hectare_statement?authSource=s_hectare_statement',
			ssl: false
		}
	}

	