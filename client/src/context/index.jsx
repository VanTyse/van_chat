import {createContext, useReducer} from 'react'

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    notification : {
        type: null,
        show: false,
        content: ''
    }
}

export const AppContext = createContext(INITIAL_STATE)

const reducer = (state, action) => {
    if (action.type === 'SET_TOKEN') {
        return {
            ...state,
            token: action.payload
        }
    }

    if (action.type === 'SET_USER') {

        return {
            ...state,
            user: action.payload
        }
    }

    if (action.type === 'REMOVE_TOKEN') {
        return {
            ...state,
            token: null
        }
    }

    if (action.type === 'REMOVE_USER') {
        return {
            ...state,
            user: null
        }
    }

    if (action.type === 'SET_NOTIFICATION') {
        return {
            ...state,
            notification: action.payload
        }
    }

    return state
}

export const AppContextProvider = ({children}) => {
    const [state, dispatch] = useReducer( reducer, INITIAL_STATE )
    return <AppContext.Provider value={{...state, dispatch}}>
        {children}
    </AppContext.Provider>
}