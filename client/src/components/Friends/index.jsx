import './index.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context'
import { UnathourizedRoute, Loader } from '../../components'
import axios from 'axios'

export const Friends = () => {
    const {user, token} = useContext(AppContext)
    const [friends, setFriends] = useState([]);
    const [friendsIsLoading, setFriendsIsLoading] = useState(true);

    const getFriends = async () => {
        try {
            const {data: {friends}} = await axios('/api/v1/friend/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })            
            setFriends(friends)
            setFriendsIsLoading(false)
        } catch (error) {
            console.log(error.response)
        }
    }


    if (!user) {
        return (
            <UnathourizedRoute/>   
        )

    }

    return (
        <div className="friends-container">
            <FriendsList friends={friends} getFriends={getFriends} friendsIsLoading={friendsIsLoading}/>
            <IndividualPerson getFriends={getFriends}/>
        </div>
    )
}


const FriendsList = ({getFriends, friends, friendsIsLoading}) => {
    
    useEffect(() => {
        getFriends()
    }, [])


    return (
        <div className="friends-list">
            <h3><em>Friends</em></h3>
            <div className="friends-list-items">{
                friendsIsLoading ? <Loader/> :
                friends.length > 0 ? friends.map(friend => {
                    const {_id, about, name, profilePic} = friend;
                    return <FriendListItem id={_id} key={_id} name={name} about={about} profilePic={profilePic}/>
                }) : <div className='no-friends'><h4>No friends...</h4></div>
            }
            </div>
        </div>
    )
}

const FriendListItem = ({id, profilePic, name, about}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/friends/${id}`)
    }

    return (
        <div className="friends-list-item" onClick={handleClick}>
            <div className="profile-pic">
                <img src={profilePic} alt="" />
            </div>
            <div className="right">
                <h4 className="name">{name}</h4>
                <p className="about">{about}</p>
            </div>
        </div>
    )
}

export const IndividualPerson = ({getFriends}) => {
    const pathname = useLocation().pathname
    const [baseRoute, param] = pathname.slice(1).split('/')
    const navigate = useNavigate()
    const {token, user, dispatch} = useContext(AppContext)

    const [person, setPerson] = useState(null)
    const [mutualFriends, setMutualFriends] = useState([]);

    const [personIsLoading, setPersonIsLoading] = useState(true);

    const goBack = () => {
        navigate(`/${baseRoute}`)
    }

    const getPerson = async () => {
        try {
            const {data: {user}} = await axios(`/api/v1/user/${param}`)            
            setPerson(user)
            setPersonIsLoading(false)
        } catch (error) {
            console.log(error.response)
        }
    }

    const getMutualFriends = async () => {
        try {    
            const {data: {friends}} = await axios(`/api/v1/friend?friendId=${param}&getMutualFriends=true`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })            
            setMutualFriends(friends)
        } catch (error) {
            console.log(error.response)
        }
    }

    const addFriend = async () => {
        console.log('add');
        try {
            const {data: {friend}} = await axios.post(`/api/v1/friend?friendId=${param}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            user.friends.push(param)
            dispatch({type: 'SET_NOTIFICATION', payload: {type: 'success', show: true, content: 'Friend Added'}})
        } catch (error) {
            console.log(error.response);
        }
    }

    const removeFriend = async (id = param) => {
        try {
            const {data} = await axios.delete(`/api/v1/friend/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            user.friends = user.friends.filter((item) => {
                if (item !== param) return item
            })
            dispatch({type: 'SET_NOTIFICATION', payload: {type: 'success', show: true, content: 'Friend Removed'}})
        } catch (error) {
            console.log(error.response);
        }
    }

    const createChat = async () => {
        try {
            const {data: {chat}} = await axios.post(`/api/v1/chat?personId=${param}`, {type: 'regular'}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(chat)
            dispatch({type: 'SET_NOTIFICATION', payload: {type: 'success', show: true, content: 'Chat Created'}})
            navigate(`/chat/${chat._id}`)
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        if (!param) return
        getPerson() 
        getMutualFriends()
    }, [param])
    

    if (!param) {
        return (
            <div>
                <h3 style={{fontSize: '1.5rem'}}>Person</h3>
                <div className="no-friends"><h4>No person selected</h4></div>
            </div>
        )
    }
    return (
        <div className="person">{
            personIsLoading ? <Loader/> :
            person ? <div>
                <div className="top">
                    <div className="back-arrow" onClick={goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                    </div>
                    <h3>Person</h3>
                </div>
                <div className="details">
                    <div className="profile-pic">
                        <img src={person.profilePic} />
                    </div>
                    <h4 className="name">{person.name}</h4>
                    <div className="options">
                        <div className="chat">
                            <svg onClick={createChat} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text" viewBox="0 0 16 16">
                                <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </div>
                        <div className="add-remove-friend">{
                            (!user.friends.includes(param)) ?  
                                <svg onClick={addFriend} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-plus" viewBox="0 0 16 16">
                                    <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                                </svg> :
                                <svg onClick={removeFriend} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-minus" viewBox="0 0 16 16">
                                    <path d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                </svg>
                        }
                        </div>
                    </div>
                    <h5>About<div className="underline"></div></h5>
                    <p className="about-me">{person.about}</p>
                    <h5>Mutual Friends<div className="underline"></div></h5>
                    <div className='mutual-friends'>{
                        mutualFriends.length > 0 ? 
                        mutualFriends.map(friend => {
                            const {_id, profilePic, name} = friend;
                            return <MutualFriend key={_id} id={_id} removeFriend={removeFriend} profilePic={profilePic} name={name}/>
                        }) :
                        <div className='no-mutual-friends'><h5>No mutual Friends!!</h5></div>
                    }
                    </div>
                </div>
            </div> :
            <div>
                Something went wrong
            </div>
        }
        </div>
    )
}

const MutualFriend = ({id, name, profilePic, removeFriend}) => {
    return (
        <div className="mutual-friend">
            <div className="profile-pic">
                <img src={profilePic} alt="" />
            </div>
            <h5 className="name">{name}</h5>
            <div className="delete-icon">
            <svg onClick={() => removeFriend(id)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-minus" viewBox="0 0 16 16">
                <path d="M5.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            </svg>
            </div>
        </div>
    )
}