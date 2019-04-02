module.exports = async db => {
	let agg = await db.collection('posts').aggregate([{
		$group: { // Groupe par année
			_id: {
				year: {
					$year: '$created_at'
				},
				month: {
					$month: '$created_at'
				}
			},
			count: {
				$sum: 1
			}
		}
	}, {
		$sort: {
			'_id.year': 1,
			'_id.month': 1
		}
	}]);

	return await agg.toArray();
};