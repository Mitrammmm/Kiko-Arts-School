const UserModel = require("../models/user");

const cloudinary = require("cloudinary");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CourseModel = require("../models/course");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

cloudinary.config({
  cloud_name: "duuzlekjo",
  api_key: "964546775877152",
  api_secret: "EpeiuNMw5jIwjAimZs0MYqp3u3M",
});
class FrontController {
  //login - static method
  static login = async (req, res) => {
    try {
      // res.send("login page from FrontCntroller")
      res.render("login", {
        message: req.flash("success"),
        msg: req.flash("error"),
        // msgfp: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      //res.send("home page from FrontCntroller")
      res.render("register", { message: req.flash("success"),
      msg: req.flash("error"), });
    } catch (error) {
      console.log(error);
    }
  };
  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.userData;

      const animation = await CourseModel.findOne({
        user_id: id,
        course: "Animation",
      });
      const fineArt = await CourseModel.findOne({
        user_id: id,
        course: "FineArts",
      });
      const design = await CourseModel.findOne({
        user_id: id,
        course: "Design",
      });
      // console.log(btech)

      //res.send("home page from FrontCntroller")
      res.render("home", {
        n: name,
        i: image,
        e: email,
        design: design,
        animation: animation,
        fineArt: fineArt,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userData;
      //res.send("home page from FrontCntroller")
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userData;
      //res.send("home page from FrontCntroller")
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static userinsert = async (req, res) => {
    try {
      // console.log(req.files.image);
      //code to upload image to cloudinary
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "UserProfile",
      });
      //console.log(imageUpload)
      //res.send("home page from FrontCntroller")
      // console.log(req.body)
      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      //console.log(user)
      if (user) {
        req.flash("error", "email already exist");
        res.redirect("/register");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashpassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });

            //to save data
            const userData = await result.save();
            if (userData) {
              // req.flash('error','reg successful please login ')
              // res.redirect('/')

              //to generate login
              const token = jwt.sign({ ID: userData._id }, "ethensecretkey");
              // console.log(token)
              res.cookie("token", token);
              this.send_verify_mail(n, e, userData._id);
              req.flash("Success", "Registration successful.");
              res.redirect("/register");
            } else {
              req.flash("error", "not a Verified user user");
              res.redirect("/register");
            }
          } else {
            req.flash("error", "password & conform passsword does not match");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All fields are required!");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //send verify mail
  static send_verify_mail = async (n, e, user_id) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "saumitrapahalvan@gmail.com",
        pass: "kvyx unzs nmdz rdts",
      },
    });
    await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: e, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        n +
        ',Please click here to <a href="https://kiko-arts-school.onrender.com/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
  };

  static verify = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifyLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          //admin login
          if (user.role == "admin") {
            //to generate login
            const token = jwt.sign({ ID: user.id }, "ethensecretkey");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/admin/dashboard");
          } else {
            //to generate login
            const token = jwt.sign({ ID: user.id }, "ethensecretkey");
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/home");
          }
        } else {
          req.flash("error", "email & pass not valid");
          res.redirect("/"); //route path in redirect
        }
      } else {
        req.flash("error", "You are not a registered user");
        res.redirect("/"); //route path in redirect
      }
    } catch (error) {
      console.log(error);
    }
  };
  //for logout
  static logout = async (req, res) => {
    try {
      //to clear token
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  //for profile
  static profile = async (req, res) => {
    try {
      const { name, image, email, id } = req.userData;
      res.render("profile", { n: name, i: image, e: email });
    } catch {
      console.log(error);
    }
  };

  static updateProfile = async (req, res) => {
    try {
      // const {name,image,email,id} = req.userData;
      // console.log(req.body)
      // console.log(req.files.image)
      const { id } = req.userData;
      const { name, email } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID)

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userProfile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Profile Updated successfully");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  //change password
  static changepassword = async (req, res) => {
    try {
      const { id } = req.userData;
      //console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //forget password
  static forgetpassword = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Check Your email to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "Not an registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //for reset password
  static sendresetemail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "saumitrapahalvan@gmail.com",
        pass: "kvyx unzs nmdz rdts",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://https://kiko-arts-school.onrender.com//reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };

  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("resetPassword", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //for updating reset password
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
