import React from 'react'
import Navigation from './components/Navigation'
import Table from './components/Table'

class App extends React.Component {
  constructor (props) {
    super(props)

    let os = 'any'
    if (/win/i.test(navigator.platform)) os = 'windows'
    else if (/mac/i.test(navigator.platform)) os = 'mac'
    else if (/linux/i.test(navigator.platform)) os = 'linux'

    this.state = {
      filters: {
        os: [os],
        arch: ['any'],
        type: ['any'],
        openjdk_impl: ['hotspot'],
        heap_size: ['any'],
        release: ['latest']
      },
      search: '',
      url: 'https://api.adoptopenjdk.net/v2/info/releases/openjdk8',
      results: []
    }

    fetch(this.state.url)
      .then(res => res.json())
      .then(json => {
        if (!Array.isArray(json)) json = [json]
        this.setState({ results: json })
      })
  }

  handleFilters = (cid, fid) => {
    const newFilters = { ...this.state.filters }
    const index = newFilters[fid].indexOf(cid)
    const anyIndex = newFilters[fid].indexOf('any')

    if (index === -1) {
      if (cid === 'any') {
        newFilters[fid].length = 0
      } else if (anyIndex !== -1) {
        newFilters[fid].splice(anyIndex, 1)
      }
      newFilters[fid].push(cid)
    } else {
      newFilters[fid].splice(index, 1)
    }

    if (!newFilters[fid].length) {
      newFilters[fid].push('any')
    }

    this.setState({ filters: newFilters })
  }

  handleSearch = e => {
    this.setState({ search: e.target.value })
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    let url = 'https://api.adoptopenjdk.net/v2/info/releases/openjdk'
    url += '8?'

    const applyFilter = f => {
      return this.state.filters[f][0] === 'any'
        ? url
        : url + f + '=' + this.state.filters[f][0] + '&'
    }

    Object.keys(this.state.filters).forEach(f => {url = applyFilter(f)})

    if (url !== this.state.url && url !== nextState.url) {
      fetch(url)
        .then(res => res.json())
        .then(json => {
          if (!Array.isArray(json)) json = [json]
          this.setState({ results: json, url: url })
        })
    }
  }

  render () {
    return (
      <>
        <Navigation
          filters={this.state.filters}
          search={this.state.search}
          handleFilters={this.handleFilters}
          handleSearch={this.handleSearch}
        />
        <Table releases={this.state.results}/>
      </>
    )
  }
}

export default App
