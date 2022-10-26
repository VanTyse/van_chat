import { useEffect, useContext } from 'react'
import './index.css'
import { AppContext } from '../../context'

export const Notification = ({type, show, content}) => {
    const {notification, dispatch} = useContext(AppContext)

    useEffect(() => {
        let s;
        if (show === true) {
            s = setTimeout(() => {
                dispatch({type: 'SET_NOTIFICATION', payload: {type: null, show: false, content: ''}})
            }, 3000)

            return () => clearTimeout(s)
        }
    }, [show])
    return (
        <div className={`notification-container ${type === 'warning' ? 'warning' : 'success'} 
        ${show === true && 'show'}`}>
           <div className="notification">
                <div className="bar"></div>
                {content}
           </div>
        </div>
    )
}