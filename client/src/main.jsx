import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Chat, Friends, People, Login} from './components'
import {AppContext, AppContextProvider} from './context'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
    <Router>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Login/>}/>
          <Route path='chat' element={<Chat/>}/>
          <Route path='chat/:id' element={<Chat/>}/>
          <Route path='friends' element={<Friends/>}/>
          <Route path='friends/:id' element={<Friends/>}/>
          <Route path='people' element={<People/>}/>
          <Route path='people/:id' element={<People/>}/>
        </Route>
      </Routes>
    </Router>
    </AppContextProvider>
  </React.StrictMode>
)
