const fs = require('fs'),
	// request = require('request-promise-native'),
	mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient;

async function main() {
	let begin = new Date();

	let files = fs.readdirSync('metadata');

	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	let db = client.db(process.env.DATABASE_NAME);

	let collections = await db.collections();

	let /** @type {mongodb.Collection} */ c_users,
		/** @type {mongodb.Collection} */ c_tags,
		/** @type {mongodb.Collection} */ c_posts;
	
	if((c_users = collections.find(c => c.name === 'users')) === undefined)
		c_users = await db.createCollection('users');
	if((c_tags = collections.find(c => c.name === 'tags')) === undefined)
		c_tags = await db.createCollection('tags');
	if((c_posts = collections.find(c => c.name === 'posts')) === undefined)
		c_posts = await db.createCollection('posts');

	let p_users = {},
		p_tags = {};
	
	let ended = 0;
	let end = async () => {
		if((++ended) == files.length) {
			if(Object.keys(p_users).length > 0)
				await c_users.insertMany(Object.values(p_users)).catch(console.log);
			if(Object.keys(p_tags).length > 0)
				await c_tags.insertMany(Object.values(p_tags)).catch(console.log);
			
			await c_users.createIndex({ post_upload_count: 1 });
			await c_tags.createIndex({ name: 1 });
			await c_tags.createIndex({ post_count: 1 });
			await c_posts.createIndex({ uploader_id: 1 });
			await c_posts.createIndex({ created_at: 1 });
			await c_posts.createIndex({ rating: 1 });
			await c_posts.createIndex({ file_size: 1 });
			
			console.log(`${new Date() - begin} ms`); // 1er test, 174158 posts, 35,920 secondes

			client.close();
		}
	};
	
	for(let file of files) { // TODO: pour des petits tests pas la peine d'inclure tous les fichiers
		let tmp = '';
		let reader = fs.createReadStream(`metadata/${file}`);

		reader.on('data', chunck => {
			// agrégation des bouts de données reçus par read.ondata
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

			let // m_users = {},
				// m_tags = {},
				posts = [];

			for(let l_post of lines) {
				// if(m_users[l_post.uploader_id] !== undefined) {
				// 	m_users[l_post.uploader_id].post_upload_count++;
				// } else {
				// 	m_users[l_post.uploader_id] = {
				// 		id: l_post.uploader_id,
				// 		post_upload_count: 1
				// 	};
				// }

				if(p_users[l_post.uploader_id] !== undefined) {
					p_users[l_post.uploader_id].post_upload_count++;
				} else {
					p_users[l_post.uploader_id] = {
						id: parseInt(l_post.uploader_id),
						post_upload_count: 1
					};
				}

				for(let l_tag of l_post.tags) {
					// if(m_tags[l_tag.id] !== undefined) {
					// 	m_tags[l_tag.id].post_count++;
					// } else {
					// 	m_tags[l_tag.id] = {
					// 		id: l_tag.id,
					// 		name: l_tag.name,
					// 		category: l_tag.category,
					// 		post_count: 1
					// 	};
					// }

					if(p_tags[l_tag.id] !== undefined) {
						p_tags[l_tag.id].post_count++;
					} else {
						p_tags[l_tag.id] = {
							id: parseInt(l_tag.id),
							name: l_tag.name,
							category: parseInt(l_tag.category),
							post_count: 1
						};
					}
				}

				posts.push({
					id: parseInt(l_post.id),
					uploader_id: parseInt(l_post.uploader_id),
					created_at: new Date(l_post.created_at),
					tags: l_post.tags.map(t => parseInt(t.id)),
					rating: l_post.rating,
					image_width: parseInt(l_post.image_width),
					image_height: parseInt(l_post.image_height),
					file_ext: l_post.file_ext,
					// approver_id: l_post.approver_id,
					file_size: parseInt(l_post.file_size),
					up_score: parseInt(l_post.up_score),
					down_score: parseInt(l_post.down_score),
					parent: l_post.parent ? parseInt(l_post.parent) : null
				});
			}

			c_posts.insertMany(posts).catch(console.log);
		});

		reader.on('end', end);
	}
}

main();