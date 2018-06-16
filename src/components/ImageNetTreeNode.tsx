import * as React from 'react'
import * as R from 'ramda'

interface IImageNetTreeNode {
  id: number
  name: string
  size: number
  children: IImageNetTreeNode[]
}

interface IIImageNetTreeNodeProps {
  tree: IImageNetTreeNode
}

// Nice & beauty ASCI visualization of a tree-node
const buildNodePrefix: (level: number) => string = level => {
  return new Array(level * 5 + 1).join(' ') + ' └──'
}

// Build a node-suffix by it's total count of leafs
const buildNodeSuffix: (countLeafs: number) => string = countLeafs => {
  return countLeafs > 0 ? '(' + String(countLeafs) + ')' : ''
}

// Returns the number of leafs contained in `tree`
export const containsLeaves: (tree: IImageNetTreeNode) => number = (tree) => {
  return R.reduce((acc: number, el: IImageNetTreeNode): number => (
    (el.size === 0) ? acc + 1 : acc + containsLeaves(el)
  ), 0 as number, tree.children)
}

export default class ImageNetTreeNode extends React.PureComponent<IIImageNetTreeNodeProps> {

  // Renders a single tree-node
  private renderNode(tree: IImageNetTreeNode, level: number): JSX.Element | null {
    const countLeafs = containsLeaves(tree)

    if (countLeafs === 0 && tree.size > 0) { // Intermediate node with no leafs
      return null
    }

    return (
      <div key={tree.id}>
        <pre>{buildNodePrefix(level)} {tree.name} {buildNodeSuffix(countLeafs)}</pre>
        <div>
          { tree.children.map(child => this.renderNode(child, level + 1)) }
        </div>
      </div>
    )
  }

  render() {
    return this.renderNode(this.props.tree, 0)
  }
}

/*
 * TODO: Extract some functions into /helpers/ImageNetTree.js
 */
