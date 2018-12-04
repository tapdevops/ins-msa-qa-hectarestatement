exports.test = ( req, res ) => {
	var a = [
		{
			"NAMA": "Ferdinand",
			"UMUR": "25"
		},
		{
			"NAMA": "AMIN",
			"UMUR": "24"
		}
	];
	a.forEach( function( entry ) {
		console.log(entry.NAMA);
	} );
}