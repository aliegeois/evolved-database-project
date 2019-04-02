module.exports = async db => {
	let nbSafe = await db.collection('posts').countDocuments({ rating: 's' });
	let nbQuestionable = await db.collection('posts').countDocuments({ rating: 'q' });
	let nbExplicit = await db.collection('posts').countDocuments({ rating: 'e' });
	let nbTotal = await db.collection('posts').countDocuments();

	return {
		safeRate: nbSafe / nbTotal,
		questionableRate: nbQuestionable / nbTotal,
		explicitRate: nbExplicit / nbTotal
	};

};