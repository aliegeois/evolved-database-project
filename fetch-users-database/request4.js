const MongoClient = require('mongodb').MongoClient;

// Nombre de posts par année
async function request2() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);

	//let emit = console.log;

	// let a = await db.collection('posts').mapReduce(
	// 	function() { emit(this.id, this.file_size); },
	// 	(key, values) => {
	// 		let result = {}; 
	// 		result.names = values;
	// 		return result;
	// 		// console.log(values); return Array.sum(values); },
	// 	}, {
	// 		out: { inline: 1 }
	// 	});
	
	// a.forEach(console.log);

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
		$group: {
			_id: null,
			yearlyUsage: {
				$push: {
					year: '$_id.year',
					count: '$count'
				}
			}
		}
	}]);

	agg.forEach(console.log);

	client.close();
}

request2();