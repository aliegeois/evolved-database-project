const MongoClient = require('mongodb').MongoClient;

// Top 10 des tags sur lesquels les utilisateurs postent le plus
async function request2() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);

	let tags = await db.collection('tags').find().sort('post_count', -1).limit(10);
	
	// let names = await db.collection('users').find({id: '1'});
	
	await tags.forEach(u => console.log(`post_count: ${u.post_count}, name: ${u.name}`));

	client.close();
}

request2();