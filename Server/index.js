import express from 'express';
import {PORT,mongoDBURL} from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';




const app = express();  

//Middleware for parsing request body 
app.use(express.json());

//Allow all orgins
app.use(cors());

// //Allow Custom Orgins
// app.use(
//     cors({
//     origin: 'http://localhost:3000',
//     methods:['GET','POST','PUT','DELETE'],
//     allowedHeaders: 'Content-Type',
//     })
// );

app.get('/' , (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to my first MERN Stack App')

});

app.use('/books',booksRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB');
    });