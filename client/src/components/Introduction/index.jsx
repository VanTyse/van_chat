import './index.css'

import { useState, useEffect } from 'react'
import { Mask } from '../Mask'

export const Introduction = () => {
    const [showIntro, setShowIntro] = useState(false)
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowIntro(true)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        console.log(showIntro)
    }, [showIntro])
    return (
        <>
        <div className={`introduction ${showIntro && 'show'}`}>
            <h2>
                Hello, my name is Nonso.
            </h2>
            <h3>This chat application is a mini project displaying my skills in the MERN stack. 
            The frontend was built with React, the backend with express and I used MongoDB for the database</h3>
            
            <h3>
                This project is quite simple. After registering, as a user, you can view the list of all people registered in the app.
                You can select a user to either become a friend, or to chat.
            </h3>

            <h3>Socket.io was used to enable duplex communication between several clients and the server in real time.
                The focus of this project is the duplex communication, so I didnt include the functionality to send friend requests. 
            Meaning when you "add a friend" no request is sent to that friend; he/she jsut automatically becomes your friend.
            </h3>

            <h3>
                Feel free to experience Instant Messaging on this app. To do that create two accounts and sign in to them on different browsers.
                If you have only one browser, then sign into one of the accounts on an incognito tab. Check the list for the recently added user, click and message.
                You should see the message sent to the other user.
            </h3>

            <h3>
                Just in case, you can log in to the accounts of users like Osama Bin Laden, Benjamin Franklin, Theodore Roosevelt and Odumegwu Ojukwu by joining all their names to get their emails. For example "odumegwuojukwu@gmail.com" or "osamabinladen@gmail.com". The password is "secret".
            </h3>

            <button className='close-btn' onClick={() => setShowIntro(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
        </div>
        <Mask showMask={showIntro} setShowMask={setShowIntro}/>
        </>
    )
}