import React from 'react'
import expect from 'expect'
import { Push } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  const steps = [
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/'
      })

      return <Push path="/hello" state={{ the: 'state' }}/>
    },
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/hello',
        state: { the: 'state' },
        key: /^[0-9a-z]+$/
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
