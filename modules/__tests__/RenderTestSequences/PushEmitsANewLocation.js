import React from 'react'
import expect from 'expect'
import { Push } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ location }) => {
      expect(location).toMatch({
        path: '/'
      })

      return <Push path="/hello"/>
    },
    ({ location }) => {
      expect(location).toMatch({
        path: '/hello'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
