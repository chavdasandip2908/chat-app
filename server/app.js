const express = require('express');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Connect DB
require('./db/connection');

//Imports files
const Users = require('./models/User');
const Conversations = require('./models/Conversations');
const Messages = require('./models/Messages');

// app Use
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', Users, (req, res) => {
    res.send("Hello World")
})
// register api 
app.post('/api/register', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            // throw new Error("Missing data");
            return res.status(400).send('Missing fields');
        } else {
            // cheach email is already exist

            // const isAlreadyExits = Users.findByEmail(email);
            const isAlreadyExits = await Users.findOne({ email });
            if (isAlreadyExits) {
                return res.status(400).send('User Already exists');
            }
            else {
                const newUser = new Users({ fullName, email });
                bcryptjs.hash(password, 10, (error, hashPassword) => {
                    if (error) throw error;
                    // newUser.password = hashPassword;
                    newUser.set('password', hashPassword);
                    newUser.save();
                    next();
                })
                res.status(200).send('user Save Successfully');

            }
        }
    } catch (error) {
        throw new Error(error);
    }
})

// login api /api/login
app.post("/api/login", async (req, res, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Missing fields');
        }
        else {
            const user = await Users.findOne({ email });
            if (!user) {
                return res.status(400).send('User email and password is incorrect');
            }
            else {
                const validPassord = await bcryptjs.compare(password, user.password);
                if (!validPassord) {
                    return res.status(400).send("Invalid Password");
                }
                else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }

                    const JWT_SECREAT_KEY = process.env.JWT_SECREAT_KEY || 'THIS_IS_JWT_SECRET_KEY';
                    let token = jwt.sign(payload, JWT_SECREAT_KEY, { expiresIn: 84600 }, async (error, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        next();
                    })
                    res.status(200).json({ user: { email: user.email, fullName: user.fullName }, token: user.token })
                }
            }
        }

    } catch (error) {
        throw new Error(error);
    }
});

// coversations api 
app.post('/api/conversation', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversations({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).send('conversation created successfully');
    } catch (error) {
        throw new Error(error);
    }
});


// get conversation
app.get("/api/conversation/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        // get conversation user data using map
        const conversationsUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            // find receiver by id
            const user = await Users.findById(receiverId);
            // return filter user link return only email, fullName, conversationId
            return { user: { fullName: user.fullName, email: user.email }, conversation: conversation._id }
        }))
        res.status(200).json(await conversationsUserData);
    } catch (error) {
        throw new Error(error);
    }
})

// send message api
app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = "" } = req.body;
        if (!senderId) return res.status(400).json("Missing fields");
        if (!conversationId && receiverId) {
            const newConversation = new Conversations({ members: [senderId, receiverId] });
            await newConversation.save();
            const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).send("Message send successfully")
        }
        else if (!conversationId && !receiverId) {
            return res.status(400).send("please fill all required fields");
        }

        const newMessage = new Messages({ conversationId, senderId, message });
        await newMessage.save();
        res.status(200).send("Message send successfully")
    }
    catch (error) {
        throw new Error(error);
    }

});

// get messages 
app.get('/api/message/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        if (!conversationId) return res.status(200).json([]);
        const messages = await Messages.find({ conversationId });
        // get messages user data using map
        const messageUserData = Promise.all(messages.map(async (message) => {
            // find sender by id
            const user = await Users.findById(message.senderId);
            // return filter user link return only email, fullName, messages
            return { user: { fullName: user.fullName, email: user.email }, message: message.message }
        }));
        res.status(200).json(await messageUserData);
    } catch (error) {
        throw new Error(error);
    }
})

// get users
app.get("/api/users", async (req, res) => {
    try {
        const users = await Users.find();
        const userData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, fullName: user.fullName }, userId: user._id }
        }));
        res.status(200).json(await userData);

    } catch (error) {
        throw new Error(error);
    }
})

app.listen(5500);
