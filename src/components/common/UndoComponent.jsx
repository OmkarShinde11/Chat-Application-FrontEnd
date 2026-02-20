import React from 'react'

export default function UndoComponent({onAction}) {
  return (
    <div>
        <p>Message deleted for me</p>
        <button onClick={onAction}>undo</button>
    </div>
  )
}
