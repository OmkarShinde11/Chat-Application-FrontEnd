import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { login, signIn } from '../Store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('signIn');

  const dispatch=useDispatch();
  const navigate=useNavigate();

  function toggle() {
    setMode(mode === 'signIn' ? 'LogIn' : 'signIn');
  }

  function submit(e){
    e.preventDefault();
    if(mode=='signIn'){
        let data={
            email,
            password,
            name
        };
        dispatch(signIn(data)).unwrap().then((res)=>{
            console.log(res);
            navigate('/chat');
        });
    }else{
        let data={
            email,
            password
        };
        dispatch(login(data)).unwrap().then((res)=>{
            console.log(res);
            navigate('/chat');
        });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg space-y-4">
        
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          {mode === 'signIn' ? 'Sign In' : 'Log In'}
        </h2>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
          type="text"
            id="email"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Name */}
        {mode==='signIn' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        )}

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          {mode === 'signIn' ? 'Sign In' : 'Log In'}
        </button>

        {/* Toggle */}
        <button
          type="button"
          onClick={toggle}
          className="w-full text-sm text-blue-600 hover:underline text-center"
        >
          {mode === 'signIn'
            ? 'Already have an account? Log In'
            : "Don't have an account? Sign In"}
        </button>

      </form>
    </div>
  )
}
