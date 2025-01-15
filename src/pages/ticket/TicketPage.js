import React from 'react'
import { Outlet } from 'react-router-dom'

const TicketPage = () => {
  return (
    <div>
            <h2>티켓</h2>
            {/* Common layout elements can go here */}
            <Outlet /> {/* Renders the child routes */}
        </div>
  )
}

export default TicketPage