import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { Sprite, useApp, Text, useTick, PixiRef, _ReactPixi} from '@inlet/react-pixi'
import { keyboard, textStyles } from 'lib/utils'
import WateringCan from './WateringCan'
import { Sprite as PixiSprite, TextStyle } from 'pixi.js'

interface Props {
  currentUser: string
  wateringCan: React.MutableRefObject<PixiRef<typeof Sprite> | null>
  watering: boolean
  innerRef: any
  setPhrase: (phrase: string | undefined) => void
  phrase?: string
}

export const RefLilMan = forwardRef<PixiSprite, any>((props, ref) => {
  return <LilMan innerRef={ref} {...props} />
})

const LilMan: React.FC<Props> = ({ currentUser, wateringCan, watering, innerRef, setPhrase, phrase }) => {
  const app = useApp()
  const [x, setX] = useState(app.screen.width / 2)
  const [y, setY] = useState(300)
  const [image, setImage] = useState('lilman_center@2x.png')

  const vx = useRef(0)
  const vy = useRef(0)
 
  useEffect(() => {
    //Capture the keyboard arrow keys
    const left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

    //Left arrow key `press` method
    left.press = () => {
      setImage('lilman_left@2x.png')
      //Change the lilman's velocity when the key is pressed
      vx.current = -5
      vy.current = 0
    };

    //Left arrow key `release` method
    left.release = () => {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the lilman isn't moving vertically:
      //Stop the lilman
      if (!right.isDown && vy.current === 0) {
        vx.current = 0
        setImage('lilman_center@2x.png')
      }
    };

    //Up
    up.press = () => {
      setImage('lilman_center@2x.png')
      vy.current = -5
      vx.current = 0
    };
    up.release = () => {
      if (!down.isDown && vx.current === 0) {
        vy.current = 0
      }
    };

    //Right
    right.press = () => {
      setImage('lilman_right@2x.png')
      vx.current = 5
      vy.current = 0
    };
    right.release = () => {
      if (!left.isDown && vy.current === 0) {
        vx.current = 0
        setImage('lilman_center@2x.png')
      }
    };

    //Down
    down.press = () => {
      setImage('lilman_center@2x.png')
      vy.current = 5
      vx.current = 0
    };
    down.release = () => {
      if (!up.isDown && vx.current === 0) {
        vy.current = 0
      }
    };
  }, [])

  useTick((delta) => {
    //Use the lilman's velocity to make it move
    setX(x + vx.current)
    setY(y + vy.current)
  })

  return <Sprite 
    image={image}
    anchor={0.5}
    scale={.8}
    x={x}
    y={y}
    interactive={true}
    buttonMode={true}
    click={() => {
      setPhrase(`Hi ${currentUser || 'Frances'}...`)
      setTimeout(() => { setPhrase(undefined) }, 1000)
    }}
    zIndex={100}
    ref={innerRef}
  >
    {phrase && <Text x={50} y={-50} text={phrase} style={textStyles as TextStyle}/>}
    {watering &&  <WateringCan ref={wateringCan}/>}
  </Sprite>
}
