const cloudinary=require('cloudinary').v2;

exports.uploadImageToCloudinary=async(file,folder,height,width,quality)=>{
    const options={folder};
    if(height && width){
        options.width=width;
        options.height=height;
    }
    
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}


