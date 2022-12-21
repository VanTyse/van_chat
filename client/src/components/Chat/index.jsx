import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../../context'
import { UnathourizedRoute, Loader } from '../../components'
import axios from 'axios'
import {io} from 'socket.io-client'

export const Chat = () => {
    const navigate = useNavigate()
    const pathname = useLocation().pathname
    const {user} = useContext(AppContext)

    if (!user) {
        return (
           <UnathourizedRoute/>     
        )

    }

    return (
        <div className="chat-container">
            <div className="left"><ChatList/></div>
            <div className="right"><IndividualChat/></div>
        </div>
    )
}

const ChatList = () => {
    const [chats, setChats] = useState([])
    const {token} = useContext(AppContext)
    const [chatListLoading, setChatListLoading] = useState(true)
    
    const getChats = async () => {
        try {
            const { data: {chats} } = await axios('/api/v1/chat', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setChatListLoading(false)
            setChats([...chats])
        } catch (error) {
            console.log(error.response)
            setChatListLoading(false)
        }
    }
    
    useEffect(() => {
        getChats()
    }, [])

    return (
        <div className="chat-list">
            <h3><em>Chats</em></h3>
            <div className="chat-list-items">{
                chatListLoading ? <Loader/> :
                chats.length > 0 ? chats.map(chat => {
                    const {_id} = chat;
                    return <ChatListItem id={_id} key={_id}/>
                }):
                <div className='no-friends'><h4>No chats...</h4></div>
            }
            </div>
        </div>
    )
}

const ChatListItem = ({id}) => {
    const [trimmedMessage, setTrimmedMessage] = useState('Tap or click to message')
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [members, setMembers] = useState([])
    const [createdAt, setCreatedAt] = useState('')
    const [lastMessage, setLastMessage] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const {user, token} = useContext(AppContext)

    useEffect(() => {
        if (createdAt){
            const {month, day} = parseDate(createdAt)
            setDate(`${day}/${month}`)
        }
        trimMessage();
    }, [createdAt, lastMessage])

    useEffect(() => {
        const listener = () => {
            getChat()
        }
        window.addEventListener('message-sent', listener)
        return () => window.removeEventListener('message-sent', listener)
    }, [])

    const getChat = async () => {
        try {
            const { data: {chat} } = await axios(`/api/v1/chat/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            const {members, lastMessage: {text, date}} = chat;
            setCreatedAt(date)
            setLastMessage(text)
            setMembers(members)
        } catch (error) {
            console.log(error.response)

        }
    }
    
    const getPerson = async () => {
        if (members.length > 2) return console.log('more than 2 members');
        const [personId] = members.filter(item => {
            if (item !== user._id) return item
        })

        try{
            const {data: {user: {name, profilePic}}} = await axios.get(`/api/v1/user/${personId}`)
            setName(name)
            setProfilePic(profilePic)
        } catch (error) {
            console.log(error.response)
        }
    }

    const trimMessage = () => {
        if (!lastMessage) return
        if (lastMessage.length < 50) {
            setTrimmedMessage(lastMessage)
            return 
        }
        const trimmedMessage = `${lastMessage.slice(0, 50)}...`
        setTrimmedMessage(trimmedMessage)
    }

    
    const navigate = useNavigate()
    const selectChat = () => {
        navigate(`/chat/${id}`)
    }

    useEffect(() => {
        if (members.length > 1)
        getPerson()
    }, [members])

    useEffect(() => {
        getChat()
    }, []) 

    return (
        <div className="chat-list-item" onClick={selectChat}>
            <div className="left profile-pic">{
                profilePic && <img src={profilePic} alt="" />
            }</div>
            <div className="right">
                <div className="top">
                    <h4 className="name">{name}</h4>
                    <h5>{date}</h5>
                </div>
                <p className="last-message">{
                    trimmedMessage
                }</p>
            </div>
        </div>
    )
}

const IndividualChat = () => {
    const pathname = useLocation().pathname
    const [baseRoute, chatId] = pathname.slice(1).split('/')
    const navigate = useNavigate()
    const {user, token} = useContext(AppContext)
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState(null)
    const [recipientId, setRecipientId] = useState(null)
    const [members, setMembers] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessageText, setNewMesssageText] = useState('')
    const [individualChatLoading, setIndividualChatLoading] = useState(true)

    const [socket, setSocket] = useState()

    useEffect(() => {
        const s = io(`http://localhost:5001`)
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if(!socket || !chatId) return
        socket.emit('get-messages', chatId)
        socket.on('load-messages', (messages) => {
            setMessages(messages)
        })
    }, [socket, chatId])

    useEffect(() => {
        if(socket == null || !chatId) return
        const listener = (message) => {
            const {newMessage} = message
            setMessages(messages => [...messages, newMessage])
            const event = new CustomEvent('message-sent');
            window.dispatchEvent(event)
        }

        socket.on('receive-message', listener)

        return () => socket.off('receive-message', listener)
    }, [socket, chatId])

    const goBack = () => {
        navigate('/chat')
    }

    const getChat = async () => {
        try {
            const {data: {chat: {members}}} = await axios(`/api/v1/chat/${chatId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            setMembers(members)
        } catch (error) {
            console.log(error.response);
            setIndividualChatLoading(false)
        }
    }

    const getPerson = async () => {
        if (members.length > 2) return console.log('more than 2 members');
        const [personId] = members.filter(item => {
            if (item !== user._id) return item
        })

        try{
            const {data: {user: {name, profilePic}}} = await axios.get(`/api/v1/user/${personId}`)
            setName(name)
            setProfilePic(profilePic)
            setRecipientId(personId)
            setIndividualChatLoading(false)
        } catch (error) {
            console.log(error.response)
            setIndividualChatLoading(false)
        }
    }

    const sendMessage = (e, message) => {
        e.preventDefault()
        const from = user._id;
        const to = recipientId
        if (!(from && to && message && chatId )) return console.log('something went wrong')
        socket.emit('send-message', chatId, message, from, to)        
        const newMessage = {
            from,
            to,
            text: message,
            createdAt: Date.now()
        }
        setMessages([...messages, newMessage])
        setNewMesssageText('')
    }

    useEffect(() => {
        if (!chatId) return
        getChat()
    }, [chatId])

    useEffect(() => {
        if (members.length < 1) return
        getPerson()
    }, [members])
    
    if (baseRoute !== 'chat') return null
    if (!chatId) {
        return ( 
        <div>
            <h3 style={{fontSize: '1.5rem'}}><em>Chat</em></h3>
            <div className="no-friends"><h4>No chat selected</h4></div>
        </div>
        )
    }
    return(
        <div className="individual-chat">
            {
                individualChatLoading ? <Loader/> : (members.length === 2) ? 
                <div>
                <div className="top">
                    <div className="back-arrow" onClick={goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                    </div>
                    <h3 className="name"><em>{name}</em></h3>
                    <div className="profile-pic">
                        <img src={profilePic} alt="" />
                    </div>
                </div>
                <div className="messages">{
                    messages.length > 0 ? messages.map(message => {
                        const {_id, from, createdAt, text} = message;
                        return <Message key={_id} type={(from !== user._id ? 'received' : 'sent')} createdAt={createdAt} text={text}/>
                    }) :
                    <div className='no-message'>
                        <h4>No messages. <br/> Type at the bottom to send your first messsage</h4>
                    </div>
                }
                </div>
            </div>: 
                <div className='no-friends'><h4>Something went wrong.</h4></div>
            }
            <form onSubmit={e => sendMessage(e, newMessageText)}>
                <input type="text" value={newMessageText} onChange={e => setNewMesssageText(e.target.value)}
                    name="message" placeholder='enter mesasge'/>
                <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
                </button>
            </form>
        </div>
    )
}

const Message = ({type, createdAt, text}) => {
    const {hours, minutes} = parseDate(createdAt)
    const date = `${hours}:${minutes}`
    return (
        <div className={`message ${type === 'sent' ? 'sent-message' : 'received-message'}`}>
            {text}
            <span className="time">{date}</span>
        </div>
    )
}

const parseDate = (date) => {
    const parsedDate = new Date(date);
    const month = parsedDate.getMonth() + 1
    const day = parsedDate.getDate()
    const hours = parsedDate.getHours()
    let minutes = parsedDate.getMinutes()
    minutes = (minutes > 9) ? minutes : `0${minutes}`
    return {month, day, hours, minutes}
}