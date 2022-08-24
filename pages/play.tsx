import React, { useState, useRef, createRef, useEffect, RefObject } from 'react'
import { Stage, Container, PixiRef, Sprite, Graphics } from '@inlet/react-pixi'
import { Sprite as PixiSprite } from 'pixi.js'
import LilMan, { RefLilMan } from 'components/LilMan'
import Tree from 'components/Tree'
import { Database } from 'utils/types'
import { keyboard } from 'lib/utils'
import Layout from 'components/Layout'
import Gate from 'components/Gate'

const defaultDatabases = [{name: "Main", branch_count: 1 }, { name: "Production", branch_count: 2 }, { name: 'Developement', branch_count: 10 }]
const defaultOrganizations = [{ name: 'petunias' }, { name: 'tulips' }]
const Play: React.FC = () => {
  const [databases, setDatabases] = useState<Database[]>([])
  const wateringCan = useRef<PixiRef<typeof Sprite>>()
  const lilman = useRef<PixiRef<typeof Sprite>>()
  const [treeRefs, setTreeRefs] = useState<RefObject<PixiSprite>[]>([])
  const [watering, setWatering] = useState(false)
  const [organizations, setOrganizations] = useState(defaultOrganizations)
  const [gateRefs, setGateRefs] =  useState<RefObject<PixiSprite>[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<string>()
  const backGate = useRef<PixiRef<typeof Sprite>>()
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
    setGateRefs(organizations.map(d => createRef<PixiRef<typeof Sprite>>()))
  }, [organizations])

  useEffect(() => {
    const water = keyboard("a");
    water.press = () => {
      if (!currentOrganization) {
        setWatering(true)
      }
    }
    water.release = () => {
      if (!currentOrganization) {
        setWatering(false)
      }
    }
  }, [currentOrganization])

  useEffect(() => {
    const enter = keyboard("e")
    enter.release = () => {
      if (currentOrganization) {
        if (intersect(backGate.current as PixiSprite, lilman.current as PixiSprite)) {
          setCurrentOrganization(undefined)
          setDatabases([])
        }
      }

      else {
        gateRefs.forEach((g, i) => {
          if (intersect(g.current as PixiSprite, lilman.current as PixiSprite)) {
            setCurrentOrganization(organizations[i].name)
            setDatabases(defaultDatabases)
          }
        })
      }
    }
  }, [currentOrganization])

  function intersect(a: PixiSprite, b: PixiSprite) {
    if (!a || !b) {
      return false
    }
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  } 

  const draw = React.useCallback(g => {
    g.clear()
    g.beginFill(0x2AB14C)
    g.drawRect(0, 440, 500, 75)
    g.endFill()
  }, [])

  return (
    <Layout>
      <Stage width={500} height={500} options={{ backgroundColor: currentOrganization ? 0xF2C549 : 0xBFECF7 }}>
        <Graphics draw={draw} />
        <Container x={100} y={100}>
          {currentOrganization && databases.map((d, i) => <Tree ref={treeRefs[i]} key={`tree_${d.name}`} x={i*100} y={320} database={d}/>)}
          {!currentOrganization && organizations.map((o,i) => {
            return <Gate ref={gateRefs[i]} key={`tree_${o.name}`} x={i*100} y={300} name={o.name}/>
          })}
          {currentOrganization && <Gate ref={backGate}  x={300} y={300} name={'Go back'}/>}
          <RefLilMan innerRef={lilman} currentUser='Frances' wateringCan={wateringCan} watering={watering} />
        </Container>
      </Stage>
    </Layout>
  )
}

export default Play