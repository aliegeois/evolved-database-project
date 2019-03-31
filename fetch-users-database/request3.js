const MongoClient = require('mongodb').MongoClient;

// Top 10 des tags sur lesquels les utilisateurs postent le plus
<<<<<<< HEAD
function request2() {
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, async (err, client) => {
        if(err) {
            throw err;
        }
    
        const db = client.db('bdd_project_light');

        let users = await db.collection('tags').find().sort("post_count", -1).limit(10);
        
        users.forEach(elem => {
            console.log(elem);
        });
       
=======
async function request2() {
	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	
	let db = client.db(process.env.DATABASE_NAME);
>>>>>>> 95b2f0a8e3bc6ffeb44fcd664a81e6d086ccb0f1

	let tags = await db.collection('tags').find().sort('post_count', -1).limit(10);
	
	// let names = await db.collection('users').find({id: '1'});
	
	await tags.forEach(u => console.log(`post_count: ${u.post_count}, name: ${u.name}`));

	client.close();
}

request2();