module.exports = async db => {
	let agg = await db.collection('posts').aggregate([{
		$group: { // Groupe par année
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

	let arr = await agg.toArray();
	console.log(arr);

	return arr;
};