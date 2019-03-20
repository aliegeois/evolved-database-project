const fs = require('fs'),
	request = require('request-promise-native'),
	MongoClient = require('mongodb').MongoClient;

//let array = [];

/*let showElement = jvalue => {
	let div = document.createElement('div'),
		pre = document.createElement('pre');
	pre.innerHTML = JSON.stringify(jvalue).replace('\n', '');
	div.appendChild(pre);
	output.appendChild(div);
}*/

/**
 * 
 * @param {fs.WriteStream} stream 
 * @param {number} id 
 */
let getTag = (stream, id) => {
	return new Promise((resolve, reject) => {
		request(`https://danbooru.donmai.us/tags/${id}.json`)
			.then(data => {
				data = JSON.parse(data);
				if(data.success !== false) {
					let clean = {
						id: data.id,
						created_at: data.created_at,
						name: data.name,
						post_count: 0,
						category: data.category
					};

					stream.write(JSON.stringify(clean) + '\n', err => {
						err ? reject(err) : resolve();
					});
				} else {
					resolve();
				}
			})
			.catch(resolve);
	});
};

/**
 * 
 * @param {fs.WriteStream} stream 
 * @param {number} id 
 */
let getUser = (stream, id) => {
	return new Promise((resolve, reject) => {
		request(`https://danbooru.donmai.us/users/${id}.json`)
			.then(data => {
				data = JSON.parse(data);
				if(data.success !== false) {
					let clean = {
						id: data.id,
						created_at: data.created_at,
						name: data.name,
						inviter_id: data.inviter_id,
						level: data.level,
						post_updload_count: 0
					};

					stream.write(JSON.stringify(clean) + '\n', err => {
						err ? reject(err) : resolve();
					});
				} else {
					resolve();
				}
			})
			.catch(reject);
	});
};

let main = async () => {
	//fs.writeFileSync('users.json', '');
	//fs.writeFileSync('tags.json', '');
	let userStream = fs.createWriteStream('users.json');
	//let tagStream = fs.createWriteStream('tags.json');

	for(let i = 3367; i < 5000; i++)
		await getUser(userStream, i).catch(console.log);
	//for(let i = 1; i < 50; i++)
	//	await getTag(tagStream, i).catch(console.log);
	
	userStream.end();
	//tagStream.end();
};

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
	if(err)
		throw err;
	
	const db = client.db('projet-database');

	const collection = db.collection('tags');

	collection.find({}).toArray((err, result) => {
		if(err)
			throw err;
		
		console.log(result);

		client.close();
	});

	/*collection.drop().then(() => {
		client.close();
	}).catch(console.log);*/

	/*fs.readFile('tags-1-49.json', (err, raw) => {
		if(err)
			throw err;

		let data = raw.toString('utf-8');
		let lines = data.split('\n');

		let ended = 0;
		let end = () => {
			if((++ended) === lines.length) {
				client.close();
			}
		};
		
		for(let line of lines) {
			try {
				let cooked = JSON.parse(line);
				collection.insertOne(cooked, end);
			} catch(err) {}
		}
	});*/
});


//main();