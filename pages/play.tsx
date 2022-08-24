import Head from 'next/head'
import * as PIXI from 'pixi.js'
import { EventSystem } from '@pixi/events';
import { useEffect, useState } from 'react'
import { SpriteMaskFilter } from 'pixi.js';
import { Database } from 'utils/types';

delete PIXI.Renderer.__plugins.interaction

interface Key {
  value: any;
  isDown: boolean;
  isUp: boolean;
  press: any;
  release: any;
  downHandler?(event: any): void;
  upHandler?(event: any): void;
  unsubscribe?(): void;
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
  key.downHandler = (event) => {
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
  key.upHandler = (event) => {
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

const textStyles = {
  fontFamily: 'Courier',
  fontSize: 16,
  fontWeight: 'bold'
}

export default function Home() {
  const [lilMan, setLilMan] = useState<PIXI.Sprite | undefined>(undefined)
  const [pixiApp, setPixiApp] = useState<PIXI.Application|undefined>(undefined)
  const [currentUser, setCurrentUser] = useState<string>('Frances')
  const [databases, setDatabases] = useState<Database[]>([{ name: 'Production', branch_count: 3 }, { name: 'Developement', branch_count: 1 }])
  console.log(lilMan, pixiApp, currentUser)

  useEffect(() => {
    if (document.body.querySelector('canvas') == null && window) {
      const leftTexture = PIXI.Texture.from('lilman_left@2x.png');
      const rightTexture  = PIXI.Texture.from('lilman_right@2x.png');
      const centerTexture = PIXI.Texture.from('lilman_center@2x.png');
      
      PIXI.EventSystem = EventSystem;

      // Create app
      const app = new PIXI.Application({
        width: 500, height: 400, backgroundColor: 0xF2C549, resolution: window.devicePixelRatio || 1,
      });
      document.body.appendChild(app.view);

      // Install EventSystem, if not already
      // (PixiJS 6 doesn't add it by default)
      if (!('events' in app.renderer)) {
          app.renderer.addSystem(PIXI.EventSystem, 'events');
      }

      PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
      
      let lilman: PIXI.Sprite
      let state: (delta: number) => any
      
      const setup = () => {
        lilman = PIXI.Sprite.from(centerTexture);
        lilman.anchor.set(0.5);
        lilman.scale.x *= 0.5;
        lilman.scale.y *= 0.5;
        lilman.x = app.screen.width / 2;
        lilman.y = app.screen.height / 2;
        lilman.vx = 0;
        lilman.vy = 0;
        setLilMan(lilman)
        app.stage.addChild(lilman)

        // Opt-in to interactivity
        lilman.interactive = true;

        // Shows hand cursor
        lilman.buttonMode = true;
        lilman.on('pointerdown', () => { 
          const phrase = new PIXI.Text(`Hi ${currentUser}...`, textStyles)
          phrase.y = -50
          phrase.x = 50
          lilman?.addChild(phrase)

          setTimeout(() => { lilman.removeChild(phrase)}, 1000)
        });

        //Capture the keyboard arrow keys
        const left = keyboard("ArrowLeft"),
            up = keyboard("ArrowUp"),
            right = keyboard("ArrowRight"),
            down = keyboard("ArrowDown");
      
        //Left arrow key `press` method
        left.press = () => {
          lilman.texture = leftTexture
          //Change the lilman's velocity when the key is pressed
          lilman.vx = -5;
          lilman.vy = 0;
        };
        
        //Left arrow key `release` method
        left.release = () => {
          //If the left arrow has been released, and the right arrow isn't down,
          //and the lilman isn't moving vertically:
          //Stop the lilman
          if (!right.isDown && lilman.vy === 0) {
            lilman.vx = 0;
            lilman.texture = centerTexture
          }
        };
      
        //Up
        up.press = () => {
          lilman.texture = centerTexture
          lilman.vy = -5;
          lilman.vx = 0;
        };
        up.release = () => {
          if (!down.isDown && lilman.vx === 0) {
            lilman.vy = 0;
          }
        };
      
        //Right
        right.press = () => {
          lilman.texture = rightTexture
          lilman.vx = 5;
          lilman.vy = 0;
        };
        right.release = () => {
          if (!left.isDown && lilman.vy === 0) {
            lilman.vx = 0;
            lilman.texture = centerTexture
          }
        };
      
        //Down
        down.press = () => {
          lilman.texture = centerTexture
          lilman.vy = 5;
          lilman.vx = 0;
        };
        down.release = () => {
          if (!up.isDown && lilman.vx === 0) {
            lilman.vy = 0;
          }
        };
      
        //Set the game state
        state = play
       
        //Start the game loop 
        app.ticker.add((delta) => gameLoop(delta));

        setPixiApp(app)
        setLilMan(lilman)
      }
      
      const gameLoop = (delta: number) => {
      
        //Update the current game state:
        state(delta);
      }
      
      const play = (delta: number) => {
      
        //Use the lilman's velocity to make it move
        lilman.x += lilman.vx;
        lilman.y += lilman.vy;
      }

      setup()
    }
  }, [])

  return (
    <div >
      <Head>
        <title>PlanetPet</title>
        <meta name="description" content="Gamify PlanetScale" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
