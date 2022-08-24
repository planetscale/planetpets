import React, { useEffect, useState } from 'react'
import { Sprite, useApp, Text, useTick} from '@inlet/react-pixi'
import { Key } from '../utils/types'

const textStyles = {
  fontFamily: 'Courier',
  fontSize: 16,
  fontWeight: 'bold'
}

function keyboard(value: string) {
  const key: Key = {
    value: value,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined
  };
  
  //The `downHandler`
  key.downHandler = (event: KeyboardEvent) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = (event: KeyboardEvent) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener("keydown", downListener, false);
  window.addEventListener("keyup", upListener, false);
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key
}

interface Props {
  currentUser: string
}

const LilMan: React.FC<Props> = ({ currentUser }) => {
  const [vx, setVx] = useState(0)
  const [vy, setVy] = useState(0)

  const app = useApp()

  const [x, setX] = useState(app.screen.width / 2)
  const [y, setY] = useState(app.screen.height / 2)
  const [image, setImage] = useState('lilman_center@2x.png')
  const [phrase, setPhrase] = useState<string>()
  console.log("LOCKED INTO ", x, y)
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
      setVx(-5)
      setVy(0)
    };

    //Left arrow key `release` method
    left.release = () => {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the lilman isn't moving vertically:
      //Stop the lilman
      if (!right.isDown && vy === 0) {
        setVx(0)
        setImage('lilman_center@2x.png')
      }
    };

    //Up
    up.press = () => {
      setImage('lilman_center@2x.png')
      setVy(-5)
      setVx(0)
    };
    up.release = () => {
      if (!down.isDown && vx === 0) {
        setVy(0)
      }
    };

    //Right
    right.press = () => {
      setImage('lilman_right@2x.png')
      setVx(5)
      setVy(0)
    };
    right.release = () => {
      if (!left.isDown && vy === 0) {
        setVx(0)
        setImage('lilman_center@2x.png')
      }
    };

    //Down
    down.press = () => {
      setImage('lilman_center@2x.png')
      setVy(5)
      setVx(0)
    };
    down.release = () => {
      if (!up.isDown && vx === 0) {
        setVy(0)
      }
    };
  }, [vx, vy])

  useTick((delta) => (delta: number) => {
      
    //Use the lilman's velocity to make it move
    setX(x + vx)
    setY(y + vy)
  })

  console.log("APP", app)
  return <Sprite 
    image={image}
    anchor={0.5}
    scale={.5}
    x={x}
    y={y}
    interactive={true}
    buttonMode={true}
    click={() => {
      setPhrase(`Hi ${currentUser || 'Frances'}...`)
      setTimeout(() => { setPhrase(undefined) }, 1000)
    }}
  >
    {phrase && <Text x={50} y={-50} text={phrase} {...textStyles}/>}
  </Sprite>
}

export default LilMan