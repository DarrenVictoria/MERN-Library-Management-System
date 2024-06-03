import { v2 as cloudinary } from 'cloudinary';

export const PORT = 5555;
export const mongoDBURL = 'mongodb+srv://root:root@book-store-mern.w8ocskh.mongodb.net/?retryWrites=true&w=majority&appName=Book-Store-MERN';

cloudinary.config({
    cloud_name: 'dhqynpx8t',
    api_key: '325653143883544',
    api_secret: 'pWm2bAPW1USXnuNszZHAik-03Gs'
});