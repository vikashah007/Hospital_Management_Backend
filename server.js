import app from "./app.js"
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


app.listen(4000,()=>{
    console.log(`server is listening at ${process.env.PORT} port`)
})