import './index.css'
import { Link } from 'react-router-dom'

export const UnathourizedRoute = () => {
    return (
        <div className='unathourized-route-container'>
            <h3>You can't access this route until you <Link to='/login'>Login</Link>!!</h3>
        </div>   
    )
}