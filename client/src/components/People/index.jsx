import './index.css'
import { IndividualPerson } from '../Friends'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../../context'
import { UnathourizedRoute } from '../../components'
import axios from 'axios'

export const People = () => {
    const navigate = useNavigate()
    const pathname = useLocation().pathname
    const {user} = useContext(AppContext)

    if (!user) {
        return (
           <UnathourizedRoute/> 
        )

    }

    return(
        <div className="people-container">
            <PeopleList/>
            <IndividualPerson/>
        </div>
    )
}

const PeopleList = () => {
    const [people, setPeople] = useState([]);
    const {user, token} = useContext(AppContext)
    const getPeople = async () => {
        try {
            const {data: {users}} = await axios('/api/v1/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })            
            setPeople(users)
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        token && getPeople()
    }, [])

    return (
        <div className="person">
            <h3><em>People</em></h3>
            <div className="people-list-items">{
                people.length > 0 && people.map(person => {
                    const {_id, about, name, profilePic} = person;
                    return <PeopleListItem id={_id} key={_id} name={name} about={about} profilePic={profilePic}/>
                })
            }
            </div>
        </div>
    )
}

const PeopleListItem = ({id, profilePic, name, about}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/people/${id}`)
    }


    return (
        <div className="people-list-item" onClick={handleClick}>
            <div className="profile-pic">
                <img src={`${profilePic}`} />
            </div>
            <div className="right">
                <h4 className="name">{name}</h4>
                <p className="about">{about}</p>
            </div>
        </div>
    )
}