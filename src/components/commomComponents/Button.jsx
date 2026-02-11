import React from 'react'

export default function Button({onClick,children}) {
  return (
    <button onClick={onClick} className='w-auto border border-blue-500 text-white rounded px-3 py-2 bg-blue-500'>{children}</button>
  )
}
