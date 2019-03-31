const MongoClient = require('mongodb').MongoClient;

// Top 10 des utilisateurs qui ont posté le plus
async function request2() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });

	let db = client.db(process.env.DATABASE_NAME);

	let users = await db.collection('users').find().sort('post_upload_count', -1).limit(10);
	
	// let names = await db.collection('users').find({id: '1'});

	await users.forEach(u => console.log(`post_upload_count: ${u.post_upload_count}, id: ${u.id}`));

	client.close();
}

request2();