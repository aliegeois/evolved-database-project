const fs = require('fs'),
	// request = require('request-promise-native'),
	mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient;

async function main() {
	let files = fs.readdirSync('metadata');

	let client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	const db = client.db('danbooru');

	const collections = await db.collections();

	let /** @type {mongodb.Collection} */ c_users,
		/** @type {mongodb.Collection} */ c_tags,
		/** @type {mongodb.Collection} */ c_posts;
	
	if((c_users = collections.find(c => c.name === 'users')) === undefined)
		c_users = await db.createCollection('users');
	if((c_tags = collections.find(c => c.name === 'tags')) === undefined)
		c_tags = await db.createCollection('tags');
	if((c_posts = collections.find(c => c.name === 'posts')) === undefined)
		c_posts = await db.createCollection('posts');
	
	for(let file of files) { // TODO: pour des petits tests pas la peine d'inclure tous les fichiers
		let tmp = '';
		let read = fs.createReadStream(`metadata/${file}`);

		read.on('data', chunck => {
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

			let m_users = {},
				m_tags = {},
				posts = [];

			for(let l_post of lines) {
				if(m_users[l_post.uploader_id] !== undefined) {
					m_users[l_post.uploader_id].post_upload_count++;
				} else {
					m_users[l_post.uploader_id] = {
						id: l_post.uploader_id,
						post_upload_count: 1
					};
				}

				for(let l_tag of l_post.tags) {
					if(m_tags[l_tag.id] !== undefined) {
						m_tags[l_tag.id].post_count++;
					} else {
						m_tags[l_tag.id] = {
							id: l_tag.id,
							name: l_tag.name,
							category: l_tag.category,
							post_count: 1
						};
					}
				}

				posts.push({
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
				});
			}

			if(Object.keys(m_users).length > 0)
				c_users.insertMany(Object.values(m_users)).catch(console.log);
			if(Object.keys(m_tags).length > 0)
				c_tags.insertMany(Object.values(m_tags)).catch(console.log);
			c_posts.insertMany(posts).catch(console.log);
		});
	}
}

main();