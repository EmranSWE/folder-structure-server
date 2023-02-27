const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://imran:folderUser@cluster0.cnzafpx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const folderCollection = client.db('folder-structure').collection('folder');

        //Create a new folder
        app.post('/folders', async (req, res) => {
            const folder = req.body;
            const result = await folderCollection.insertOne(folder);
            res.send(result)
        });

        //Get the created folder
        app.get('/folders', async (req, res) => {
            const result = await folderCollection.find().toArray();
            res.send(result)
        });

        //Get only one folder details
        app.get('/folder/:id', async (req, res) => {
            const folderId = req.params.id;
            const query = { _id: ObjectId(folderId) }
            const result = await folderCollection.findOne(query);
            res.send(result)
        });

        // Delete folder
        app.delete('/folders/:id', async (req, res) => {
            const folderId = req.params.id;
            const root = '63fcaf338e8b8c5ebac79717';
            if (folderId === root) {
                res.status(400).send({ message: 'Cannot delete root folder' });
            } else {
                const query = { _id: new ObjectId(folderId)};
                const result = await folderCollection.deleteOne(query);
                res.send(result);
            }
        });
    }
    finally {
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`The live running  ${port}`)
})