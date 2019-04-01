const MongoClient = require('mongodb').MongoClient;

// Nombre de posts par année
async function request4() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);

	let agg = await db.collection('posts').aggregate([{
		$group: {
			_id: {
				year: {
					$year: '$created_at'
				}
			},
			count: {
				$sum: 1
			}
		}
	}, {
		$sort: {
			'_id.year': 1
		}
	}]);

	agg.forEach(console.log);

	client.close();
}

request4();