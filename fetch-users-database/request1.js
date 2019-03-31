const MongoClient = require('mongodb').MongoClient;

/**
 * @param {number} nb 
 */
function toPercentage(nb) {
	return nb.toPrecision(2) * 100;
}

// Proportion de posts considérés comme "safe" (rating s)
async function request1() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);

	let nbSafe = await db.collection('posts').countDocuments({ rating: 's' });
	let nbTotal = await db.collection('posts').countDocuments();

	console.log(`Proportion de posts safe : ${nbSafe} / ${nbTotal} = ${toPercentage(nbSafe / nbTotal)}%`);

	client.close();
}

request1();