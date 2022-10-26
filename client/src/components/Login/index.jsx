import './index.css'
import { useState, useEffect, useContext } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../../context';

export const Login = () => {
    const pathname = useLocation().pathname;
    const {dispatch} = useContext(AppContext)

    useEffect(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch({type: 'REMOVE_USER'})
        dispatch({type: 'REMOVE_TOKEN'})
    }, [])

    if (pathname.match('register')) return <RegisterContainer/>
    if (pathname.match('login')) return <LoginContainer/>
}

const LoginContainer = () => {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const {dispatch} = useContext(AppContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const {data: {token, user}} = await axios.post('/api/v1/auth/login', {email, password})
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            dispatch({type: 'SET_USER', payload: user})
            dispatch({type: 'SET_TOKEN', payload: token})
            dispatch({type: 'SET_NOTIFICATION', payload: {type: 'success', show: true, content: 'Login Successful'}})
            setTimeout(() => navigate('/chat'), 3000)
        } catch (error) {
            console.log(error.response);
            if (error.response.data)
            dispatch({type: 'SET_NOTIFICATION', payload: {type: 'warning', show: true, content: `Error: ${error.response.data.msg}`}})
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <input type="email" value={email} name="email" placeholder='Enter Email' 
                    onChange={e => setEmail(e.target.value)}
                    required/>
                <input type="password" value={password} placeholder='Enter Passsword' name="password" 
                    onChange={e => setPassword(e.target.value)}
                    required minLength={6}/>
                <button type="submit" className='submit-btn'>Login</button>
                <h3>Don't have an account? <Link to='/register'>Register</Link> here!</h3>
            </form>
        </div>
    )
}

const RegisterContainer = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [about, setAbout] = useState('')

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post('/api/v1/auth/register', {email, password, about, name})
            navigate('/login')            
        } catch (error) {
            console.log(error.response);
        }

    }

    return(
        <div className="login-container">
            <form onSubmit={handleRegister}>
                <h1>Register</h1>
                <input type="email" name="email" value={email} placeholder='Enter Email' 
                    onChange={e => setEmail(e.target.value)}
                    required/>
                <input type="text" name="name" value={name} placeholder='Enter Name... eg: John Harry' 
                    onChange={e => setName(e.target.value)}
                    required/>
                <input type="password" name="password" value={password} placeholder='Enter Password' 
                    onChange={e => setPassword(e.target.value)}
                    required minLength={6}/>
                <textarea name="about" value={about} placeholder='Tell us about yourself' 
                    onChange={e => setAbout(e.target.value)}
                    maxLength='500' required></textarea>
                <button type="submit" className='submit-btn'>Register</button>
                <h3>Already have an account? <Link to='/login'>Login</Link> here!</h3>
            </form>
        </div>
    )
}