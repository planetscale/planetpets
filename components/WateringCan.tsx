import { Sprite } from '@inlet/react-pixi'
import React from 'react'

const WateringCan: React.FC = () => {
  return (
    <Sprite image='watering_can@2x.png' x={-50} y={5} anchor={[1, 0.5]} scale={1} rotation={-0.5} />
  )
}

export default WateringCan