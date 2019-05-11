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
        version: ['any'],
        os: [os],
        arch: ['any'],
        type: ['any'],
        openjdk_impl: ['hotspot'],
        heap_size: ['any'],
        release: ['latest']
      },
      search: '',
      urls: ['https://api.adoptopenjdk.net/v2/info/releases/openjdk8'],
      results: []
    }

    this.componentWillUpdate({}, this.state, {})
  }

  handleFilters = (cid, fid) => {
    const newFilters = { ...this.state.filters }
    const index = newFilters[fid].indexOf(cid)
    const anyIndex = newFilters[fid].indexOf('any')

    if (index === -1) {
      if (cid === 'any') newFilters[fid].length = 0
      else if (anyIndex !== -1) newFilters[fid].splice(anyIndex, 1)
      newFilters[fid].push(cid)
    } else newFilters[fid].splice(index, 1)

    if (!newFilters[fid].length) newFilters[fid].push('any')

    this.setState({ filters: newFilters })
  }

  handleSearch = e => {
    this.setState({ search: e.target.value })
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    const url = 'https://api.adoptopenjdk.net/v2/info/releases/openjdk'
    const urls = []
    const versions = this.state.filters.version[0] === 'any'
      ? [8, 9, 10, 11, 12]
      : this.state.filters.version.map(v => Number(v.split(' ')[1]))

    versions.forEach(v => urls.push(url + v + '?'))

    const applyFilter = (f, u) => {
      return this.state.filters[f][0] === 'any' || f === 'version'
        ? u
        : u + f + '=' + this.state.filters[f][0] + '&'
    }

    let i = 0
    let results = []

    urls.forEach((u, index) => {
      Object.keys(this.state.filters).forEach(f => {u = applyFilter(f, u)})
      urls[index] = u

      if (
        (this.state.urls.indexOf(u) === -1 && nextState.urls.indexOf(u) === -1) ||
        (this.state.urls.length !== urls.length && nextState.urls.length !== urls.length)
      ) {
        fetch(u)
          .then(res => res.json())
          .then(json => {
            if (!Array.isArray(json)) json = [json]
            results = results.concat(json)
            i++
            if (i === urls.length) this.setState({ results, urls })
          })
          .catch(() => this.setState({ results, urls }))
      }
    })
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
        <Table releases={this.state.results} search={this.state.search}/>
      </>
    )
  }
}

export default App
