import React, { useState } from 'react'
import { Stage, Container } from '@inlet/react-pixi'
import LilMan from 'components/LilMan'
import Tree from 'components/Tree'
import { Database } from 'utils/types'

const Play: React.FC = () => {
  const [databases, setDatabases] = useState<Database[]>([{name: "Main", branch_count: 1 }, { name: "Production", branch_count: 2 }, { name: 'Developement', branch_count: 10 }])
  return (
    <Stage width={500} height={500} options={{ backgroundColor: 0xF2C549 }}>
      <Container x={100} y={100} sortChildren={true}>
        {databases.map((d, i) => <Tree key={`tree_${d.name}`} x={i*100} y={300} database={d}/>)}
        <LilMan currentUser='Frances' />
      </Container>
    </Stage>
  )
}

export default Play