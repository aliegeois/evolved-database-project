const express = require('express'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	port = 8080;

let client,
	db;

app.use(express.static('public'));

app.get(/^\/request\/[0-9]+$/, async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let id = req.url.split('/')[2];
	try {
		let mongoRequest = require(`./request/${id}`);
		let result = await mongoRequest(db);
		console.log(result);
		res.end(JSON.stringify(result));
	} catch(err) {
		res.end(JSON.stringify({ error: err }));
	}
});

app.listen(port, async () => {
	client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
	db = client.db(process.env.DATABASE_NAME);

	console.info(`listening on port ${port}`);
});

process.on('SIGINT', async () => {
	await client.close();
	process.exit();
});