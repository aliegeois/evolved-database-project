module.exports = async db => {
	let users = await db.collection('users').find().sort('post_upload_count', -1).limit(1),
		top = (await users.toArray()).map(e => e.id);

	let agg2 = await db.collection('posts').aggregate([{
		$project: { // On coupe verticalement
			_id: null,
			tags: true,
			uploader_id: true
		}
	}, {
		$match: { // on ne regarde que les meilleurs calculés précédemment
			uploader_id: {
				$in: top
			}
		}
	}, {
		$unwind: '$tags' // on ouvre le tableau des tags
	}, {
		$group: { // groupe par tag
			_id: {
				tag: '$tags',
				uploader_id: '$uploader_id'
			},
			count: { // compte l'apparition de chaque tag
				$sum: 1
			}
		}
	}, {
		$sort: { // trie par count décroissant
			count: -1
		}
	}, {
		$limit: 10
	}, {
		$lookup: {
			from: 'tags',
			localField: '_id.tag',
			foreignField: 'id',
			as: 'name'
		}
	}]);

	return await agg2.toArray();
};