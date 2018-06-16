import * as React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import FormSearchImageNet from './FormSearchImageNet'
import ImageNetTreeNode from './ImageNetTreeNode'

interface IAppProps {}

interface IAppState {
  searchValue: string
}

const QUERY_GET_TREE = gql`
  query getTreeFlatJson($searchValue: String) {
    treeFlatJson(search: $searchValue)
  }
`

export default class App extends React.PureComponent<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props)
    this.state = {searchValue: ''}
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this)
  }

  private handleSubmitSearch(searchValue: string) {
    this.setState({...this.state, searchValue})
  }

  render() {
    return (
      <div>
        <div>
          <FormSearchImageNet onSubmitSearch={this.handleSubmitSearch} />
        </div>
        <div>
          <Query query={QUERY_GET_TREE} variables={{ searchValue: this.state.searchValue }}>{
            ({ loading, error, data }) => {
              // Intermediate states
              if (loading) return <p>Loading data..</p>
              if (error) return <p>Error!</p>

              // Render fetched data
              return <ImageNetTreeNode tree={JSON.parse(data.treeFlatJson)} />
            }
          }</Query>
        </div>
      </div>
    )
  }
}
