import React from 'react'
import { render } from 'react-dom'
import ControlledHistory from '../modules/ControlledHistoryExperimental'
import createBrowserHistory from 'history/createBrowserHistory'

class Link extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  render() {
    const { to, ...rest } = this.props // eslint-disable-line
    return (
      <a href={to} onClick={(event) => {
        event.preventDefault()
        this.context.history.push(to)
      }} {...rest} />
    )
  }
}

const history = createBrowserHistory()

class App extends React.Component {

  state = {
    location: history.location,
    action: 'POP'
  }

  render() {
    return (
      <ControlledHistory
        history={history}
        location={this.state.location}
        action={this.state.action}
        onChange={(location, action) => {
          if (action === 'SYNC' || !window.block) {
            this.setState({ location, action })
          } else {
            console.log('blocked!') // eslint-disable-line
          }
        }}
      >
        {() => (
          <div>
            <ul>
              <li><Link to="/one">One</Link></li>
              <li><Link to="/two">Two</Link></li>
              <li><Link to="/three">Three</Link></li>
              <li><a href="https://google.com">Google</a></li>
            </ul>
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
            <button onClick={() => {
              this.setState({
                location: { pathname: '/three' },
                action: 'PUSH'
              })
            }}>Go to /three</button>
          </div>
        )}
      </ControlledHistory>
    )
  }
}

render(<App/>, document.getElementById('app'))

