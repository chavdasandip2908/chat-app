const express = require('express');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const io = require("socket.io")(5501, {
    cors: {
        origin: "http://localhost:3000",

    }
});

// Connect DB
require('./db/connection');

//Imports files
const Users = require('./models/User');
const Conversations = require('./models/Conversations');
const Messages = require('./models/Messages');
const { Socket } = require('socket.io');

// app Use
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Socket.io
let users = [];
io.on('connection', socket => {
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id }
            users.push(user)
            // console.log(users);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                receiverId,
                message,
                conversationId,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
            });
        }
    });


    socket.on('disconnected', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
});

// Routes
app.get('/', Users, (req, res) => {
    res.send("Hello World")
})
// register api 
app.post('/api/register', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'Missing data', code: 'MISSING_FIELDS' });
        } else {
            // cheach email is already exist
            const isAlreadyExits = await Users.findOne({ email });
            if (isAlreadyExits) {
                return res.status(400).send({ error: 'User already exists', code: 'USER_EXISTS' });
            }
            else {
                const newUser = new Users({ fullName, email });
                bcryptjs.hash(password, 10, (error, hashPassword) => {
                    if (error) throw error;
                    newUser.set('password', hashPassword);
                    newUser.save();
                    next();
                })
                res.status(200).json({ message: 'User saved successfully', code: 'USER_SAVED_SUCCESS' });
            }
        }
    } catch (error) {
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
        // throw new Error(error);
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
                return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'User not found' });
            }
            else {
                const validPassord = await bcryptjs.compare(password, user.password);
                if (!validPassord) {
                    return res.status(401).json({ code: 'INCORRECT_PASSWORD', message: 'Incorrect password' });
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
                    return res.status(200).json({ code: 'USER_LOGIN_SUCCESS', message: 'User login successful', token: user.token, user: { id: user._id, fullName: user.fullName, email: user.email } });
                }
            }
        }

    } catch (error) {
        // throw new Error(error);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
});

// coversations api 
app.post('/api/conversations', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversations({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).send('Conversation created successfully');
    } catch (error) {
        throw new Error(error);
    }
});


// get conversation
app.get("/api/conversations/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        // get conversation user data using map
        const conversationsUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, fullName: user.fullName, email: user.email }, conversation: conversation._id }
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
        if (conversationId === 'new' && receiverId) {
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
        const checkMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, fullName: user.fullName, email: user.email }, message: message.message }
            }));
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkCoversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });

            if (checkCoversation.length > 0) {
                checkMessages(checkCoversation[0]._id);
            }
            else {
                return res.status(200).json([])
            }
        }
        else {
            checkMessages(conversationId);
        }

    } catch (error) {
        throw new Error(error);
    }
})

// get users
app.get("/api/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });
        const userData = Promise.all(users.map(async (user) => {
            return { user: { receiverId: user._id, email: user.email, fullName: user.fullName } }
        }));
        res.status(200).json(await userData);

    } catch (error) {
        throw new Error(error);
    }
})

app.listen(5500);
