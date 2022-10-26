import './index.css'
import { useLocation, Link } from 'react-router-dom'
import { AppContext } from '../../context'
import { useContext, useEffect } from 'react'

export const MobileNav = () => {
    const {user} = useContext(AppContext);

    return (
        <nav className='mobile-nav'>
            <ul className="nav-items">
                <NavItem value={'chat'}/>
                <NavItem value={'people'}/>
                <NavItem value={'friends'}/>
                <NavItem value={user ? 'logout' : 'login'}/>
            </ul>
        </nav>
    )
}


const NavItem = ({value}) => {
    const pathname = useLocation().pathname

    if (value === 'logout') {
        return(
            <Link to={'/login'}>
                <li className={`nav-item ${ (pathname.match('login') || pathname.match('register')) && 'active'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                        <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                    </svg>
                    <div className='underline'></div>
                </li>
            </Link>
        )
    }

    if (value === 'login') {
        return (
            <Link to='/login'>
                <li className={`nav-item ${ (pathname.match('login') || pathname.match('register')) && 'active'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                        <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>         
                    <div className='underline'></div>
                </li>
            </Link>
        )
    }

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