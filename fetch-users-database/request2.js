const MongoClient = require('mongodb').MongoClient;



// Top 10 des utilisateurs qui ont posté le plus
function request2() {
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, async (err, client) => {
        if(err) {
            throw err;
        }
    
        const db = client.db('bdd_project_light');

        let users = await db.collection('users').find().sort("post_upload_count", -1).limit(10);
        
        /*users.forEach(elem => {
            console.log(elem);
        });*/
       
        let names = await db.collection('users').find({id: "1"});
        names.forEach(console.log);

    });

}

request2();