import { Sprite, Text, useApp , PixiComponent } from '@inlet/react-pixi'
import React, { forwardRef } from 'react'
import { Sprite as PixiSprite, Container as PixiContainer, Text as PixiText } from 'pixi.js'
import { textStyles } from '../lib/utils'

interface Props {
  x: number
  y: number
  name: string
  innerRef: React.ForwardedRef<PixiSprite>
}

const baseHeight = 74
const branchHeight = 33

const PixiGate: React.FC<Props> = ({ name, x, y, innerRef }) => {
  return (
    <Sprite image='garden_door@2x.png' x={x} y={y} anchor={0.5} scale={0.75} zIndex={0} ref={innerRef}>
      <Text text={name} x={0} y={70} anchor={0.5} style={textStyles} />
    </Sprite>
  )
}

const Gate = forwardRef<PixiSprite, any>((props, ref) => {
  const app = useApp();
  return <PixiGate x={props.x} y={props.y} innerRef={ref} name={props.name} />
})

export default Gate