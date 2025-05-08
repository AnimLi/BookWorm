import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,

        },
        profileImage:{
            type:String,
            default:"",
        },
    }, 
    {timestamps:true}//timestamps will add createdAt and updatedAt fields
);

// hash password before saving user to database
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);

    //123 -- hash --> asda!@!Aasa
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

//compare password function
userSchema.methods.comparePassword = async function(userdPassword) {
    return await bcrypt.compare(userdPassword, this.password);
};

const User = mongoose.model("User", userSchema);
//users collection

export default User;