module.exports = async (db) => {
	let nbSafe = await db.collection('posts').countDocuments({ rating: 's' });
	let nbTotal = await db.collection('posts').countDocuments();

	return { safeRate: nbSafe / nbTotal };
};