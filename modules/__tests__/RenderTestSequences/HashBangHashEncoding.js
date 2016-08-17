import React from 'react'
import expect from 'expect'
import { Push, Back, Forward } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    () => {
      expect(window.location.hash).toBe('#!/')
      return <Push path="/hello"/>
    },
    () => {
      expect(window.location.hash).toBe('#!/hello')
      return <Back/>
    },
    () => {
      expect(window.location.hash).toBe('#!/')
      return <Forward/>
    },
    () => {
      expect(window.location.hash).toBe('#!/hello')
      return null
    }
  ]

  return createRenderProp(steps, done)
}
