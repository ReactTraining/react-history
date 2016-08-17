import React from 'react'
import expect from 'expect'
import { Replace } from '../../Actions'
import Prompt from '../../Prompt'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ action, location }) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        pathname: '/'
      })

      return (
        <div>
          <Prompt message={(_, callback) => { callback(false); done() }}/>
          <Replace path="/hello"/>
        </div>
      )
    },
    () => {
      expect.assert(
        false,
        'A blocked <Replace> should not emit a new location'
      )
    }
  ]

  return createRenderProp(steps, done)
}
