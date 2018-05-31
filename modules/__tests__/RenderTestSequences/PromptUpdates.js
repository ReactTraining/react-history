import React from 'react'
import expect, { spyOn } from 'expect'
import { Push } from '../../Actions'
import Prompt from '../../Prompt'
import createRenderProp from './createRenderProp'

export default (done) => {
  class TestComponent extends React.Component {
    state = { message: 'Are you sure?', when: false }
    componentDidMount() {
      this.setState({ message: 'Are you totally sure?', when: true })
    }
    render() {
      return (
        <div>
          <Prompt {...this.state}/>
          {this.state.when && <Push path="/hello"/>}
        </div>
      )
    }
  }

  const steps = [
    (history) => {
      const { action, location } = history
      expect(action).toBe('POP')
      expect(location).toMatch({
        pathname: '/'
      })

      spyOn(history, 'block')

      return <TestComponent />
    },
    ({ block }) => {
      expect(block.calls.length).toBe(1)
      expect(block).toHaveBeenCalledWith('Are you totally sure?')
      expect(location).toMatch({
        pathname: '/hello'
      })

      block.restore()

      return null
    }
  ]

  return createRenderProp(steps, done)
}
