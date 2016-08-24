import React from 'react'
import expect from 'expect'
import { Push } from '../../Actions'
import Prompt from '../../Prompt'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      return (
        <div>
          <Prompt when={false} message={(_, callback) => callback(false)}/>
          <Push path="/hello"/>
        </div>
      )
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/hello'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
