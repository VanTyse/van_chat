import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../../context'
import { UnathourizedRoute } from '../../components'
import axios from 'axios'

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
    
    const getChats = async () => {
        try {
            const { data: {chats} } = await axios('/api/v1/chat', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })

            setChats(chats)
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        getChats()
    }, [])


    return (
        <div className="chat-list">
            <h3><em>Chats</em></h3>
            <div className="chat-list-items">{
                chats.length > 0 ? chats.map(chat => {
                    const {_id} = chat;
                    return <ChatListItem id={_id} members={}/>
                }):
                <h4 className='no-friends'>No friends...</h4>
            }
            </div>
        </div>
    )
}

const ChatListItem = ({id, members}) => {
    const [trimmedMessage, setTrimmedMessage] = useState('Tap or click to message')
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState(null)
    
    const getPerson = async () => {
        if (members.length > 2) return console.log('more than 2 members');
        const personId = members.filter(item => {
            if (item !== user.id) return item
        })

        const {name, profilePic} = await axios(`/api/v1/user/${personId}`)
        setName(name)
        setProfilePic(profilePic)
    }

    const getLastMessage = async () => {
        try {
            const {data: {lastMessage}} = await axios(`/api/v1/message?lastMessage=true`)
            const trimmedMessage = `${lastMessage.slice(0, 50)}...`
            setTrimmedMessage(trimmedMessage)
        } catch (error) {
            console.log(error.response)
        }
    }

    
    const navigate = useNavigate()
    const selectChat = () => {
        navigate(`/chat/${id}`)
    }

    useEffect(() => {
        getPerson()
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
    const [baseRoute, param] = pathname.slice(1).split('/')
    const navigate = useNavigate()

    const goBack = () => {
        navigate('/chat')
    }
    
    if (baseRoute !== 'chat') return null
    if (!param) {
        return (
            <div className='individual-chat-no-param'>
                <h3 style={{marginBottom : '40vh'}}> <em>Chat</em> </h3>
                <h4 style={{textAlign: 'center'}}>No Chat selected</h4>
            </div>
        )
    }
    return(
        <div className="individual-chat">
            <div className="top">
                <div className="back-arrow" onClick={goBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </div>
                <h3 className="name"><em>Nonso Okafor</em></h3>
                <div className="profile-pic"></div>
            </div>
            <div className="messages">
                <Message type='sent'/>
                <Message type='received'/>
                <Message type='sent'/>
                <Message type='received'/>
                <Message type='sent'/>
                <Message type='received'/>
                <Message type='sent'/>
                <Message type='received'/>
                <Message type='sent'/>
                <Message type='received'/>
            </div>
            <form>
                <input type="text" name="message" placeholder='enter mesasge'/>
                <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                </svg>
                </button>
            </form>
        </div>
    )
}

const Message = ({type}) => {
    return (
        <div className={`message ${type === 'sent' ? 'sent-message' : 'received-message'}`}>
            Message
            <span className="time">10:24</span>
        </div>
    )
}