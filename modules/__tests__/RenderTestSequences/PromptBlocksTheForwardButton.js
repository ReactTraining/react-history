import React from 'react'
import expect from 'expect'
import { Push, Back, Forward } from '../../HistoryActions'
import Prompt from '../../Prompt'
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

      return <Back/>
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/one'
      })

      return (
        <div>
          <Prompt message={(_, callback) => callback(false)}/>
          <Forward/>
        </div>
      )
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/one'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
