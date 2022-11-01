import { useState, useEffect, useContext } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { MobileNav, Sidebar, Notification, Introduction } from './components'
import './App.css'
import { AppContext } from './context'


function App() {
  const navigate = useNavigate();
  const pathname = useLocation().pathname
  const {notification, dispatch} = useContext(AppContext)
  

  useEffect(() => {
    if (pathname === '/')navigate('/chat')
  }, [])

  return (
    <div className="app">
      <div className="desktop">
        <Sidebar/>
        <Introduction/>
        <Notification type={notification.type} content={notification.content} show={notification.show}/>
        <Outlet/>
      </div>
      <div className="mobile">
        <MobileNav/>
        <Introduction/>
        <Notification type={notification.type} content={notification.content} show={notification.show}/>
        <Outlet/>
      </div>
    </div>
  )
}

export default App
