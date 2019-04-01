module.exports = async db => {
	let agg = await db.collection('posts').aggregate([{ // Récupère les 5 meilleurs tags
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
		$limit: 5
	}]);

	let arr = await agg.toArray();
	let top = arr.map(e => e._id.tag);

	let agg2 = await db.collection('posts').aggregate([{
		$project: { // On coupe verticalement
			_id: null,
			tags: true,
			created_at: true
		}
	}, {
		$unwind: '$tags' // on ouvre le tableau des tags
	}, {
		$match: { // on ne regarde que les meilleurs calculés précédemment
			tags: {
				$in: top
			}
		}
	}, {
		$group: { // groupe par tag et année
			_id: {
				tag: '$tags',
				year: {
					$year: '$created_at'
				}
			},
			count: { // compte l'apparition de chaque tag
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

	return await agg2.toArray();
};