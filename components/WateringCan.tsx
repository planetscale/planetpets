import { PixiComponent, useApp } from '@inlet/react-pixi'
import { Sprite as PixiSprite } from 'pixi.js'
import React, { forwardRef } from 'react'

const WateringCan = forwardRef<PixiSprite, any>((props, ref) => {
  const app = useApp();
  return <PixiComponentWateringCan app={app} {...props} ref={ref} />;
})

const PixiComponentWateringCan = PixiComponent("WateringCan", {
  create: () => {
    const wateringCan = PixiSprite.from('watering_can@2x.png')
    wateringCan.x = -50
    wateringCan.y = 5
    wateringCan.anchor.set(1, 0.5)
    wateringCan.rotation = -0.5
    wateringCan.scale.set(0.5, 0.5)
    return wateringCan
  }
});

export default WateringCan