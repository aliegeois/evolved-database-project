module.exports = async db => {
	let agg = await db.collection('posts').aggregate([{
		$project: { // On coupe verticalement
			_id: null,
			tags: true,
			uploader_id: true,
			file_size: true
		}
	}, {
		$group: { // groupe par tag
			_id: {
				uploader_id: '$uploader_id'
			},
			count: { // compte l'apparition de chaque tag
				$sum: '$file_size'
			}
		}
	}, {
		$sort: { // trie par count décroissant
			count: -1
		}
	}, {
		$limit: 10
	}]);

	return await agg.toArray();
};