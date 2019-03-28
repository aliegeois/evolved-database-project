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
 * @param {number} id 
 * @returns {Promise<{id: string, created_at: string, name: string, post_count: number, category: string}>}
 */
function getTag(id) {
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

					resolve(clean);

					/*stream.write(JSON.stringify(clean) + '\n', err => {
						err ? reject(err) : resolve();
					});*/
				} else {
					reject();
				}
			})
			.catch(reject);
	});
}

/**
 * 
 * @param {number} id 
 * @return {Promise<{id: string, created_at: string, name: string, inviter_id: string, level: string, post_upload_count: number}>}
 */
function getUser(id) {
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
						post_upload_count: 0
					};

					resolve(clean);

					/*stream.write(JSON.stringify(clean) + '\n', err => {
						err ? reject(err) : resolve();
					});*/
				} else {
					reject();
				}
			})
			.catch(reject);
	});
}

/*let main = async () => {
	//fs.writeFileSync('users.json', '');
	//fs.writeFileSync('tags.json', '');
	let userStream = fs.createWriteStream('users.json');
	//let tagStream = fs.createWriteStream('tags.json');

	for(let i = 4315; i < 5000; i++)
		await getUser(userStream, i).catch(console.log);
	//for(let i = 1; i < 50; i++)
	//	await getTag(tagStream, i).catch(console.log);
	
	userStream.end();
	//tagStream.end();
};*/

let //posts = new Set(),
	tags = new Set(),
	users = new Set();

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, async (err, client) => {
	if(err)
		throw err;
	
	const db = client.db('project-database');

	db.collections().then(collections => {

		console.log(collections);
		client.close();
	});

	let collections = await db.collections();

	let c_posts,
		c_tags,
		c_users;
	
	if((c_posts = collections.find(c => c.name === 'posts')) === undefined)
		c_posts = await db.createCollection('posts');
	if((c_tags = collections.find(c => c.name === 'tags')) === undefined)
		c_tags = await db.createCollection('tags');
	if((c_users = collections.find(c => c.name === 'users')) === undefined)
		c_users = await db.createCollection('users');

	// const c_posts = await db.createCollection('posts');
	// const c_tags = await db.createCollection('tags');
	// const c_users = await db.createCollection('users');



	//const collection = db.collection('posts');


	// db.dropCollection('posts').finally(() => {
	// 	db.createCollection('posts');
	// });

	// collection.createIndex('id').then(value => {
	// 	console.log(value);
	// 	client.close();
	// });

	// collection.find({}).toArray((err, result) => {
	// 	if(err)
	// 		throw err;
		
	// 	console.log(result);

	// 	client.close();
	// });



	let read = fs.createReadStream('2018000000000000.json');

	let tmp = '';

	read.on('data', chunck => {
		tmp += chunck.toString();

		let str = '';
		let lines = [];
		for(let i = 0; i < tmp.length; i++) {
			if(tmp[i] === '\n') {
				lines.push(JSON.parse(str));
				str = '';
			} else {
				str += tmp[i];
			}
		}
		tmp = str;

		for(let l_post of lines) {
			if(users.has(l_post.uploader_id)) {
				c_users.findOneAndUpdate({ // Trouve l'utilisateur et incrémente son compteur de posts
					id: l_post.uploader_id
				}, {
					$inc: { 'post_upload_count': 1 }
				}).catch(console.log);
			} else {
				users.add(l_post.uploader_id);
				getUser(l_post.uploader_id).then(user => {
					user.post_upload_count = 1;
					c_users.insertOne(user);
				}).catch(console.log);
			}

			for(let l_tag of l_post.tags) {
				if(tags.has(l_tag.id)) {
					c_tags.findOneAndUpdate({
						id: l_tag.id
					}, {
						$inc: { 'post_count': 1 }
					}).catch(console.log);
				} else {
					tags.add(l_tag.id);
					getTag(l_tag.id).then(tag => {
						tag.post_count = 1;
						c_tags.insertOne(tag).catch(console.log);
					}).catch(console.log);
				}
			}


			let cooked = {
				id: l_post.id,
				uploader_id: l_post.uploader_id,
				created_at: l_post.created_at,
				tags: l_post.tags.map(t => t.id),
				rating: l_post.rating,
				image_width: l_post.image_width,
				image_height: l_post.image_height,
				file_ext: l_post.file_ext,
				approver_id: l_post.approver_id,
				file_size: l_post.file_size,
				up_score: l_post.up_score,
				down_score: l_post.down_score,
				parent: l_post.parent
			};
	
			c_posts.insertOne(cooked).catch(console.log);
		}
	});

	read.on('end', () => {
		client.close();
	});
});


//main();