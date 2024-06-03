import express from 'express';
import { Book } from '../models/bookModel.js';
import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs'; // To delete files


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const placeholderImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'; // URL of the placeholder image


const router = express.Router();

// //Route for Save a new Book 
// router.post('/', upload.single('image'), async (request, response) => {       
//     try{
//         let imageUrl = '';
//         if(
//         !request.body.title ||
//         !request.body.author ||
//         !request.body.publishYear
//         ){
//             return response.status(400).send({message: 'Please enter all fields'})
//         }
//         const newBook ={
//             title: request.body.title,
//             author: request.body.author,
//             publishYear: request.body.publishYear,
//         };

//         const book = await Book.create(newBook);

//         return response.status(201).send(book);

//     }catch(error){
//         console.log(error);
//         return response.status(500).send({message: error.message})
//     }
// });

// Route for Save a new Book
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, author, publishYear } = req.body;
        let imageUrl = placeholderImageUrl;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            // Delete the local file after upload
            fs.unlinkSync(req.file.path);
        }

        const newBook = { title, author, publishYear, image: imageUrl };
        const book = await Book.create(newBook);
        return res.status(201).send(book);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
});

//Route for get all books from database 
router.get('/', async (request, response) => {
    try{
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books

    });

       
    }catch(error){
        console.log(error);
        return response.status(500).send({message: error.message})
    }
});

//Route to get one book based off of the ID 
router.get('/:id', async (request, response) => {
    try{

        const book = await Book.findById(request.params.id);
        
        return response.status(200).json(book);

       
    }catch(error){
        console.log(error);
        return response.status(500).send({message: error.message})
    }
});

// //Route for update a book 
// router.put('/:id', async (request, response) => {
//     try{
//         if(
//             !request.body.title ||
//             !request.body.author ||
//             !request.body.publishYear
//             ){
//                 return response.status(400).send({message: 'Please enter all fields'})
//             }

//             const result = await Book.findByIdAndUpdate(request.params.id, request.body);

//             if(!result){
//                 return response.status(404).send({message: 'Book not found'})
//             }

//             return response.status(200).send({message: 'Book updated successfully'})
            
//     }catch(error){
//         console.log(error);
//         return response.status(500).send({message: error.message})
//     }
// });

// Route for update a book
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, author, publishYear } = req.body;
        let updateData = { title, author, publishYear };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.image = result.secure_url;
            // Delete the local file after upload
            fs.unlinkSync(req.file.path);
        }

        const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!book) {
            return res.status(404).send({ message: 'Book not found' });
        }

        return res.status(200).send({ message: 'Book updated successfully', book });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
});

//Route for delete a book
router.delete('/:id', async (request, response) => {
    try{
        const result = await Book.findByIdAndDelete(request.params.id);

        if(!result){
            return response.status(404).send({message: 'Book not found'})
        }

        return response.status(200).send({message: 'Book deleted successfully'})
    }catch(error){
        console.log(error);
        return response.status(500).send({message: error.message})
    }
});


export default router;