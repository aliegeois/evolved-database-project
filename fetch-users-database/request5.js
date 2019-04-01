const MongoClient = require('mongodb').MongoClient;

// Pour le tag le plus populaire, récupère l'évolution de sa popularité par année
async function request5() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);

	let agg = await db.collection('posts').aggregate([{ // Récupère les 10
		$project: {
			_id: null,
			created_at: true,
			tags: true
		}
	}, {
		$unwind: '$tags' // on ouvre le tableau des tags
	}, {
		$group: {
			_id: {
				tag: '$tags'
			},
			count: {
				$sum: 1
			}
		}
	}, {
		$sort: {
			count: -1
		}
	}, {
		$limit: 10
	}]);

	let arr = await agg.toArray();
	let top10 = arr.map(e => e._id.tag);

	let agg2 = await db.collection('posts').aggregate([{
		$project: { // On coupe verticalement
			_id: null,
			tags: true,
			created_at: true
		}
	}, {
		$unwind: '$tags' // on ouvre le tableau des tags
	}, {
		$match: {
			tags: top10[0]
		}
	}, {
		$group: { // groupe par tag et année
			_id: {
				tags: '$tags',
				year: {
					$year: '$created_at'
				}
			},
			count: { // compte l'apaprition de chaque tag
				$sum: 1
			}
		}
	}, {
		$sort: { // trie par année croissante et count décroissant
			'_id.year': 1,
			count: -1
		}
	}/*, {
		$limit: 10 // Si on a trop de tags, à activer
	}*/]);

	agg2.forEach(console.log);
	

	client.close();
}

request5();