module.exports = {
	//
	app_port: process.env.PORT || 3003,
	app_name: 'Microservice Hectare Statement',
	app_ip: '149.129.242.205',
	url: {
		sync_list: 'http://149.129.242.205:3001/sync/list'
		//sync_list: 'http://localhost:3001/sync/list'
	}
}

module.exports = {

	/*
	|--------------------------------------------------------------------------
	| App Config
	|--------------------------------------------------------------------------
	*/
	app_port: process.env.PORT || 3003,
	app_name: 'Microservice Hectare Statement',

	/*
	|--------------------------------------------------------------------------
	| Token
	|--------------------------------------------------------------------------
	*/
	secret_key: 'T4pagri123#',
	token_expiration: 7, // Days
	token_algorithm: 'HS256',

	/*
	|--------------------------------------------------------------------------
	| Token
	|--------------------------------------------------------------------------
	*/
	url: {
		sync_list: 'http://149.129.242.205:3001/sync/list'
	}

}