import React, { useState, useEffect }from 'react'
import { Stage, Container, useApp } from '@inlet/react-pixi'
import LilMan from 'components/LilMan'

const TestPlay: React.FC = () => {
  return (
    <Stage width={500} height={500} options={{ backgroundColor: 0xF2C549 }}>
      <Container x={100} y={100}>
        <LilMan currentUser='Frances' />
      </Container>
    </Stage>
  )
}

export default TestPlay