import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './index.css'
import { AppContext } from '../../context'
import { useEffect } from 'react'

export const Sidebar = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const {user} = useContext(AppContext)

    useEffect(() => {
        const listener = () => {
            setShowSidebar(false);
        }
        window.addEventListener('click', listener)

        return () => window.removeEventListener('click', listener)
    }, [])

    return (
        <div className={`sidebar ${showSidebar && 'show-sidebar'}`}>
            <h1 className="app-name">VanChat</h1>
            <nav>
                <ul className="nav-items">
                    <NavItem value={'chat'}/>
                    <NavItem value={'people'}/>
                    <NavItem value={'friends'}/>
                    <NavItem value={user ? 'logout' : 'login'}/>
                </ul>
            </nav>
            <div className="arrow" onClick={(e) => {
                e.stopPropagation()
                setShowSidebar(state => !state)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                </svg>
            </div>
        </div>
    )
}

const NavItem = ({value}) => {
    const pathname = useLocation().pathname
    if (value === 'login' && pathname === '/register') return (
        <>
        <Link to={`./${value}`}>
            <li className={`nav-item active`}>{value}
                <div className='underline'></div>
            </li>
        </Link>
        </>
    )

    if (value === 'logout') return (
        <>
        <Link to={`./login`}>
            <li className={`nav-item`}>{value}
                <div className='underline'></div>
            </li>
        </Link>
        </>
    )

    return (
        <>
        <Link to={`./${value}`}>
            <li className={`nav-item ${pathname.match(value) && 'active'}`}>{value}
                <div className='underline'></div>
            </li>
        </Link>
        </>
    )


}