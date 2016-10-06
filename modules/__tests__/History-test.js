import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import expect from 'expect'
import History from '../History'

describe('History', () => {
  const fakeHistory = {
    getCurrentLocation() { return '' },
    listen() {
      return () => {}
    }
  }

  it('does not set up a new history instance when history option props stay the same', () => {
    let callCount = 0
    const createHistory = () => {
      callCount++
      return fakeHistory
    }
    const div = document.createElement('div')

    render((
      <History
        createHistory={createHistory}
        historyOptions={{ prop: 'a' }}
        children={() => <div>{callCount}</div>}
      />
    ), div, () => {
      expect(callCount).toEqual(1)
      render((
        <History
          createHistory={createHistory}
          historyOptions={{ prop: 'a' }}
          children={() => <div>{callCount}</div>}
        />
      ), div, () => {
        expect(callCount).toEqual(1)
        unmountComponentAtNode(div)
      })
    })
  })
})
