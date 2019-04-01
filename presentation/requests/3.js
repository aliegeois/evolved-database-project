module.exports = async (db) => {
	let tags = await db.collection('tags').find().sort('post_count', -1).limit(10);
	
	return await tags.toArray();
};