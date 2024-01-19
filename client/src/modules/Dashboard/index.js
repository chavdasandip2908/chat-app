import React, { Fragment, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import "../Dashboard/dashboard.css"
import Avtar from "../../images/avtar.jpg"

export default function Index() {
  const notify = () => toast.success('Welcome Back...');
  const currentUserData = JSON.parse(localStorage.getItem("user:info"));
  useEffect(() => {
    notify()
    const fetchConversations = async () => {
      // const res = await fetch(`http://localhost:5500/api/conversations/${currentUserData.id}`, {
      const res = await fetch(`http://localhost:5500/api/conversations/659ef9bb6022c3e5efb4dd4a`, {
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

  const fetchMessages = async (conversationId) => {
    // console.log(conversationId);
    const msgRes = await fetch(`http://localhost:5500/api/message/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const resData = await msgRes.json();
    setMessages(resData);
  }

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  console.log(messages);


  const contact = [
    {
      name: 'Sandip',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Pradip',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Hardik',
      status: 'Not Available',
      img: Avtar
    },
    {
      name: 'Rakesh',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Anand',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Krunal',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Krunal',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Krunal',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Krunal',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Krunal',
      status: 'Available',
      img: Avtar
    },
    {
      name: 'Sandip',
      status: 'Available',
      img: Avtar
    }
  ]
  const current = {
    id: 1,
    name: "Rahul",
    status: 'Available'
  }



  return (
    <div className='boshboard main'>
      <div className="part1">

        <div className='my-mini-profile-section'>
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
                      <div className='contact-section' onClick={() => {
                        fetchMessages(conversation);
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
        <div className="resiver-profile">
          <div className='user-info'>
            <img className='image-avtar' src={Avtar} alt="Loading..." />
            <div>
              <h4 style={{ color: '#212121' }} className='p-m-0'>Hello</h4>
              <p style={{ color: 'gray', fontWeight: '100' }} className='p-m-0'>{current.status === 'Available' ? 'Online' : 'Offline'}</p>
            </div>
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

        <div className="chats-section">
          <div className='chats'>
            {/* <div className="chat resiver-chat">
              Hello
            </div>
            <div className="chat sender-chat">
              Hello
            </div> */}
            {
              messages.length > 0 ?
                messages.map(({ message, user: { id } = {} }, index) => {
                  return (
                    <div key={index} className={id === currentUserData?.id ? "chat sender-chat" : "chat resiver-chat"}>
                      {message}
                    </div>
                  )
                }) :
                <div className='text-center'>No Messages</div>
            }
          </div>
        </div>

        <div className="typeing-input">
          <form>
            <input type="text" placeholder='Type a messages' />
          </form>
          <button type='submit'>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 14l11 -11" />
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          </button>
        </div>
      </div>
      <div className="part3">
        <h3 className='text-center mt-3'>Contacts</h3>
        <div className="contacts">
          {
            contact.map(({ name, status, img }, index) => {
              return (
                <Fragment key={index}>
                  <hr />
                  <div className='contact-section'>
                    <img className={status === 'Available' ? 'image-avtar active' : 'image-avtar'} src={img} alt="Loading..." />
                    <div>
                      <h4 className='p-m-0'>{name}</h4>
                      <p className='p-m-0'>{status}</p>
                    </div>
                  </div>
                </Fragment>
              )
            })
          }
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  )
}
