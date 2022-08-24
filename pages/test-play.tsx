import React from 'react'
import { Stage, Container } from '@inlet/react-pixi'
import LilMan from 'components/LilMan'
const TestPlay: React.FC = () => {
  return (
    <Stage width={500} height={400} options={{backgroundColor: 0xF2C549, resolution: 1, backgroundAlpha: 0 }}>
      <Container x={100} y={100}>
        <LilMan currentUser='Frances' />
      </Container>
    </Stage>
  )
}

export default TestPlay