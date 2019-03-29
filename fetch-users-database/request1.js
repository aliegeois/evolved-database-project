const MongoClient = require('mongodb').MongoClient;

function toPercentage(nb) {
    return nb.toPrecision(2)*100;
}


// Proportion de posts considérés comme "safe" (rating s)
async function request1() {
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, async (err, client) => {
        if(err) {
            throw err;
        }    
    
        const db = client.db('bdd_project_light');

        let nbSafe = await db.collection('posts').countDocuments({ rating: 's' });
        let nbTotal = await db.collection('posts').countDocuments();
        console.log("Proportion de posts safe : ", nbSafe, "/", nbTotal, " = ", toPercentage(nbSafe/nbTotal) + "%");
        
    });

}

request1();