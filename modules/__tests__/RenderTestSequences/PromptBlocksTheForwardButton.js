import React from 'react'
import expect from 'expect'
import { Push, Back, Forward } from '../../Actions'
import Prompt from '../../Prompt'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        pathname: '/'
      })

      return <Push path="/one"/>
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        pathname: '/one'
      })

      return <Push path="/two"/>
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        pathname: '/two'
      })

      return <Back/>
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        pathname: '/one'
      })

      return (
        <div>
          <Prompt message="Are you sure?"/>
          <Forward/>
        </div>
      )
    },
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        pathname: '/one'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
