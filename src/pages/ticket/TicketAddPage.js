import React, { useEffect, useState } from 'react'
import TicketAddComponent from '../../components/ticket/TicketAddComponent'
import { fetchCurrentGameId, fetchReservedSeats } from '../../components/api/ticketApi';
import { useParams } from 'react-router-dom';
const TicketAddPage = () => {

  return (
    <TicketAddComponent />
  )
}

export default TicketAddPage