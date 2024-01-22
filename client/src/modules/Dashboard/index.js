import React, { Fragment, useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import "../Dashboard/dashboard.css"
import Avtar from "../../images/avtar.jpg"
import { io } from "socket.io-client"

export default function Index() {


  const currentUserData = JSON.parse(localStorage.getItem("user:info"));
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);
  // console.log(messages);

  useEffect(() => {
    setSocket(io('http://localhost:5501'))
  }, []);

  useEffect(() => {
    console.log(socket?.connected);
    socket?.emit('addUser', currentUserData?.id);
    socket?.on('getUsers', users => {
      console.log("users:>>", users);
    });

    socket?.on('getMessage', data => {
      console.log(data);
      setMessages(prev => ({
        ...prev,
        messages: Array.isArray(prev.messages) ? [...prev.messages, { user: data.user, message: data.message }] : [{ user: data.user, message: data.message }]
      }))
    });
  }, [socket]);


  useEffect(() => {
    if (messageRef.current) messageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  const notify = () => toast.success('Welcome Back...');
  useEffect(() => {
    notify();
    const fetchConversations = async () => {
      const res = await fetch(`http://localhost:5500/api/conversations/${currentUserData?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await res.json();

      setConversations(resData);
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      const res = await fetch(`http://localhost:5500/api/users/${currentUserData?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await res.json();

      setContact(resData);
    }
    fetchContact();
  }, []);

  const fetchMessages = async (conversationId, user) => {
    // console.log(conversationId);
    const msgRes = await fetch(`http://localhost:5500/api/message/${conversationId}?senderId=${currentUserData?.id}&receiverId=${messages?.receiver?.receiverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const resData = await msgRes.json();
    setMessages({ messages: resData, receiver: user, conversationId });
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    socket?.emit('sendMessage', {
      conversationId: messages?.conversationId,
      senderId: currentUserData?.id,
      message,
      receiverId: messages?.receiver?.receiverId
    });
    if (!message) return;
    await fetch(`http://localhost:5500/api/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: currentUserData?.id,
        message,
        receiverId: messages?.receiver?.receiverId
      })
    });
    setMessage("");
  }



  return (
    <div className='boshboard main'>
      <div className="part1">

        <div className='my-mini-profile-section cursor-pointer'>
          <img className='image-avtar' src={Avtar} alt="Loading..." />
          <div>
            <h3>{currentUserData.fullName}</h3>
            <p>MyAccount</p>
          </div>
        </div>
        <hr />

        <div className="messages">
          <div>&nbsp;&nbsp;&nbsp;Messages </div>
          <div className="contacts">
            {
              conversations.length !== 0 ?
                conversations.map(({ conversation, user }, index) => {
                  return (
                    <Fragment key={index}>
                      <hr />
                      <div className='contact-section cursor-pointer' onClick={() => {
                        fetchMessages(conversation, user);
                      }}>
                        <img className={"status" === 'Available' ? 'image-avtar active' : 'image-avtar'} src={Avtar} alt="Loading..." />
                        <div>
                          <h4 className='p-m-0'>{user?.fullName}</h4>
                          <p className='p-m-0'>{user?.email}</p>
                        </div>
                      </div>
                    </Fragment>
                  )
                })
                : <div className='text-center mt-5'>
                  <div>Not Found any Conversation</div>
                  <div>Please Create Conversation</div>
                </div>

            }
          </div>
        </div>
      </div>
      <div className="part2">
        {
          messages?.receiver?.fullName &&
          <div className="resiver-profile">
            <div className='user-info'>
              <>
                <img className='image-avtar' src={Avtar} alt="Loading..." />
                <div>
                  <h4 style={{ color: '#212121' }} className='p-m-0'>{messages?.receiver?.fullName}</h4>
                  <p style={{ color: 'gray', fontWeight: '100' }} className='p-m-0'>{messages?.receiver?.email}</p>
                  {/* <p style={{ color: 'gray', fontWeight: '100' }} className='p-m-0'>{current.status === 'Available' ? 'Online' : 'Offline'}</p> */}
                </div>
              </>

            </div>
            <div className='call-section'>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <path d="M15 9l5 -5" />
                <path d="M16 4l4 0l0 4" />
              </svg>
            </div>
          </div>
        }
        <div className="chats-section">
          <div className='chats'>
            {
              messages?.messages?.length > 0 ?
                messages.messages.map(({ message, user: { id } = {} }, index) => {
                  return (
                    <Fragment key={index}>
                      <div className={id === currentUserData?.id ? "chat sender-chat" : "chat resiver-chat"}>
                        {message}
                      </div>
                      <div ref={messageRef}></div>
                    </Fragment>
                  )
                })
                :
                <div className='text-center'>No Messages or no Conversation Selected</div>
            }
          </div>
        </div>
        {
          messages?.receiver?.fullName &&
          <div className="typeing-input" onSubmit={(e) => { sendMessage(e) }}>
            <form>
              <input type="text" placeholder='Type a messages' value={message} onChange={(e) => setMessage(e.target.value)} required={true} />
              <button type='submit' disabled={!message.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 14l11 -11" />
                  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                </svg>
              </button>
            </form>
          </div>
        }
      </div>
      <div className="part3">
        <h3 className='text-center mt-3'>Contacts</h3>
        <div className="contacts">
          {
            contact.length > 0 ?
              contact.map(({ user }, index) => {
                return (
                  <Fragment key={index}>
                    <hr />
                    <div className='contact-section' onClick={() => { fetchMessages('new', user) }}>
                      <img className={"status" === 'Available' ? 'image-avtar active' : 'image-avtar'} src={Avtar} alt="Loading..." />
                      <div>
                        <h4 className='p-m-0'>{user.fullName}</h4>
                        <p className='p-m-0'>{user.email}</p>
                      </div>
                    </div>
                  </Fragment>
                )
              })
              :
              "empty"
          }
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  )
}
