import { Container, Sprite, Text, useApp , PixiComponent } from '@inlet/react-pixi'
import React, { forwardRef } from 'react'
import { Sprite as PixiSprite, Container as PixiContainer, Text as PixiText, TextStyle } from 'pixi.js'
import { Database } from '../utils/types'
import { textStyles } from '../lib/utils'

interface Props {
  x: number
  y: number
  database: Database
  innerRef: React.ForwardedRef<PixiSprite>
}

const baseHeight = 74
const branchHeight = 33

const PixiTree: React.FC<Props> = ({ database, x, y, innerRef }) => {
  return (
    <Container x={x} y={y} anchor={0.5} scale={0.75} zIndex={0} ref={innerRef}>
      <Text text={database.name} x={0} y={70} anchor={0.5} style={textStyles as TextStyle} />
      <Sprite image='baseplant@2x.png' x={0} y={0} anchor={0.5}/>
      {Array.from(Array(database.branches_count - 1).keys()).map((i) => { 
        return <Sprite key={`branch_${database.name}_${i}`} anchor={[i%2 == 0 ? 1 : 0, 0.5]} image={i%2 == 0 ? 'left_branch@2x.png' : 'right_branch@2x.png'} x={i%2 == 0 ? 9 : -9} y={-(baseHeight + (i * branchHeight))}/>
      })}
      <Sprite image='topleaf@2x.png' x={0} y={-(baseHeight + ((database.branches_count - 1) * branchHeight))} anchor={0.5} />
    </Container>
  )
}

const Tree = forwardRef<PixiSprite, any>((props, ref) => {
  const app = useApp();
  return <PixiTree x={props.x} y={props.y} innerRef={ref} database={props.database} />
})

export default Tree