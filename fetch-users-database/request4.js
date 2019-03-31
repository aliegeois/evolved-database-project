const MongoClient = require('mongodb').MongoClient;

// Top 10 des tags sur lesquels les utilisateurs postent le plus
async function request2() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);

	let agg = await db.collection('posts').aggregate([{
		$group: {
			_id: null,
			totalVolume: {
				$sum: '$file_size'
			}
		}
	}]).sort({file_size: -1}).limit(10);

	agg.forEach(console.log);

	client.close();
}

request2();