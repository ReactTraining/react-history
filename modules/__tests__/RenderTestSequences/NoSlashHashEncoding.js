import React from 'react'
import expect from 'expect'
import { Push, Back, Forward } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    () => {
      // IE 10+ gives us "#", everyone else gives us ""
      expect(window.location.hash).toMatch(/^#?$/)
      return <Push path="/hello"/>
    },
    () => {
      expect(window.location.hash).toBe('#hello')
      return <Back/>
    },
    () => {
      // IE 10+ gives us "#", everyone else gives us ""
      expect(window.location.hash).toMatch(/^#?$/)
      return <Forward/>
    },
    () => {
      expect(window.location.hash).toBe('#hello')
      return null
    }
  ]

  return createRenderProp(steps, done)
}
