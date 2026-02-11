import './App.css'
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import Chat from './components/Chat'
import Auth from './components/Auth'
import ChatAppLayout from './components/ChatAppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import DialogRoot from './components/Dialogs/DialogRoot'


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='auth' element={<Auth/>}>Auth</Route>
        <Route path='chat' element={
          <ProtectedRoute>
            <ChatAppLayout/>
          </ProtectedRoute>
        }>Chat</Route>
      </Routes>
      <DialogRoot/>
      </BrowserRouter>
    </>
  )
}

export default App
