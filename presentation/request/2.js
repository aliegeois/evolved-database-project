module.exports = async db => {
	let users = await db.collection('users').find().sort('post_upload_count', -1).limit(10);
	
	return await users.toArray();
};