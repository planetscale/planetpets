import React, { useState, useRef, createRef, useEffect, RefObject } from 'react'
import { Stage, Container, PixiRef, Sprite} from '@inlet/react-pixi'
import { Sprite as PixiSprite } from 'pixi.js'
import LilMan from 'components/LilMan'
import Tree from 'components/Tree'
import { Database } from 'utils/types'
import { keyboard } from 'lib/utils'

const Play: React.FC = () => {
  const [databases, setDatabases] = useState<Database[]>([{name: "Main", branch_count: 1 }, { name: "Production", branch_count: 2 }, { name: 'Developement', branch_count: 10 }])
  const wateringCan = useRef<PixiRef<typeof Sprite>>()
  const [treeRefs, setTreeRefs] = useState<RefObject<PixiSprite>[]>([])
  const [watering, setWatering] = useState(false)

  useEffect(() => {
    if (watering) {
      treeRefs.forEach((t, i) => {
        if (intersect(t.current as PixiSprite, wateringCan.current as PixiSprite)) {
          databases[i].branch_count += 1
          setDatabases([...databases])
        }
      })
    }
  }, [watering])

  useEffect(() => {
    setTreeRefs(databases.map(d => createRef<PixiRef<typeof Sprite>>()))
  }, [databases])

  useEffect(() => {
    const water = keyboard("a");
    water.press = () => {
      setWatering(true)
    }
    water.release = () => {
      setWatering(false)
    }
  }, [])

  function intersect(a: PixiSprite, b: PixiSprite) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  } 
  return (
    <Stage width={500} height={500} options={{ backgroundColor: 0xF2C549 }}>
      <Container x={100} y={100}>
        {databases.map((d, i) => <Tree ref={treeRefs[i]} key={`tree_${d.name}`} x={i*100} y={300} database={d}/>)}
        <LilMan currentUser='Frances' wateringCan={wateringCan} watering={watering} />
      </Container>
    </Stage>
  )
}

export default Play