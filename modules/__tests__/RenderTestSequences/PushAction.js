import React from 'react'
import expect from 'expect'
import { Push } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action }) => {
      expect(action).toBe('POP')
      return <Push path="/hello"/>
    },
    ({ action }) => {
      expect(action).toBe('PUSH')
      return null
    }
  ]

  return createRenderProp(steps, done)
}
