import React, { useState, useRef, createRef, useEffect, RefObject } from 'react'
import { Stage, Container, PixiRef, Sprite, Graphics } from '@inlet/react-pixi'
import { Sprite as PixiSprite } from 'pixi.js'
import { generateSlug } from "random-word-slugs";

import { RefLilMan } from 'components/LilMan'
import Tree from 'components/Tree'
import { Database } from 'utils/types'
import { keyboard } from 'lib/utils'
import Layout from 'components/Layout'
import Gate from 'components/Gate'
import useUser from 'lib/useUser'

const Play: React.FC<{ apiUrl: string }> = ({ apiUrl}) => {
  const [databases, setDatabases] = useState<Database[]>([])
  const wateringCan = useRef<PixiRef<typeof Sprite>>()
  const lilman = useRef<PixiRef<typeof Sprite>>()
  const [treeRefs, setTreeRefs] = useState<RefObject<PixiSprite>[]>([])
  const [watering, setWatering] = useState(false)
  const [organizations, setOrganizations] = useState<{ name: string }[]>([])
  const [gateRefs, setGateRefs] =  useState<RefObject<PixiSprite>[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<string>()
  const backGate = useRef<PixiRef<typeof Sprite>>()

  const { user }= useUser()
  useEffect(() => {
    if (user?.planetscaleToken) {
      fetch(`${apiUrl}/organizations`, { headers: {'Authorization': `${user.planetscaleTokenId}:${user.planetscaleToken}`} }).then((res) => {
        res.json().then(data => {
          setGateRefs(data.data.map(() => createRef<PixiRef<typeof Sprite>>()))
          setOrganizations(data.data)
        })
      })
    }
  }, [user])

  useEffect(() => {
    if (user?.planetscaleToken && currentOrganization) {
      fetch(`${apiUrl}/organizations/${currentOrganization}/databases`, { headers: {'Authorization': `${user.planetscaleTokenId}:${user.planetscaleToken}`} }).then((res) => {
        res.json().then(data => {
          setTreeRefs(data.data.map(() => createRef<PixiRef<typeof Sprite>>()))
          setDatabases(data.data)
        })
      })
    }
  }, [user, currentOrganization])

  useEffect(() => {
    if (watering) {
      treeRefs.forEach((t, i) => {
        if (intersect(t.current as PixiSprite, wateringCan.current as PixiSprite)) {
          fetch(`${apiUrl}/organizations/${currentOrganization}/databases/${databases[i].name}/branches`, {
            method: 'post',
            body: JSON.stringify({ name: generateSlug() }), 
            headers: {
              'Authorization': `${user?.planetscaleTokenId}:${user?.planetscaleToken}`,
              'Content-Type': 'application/json'
            } 
          }).then((res) => {
            res.json().then(data => {              
              databases[i].branches_count += 1
              setDatabases([...databases])
            })
          })          
        }
      })
    }
  }, [watering])

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
            setCurrentOrganization(organizations[i]?.name)
          }
        })
      }
    }
  }, [organizations, currentOrganization])

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
          {currentOrganization && <Gate ref={backGate as React.MutableRefObject<PixiSprite | null>}  x={300} y={300} name={'Go back'}/>}
          <RefLilMan innerRef={lilman} currentUser='Frances' wateringCan={wateringCan} watering={watering} />
        </Container>
      </Stage>
      <div style={{
        position: 'absolute',
        top: 'calc(50% + 300px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500
    }}>
          <h3>Controls</h3>
          <strong>up, down, left, right arrows:</strong> move lil man
          <br />
          <strong>e:</strong> enter door
          <br />
          <strong>a: </strong>water tree (creates a new branch)
      </div>
    </Layout>
  )
}

export default Play

export async function getServerSideProps() {
  return {
    props: {
      apiUrl: process.env.PLANETSCALE_API_URL
    }, // will be passed to the page component as props
  }
}