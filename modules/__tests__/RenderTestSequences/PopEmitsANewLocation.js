import React from 'react'
import expect from 'expect'
import { Push, Pop } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/'
      })

      return <Push path="/hello"/>
    },
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/hello'
      })

      return <Pop/>
    },
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
