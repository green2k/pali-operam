import * as React from 'react'

interface IFormSearchImageNetProps {
  onSubmitSearch: (searchValue: string) => void
}

interface IFormSearchImageNetState {
  searchValue: string
}

export default class FormSearchImageNet extends React.PureComponent<IFormSearchImageNetProps, IFormSearchImageNetState> {

  constructor(props: IFormSearchImageNetProps) {
    super(props)
    this.state = {searchValue: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateSearchValue = this.updateSearchValue.bind(this)
  }

  private updateSearchValue(searchValue: string) {
    this.setState({...this.state, searchValue})
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.updateSearchValue(e.target.value)
  }

  private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    this.props.onSubmitSearch(this.state.searchValue)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type='string' value={this.state.searchValue} onChange={this.handleChange} />
        <input type='submit' />
      </form>
    )
  }
}
