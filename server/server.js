import express from 'express';
import { Request } from 'express';
import { Response } from 'express';
import cors from 'cors';

const app = express();
const port = "8888";


// app.use(express.json());
// app.use(cors());


app.listen(port, () =>{
    console.log(`Listening on port ${port}`);
} );