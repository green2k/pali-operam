import * as React from 'react'
import * as Renderer from 'react-test-renderer'

import ImageNetTreeNode, { containsLeaves } from '../../src/components/ImageNetTreeNode'

const TREE_1 = {
  id: 1,
  name: 'Top parent',
  size: 5,
  children: [
    {id: 2, name: 'Child1', size: 0, children: []},
    {id: 3, name: 'Intermediate1', size: 3, children: [
      {id: 4, name: 'Child1Child1', size: 0, children: []},
      {id: 5, name: 'Child1Child2', size: 0, children: []},
      {id: 6, name: 'Child1Child3', size: 0, children: []},
    ]},
    {id: 7, name: 'Child3', size: 0, children: []},
  ]
}

describe('<ImageNetTreeNode>', () => {
  it('renders', () => {
    const actual = Renderer
      .create(<ImageNetTreeNode tree={TREE_1} />)
      .toJSON()
    expect(actual).toMatchSnapshot()
  })
})

describe('containsLeaves(..)', () => {
  it('Returns a correct number of leaves', () => {
    const actual = containsLeaves(TREE_1)
    expect(actual).toBe(5)
  })
})
