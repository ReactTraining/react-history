import React from 'react'
import expect from 'expect'
import { Replace } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ location }) => {
      expect(location).toMatch({
        path: '/'
      })

      return <Replace path="/hello"/>
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
