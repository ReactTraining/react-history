import React from 'react'
import expect from 'expect'
import { Push, Pop, Block } from '../../HistoryActions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      return <Push path="/one"/>
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/one'
      })

      return <Push path="/two"/>
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/two'
      })

      return <Pop/>
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/one'
      })

      return (
        <div>
          <Block message={(_, callback) => callback(false)}/>
          <Pop go={1}/>
        </div>
      )
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/one'
      })

      return <Pop go={1}/>
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/two'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
