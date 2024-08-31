import React, { useContext } from 'react'
import { Box } from '@mui/material'
import { CLIApp } from '../game'
import { AuthContext } from '../../AuthProvider'

const GameContainer = () => {
  const {auth, checkAdmin} = useContext(AuthContext)
const moves = new URLSearchParams(window.location.search).get('moves').split(',');



  return (

    auth && !checkAdmin &&
    <Box>
      <CLIApp args={moves} />
    </Box>
  )
}
export default GameContainer
