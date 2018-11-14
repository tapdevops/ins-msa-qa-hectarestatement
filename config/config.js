module.exports = {
	//
	app_port: process.env.PORT || 3006,
	app_name: 'Microservices Hectare Statement',
	url: {
		sync_list: 'http://149.129.242.205:3001/sync/list'
		//sync_list: 'http://localhost:3001/sync/list'
	}
}