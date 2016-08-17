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

      return <Push pathname="/hello" search="?the=query" hash="#the-hash"/>
    },
    ({ location }) => {
      expect(location).toMatch({
        pathname: '/hello',
        search: '?the=query',
        hash: '#the-hash'
      })

      return null
    }
  ]

  return createRenderProp(steps, done)
}
