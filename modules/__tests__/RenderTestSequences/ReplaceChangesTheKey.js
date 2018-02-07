import React from 'react'
import expect from 'expect'
import { Push, Replace } from '../../Actions'
import createRenderProp from './createRenderProp'

export default (done) => {
  let keyAfterPush

  const steps = [
    ({ location }) => {
      const {hash, pathname, search, state} = location

      expect({hash, pathname, search, state}).toMatch({
        hash: '',
        pathname: '/',
        search: '',
        state: undefined
      })

      return <Push path="/hello" state={{ the: 'state' }}/>
    },
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/hello',
        state: { the: 'state' },
        key: /^[0-9a-z]+$/
      })

      keyAfterPush = location.key

      return <Replace path="/goodbye" state={{ more: 'state' }}/>
    },
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/goodbye',
        state: { more: 'state' },
        key: /^[0-9a-z]+$/
      })

      expect(location.key).toNotBe(keyAfterPush)

      return null
    }
  ]

  return createRenderProp(steps, done)
}
