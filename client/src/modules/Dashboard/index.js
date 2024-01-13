import React, { Fragment } from 'react'
import "../Dashboard/dashboard.css"
import Avtar from "../../images/avtar.jpg"

export default function index() {
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
            <h3>Dashboard</h3>
            <p>MyAccount</p>
          </div>
        </div>
        <hr />

        <div className="messages">
          <div>&nbsp;&nbsp;&nbsp;Messages </div>
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
            <div className="chat resiver-chat">
              Hello
            </div>
            <div className="chat sender-chat">
              Hello
            </div>
            <div className="chat resiver-chat">
              How are you?
            </div>
            <div className="chat resiver-chat">
              Where are you?
            </div>
            <div className="chat sender-chat">
              I am fine.
            </div>
            <div className="chat sender-chat">
              Ahmedabad.
            </div>
            <div className="chat resiver-chat">
              In which company have you worded?
            </div>
            <div className="chat sender-chat">
              Alight Consultants.
            </div>
            <div className="chat resiver-chat">
              Good.
            </div>

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

      </div>

    </div>
  )
}
