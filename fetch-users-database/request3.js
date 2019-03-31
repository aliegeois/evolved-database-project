const MongoClient = require('mongodb').MongoClient;



// Top 10 des tags sur lesquels les utilisateurs postent le plus
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
       

    });

}

request2();