import React from 'react'
import expect from 'expect'
import { Push, Back, Prompt } from '../../HistoryActions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      return <Push path="/hello"/>
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/hello'
      })

      return (
        <div>
          <Prompt message={(_, callback) => callback(false)}/>
          <Back/>
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
