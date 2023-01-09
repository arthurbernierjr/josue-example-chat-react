import { useState, useEffect, useRef } from 'react'
export default function App () {
    const socket = window.io()
    const [chatRoomId, setChatRoomId] = useState('')
    const [username, setUsername] = useState('')
    const usernameInput = useRef(null)
    const chatIDInput = useRef(null)
    const messageInput = useRef(null)
    const chatRoom = useRef(null)
    const dingSound = useRef(null)
    const [messages, setMessages] = useState([])
    const [delay, setDelay] = useState(true)  

    useEffect(()=>{
        socket.on('join',(room)=>{
            setChatRoomId(room)
        })
        socket.on('recieve', (message)=>{
            console.log(message)
            setMessages((previousMessages) => [...previousMessages, message])
            dingSound.current.currentTime = 0;
            dingSound.current.play()
        })
    },[])

    const connect = (e) => {
        e.preventDefault()
        socket.emit('join', 
        chatIDInput.current.value, 
        usernameInput.current.value)
        setChatRoomId(chatRoom.current.value)
        setUsername(usernameInput.current.value)
    }
    const send = (e) => {
        e.preventDefault()
        if (delay && messageInput.current.value.replace(/\s/g, "") != ""){
            setDelay(false);
            setTimeout(delayReset, 1000);
            socket.emit("send", messageInput.current.value, chatRoomId, username);
            messageInput.current.value = "";
          }
    }
    const delayReset = () => {
        setDelay(true);
    }

  return (
    <>
      <div id='Main'>
        <audio ref={dingSound} id='Ding' src='Ding.mp3'> </audio>
        <h1 id='Title'> Chat </h1>
        <div id='AccessPort'>
          <label id='NameLabel'> Username  </label>
          <input ref={usernameInput} id='NameInput' type='text' />
          <br /><br />
          <label id='IDLabel'> Chatroom </label>
          <input ref={chatIDInput} id='IDInput' value='Room1' type='text' />
          <input id='ConnectButton' class='Button' type='submit' value='Connect' onClick={connect} />
        </div>
        <h2 ref={chatRoom} id='RoomID'> Chatroom : {chatRoomId ? chatRoomId: 'None'} </h2>
        <div id='Chat'>
            {messages.map((message, idx)=>(
              <p
               key={message + `Message${idx}`}
               id={`Message${idx}`}
               className='Message'
               style={{ color: '#303030'}}
              > 
               {message} 
              </p>
            ))}
          <label id='MessageLabel'> Message </label>
          <input ref={messageInput} id='ComposedMessage' type='text' />
          <input id='SendMessage' onClick={send} value='Send' class='Button' type='submit' />
        </div>
        <br /><br />
      </div>
    </>
  )
}
