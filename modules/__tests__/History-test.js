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
    const PROP = 'test'

    let callCount = 0
    const createHistory = () => {
      callCount++
      return fakeHistory
    }
    const div = document.createElement('div')

    render((
      <History
        createHistory={createHistory}
        children={() => <div>{callCount}</div>}
        someProp={PROP}
      />
    ), div, () => {
      expect(callCount).toEqual(1)
      render((
        <History
          createHistory={createHistory}
          children={() => <div>{callCount}</div>}
          someProp={PROP}
        />
      ), div, () => {
        expect(callCount).toEqual(1)
        unmountComponentAtNode(div)
      })
    })
  })

  it('sets up a new history instance when history option props change', () => {
    const FIRST_PROP = 'test1'
    const DIFFERENT_PROP = 'test2'

    let callCount = 0
    const createHistory = () => {
      callCount++
      return fakeHistory
    }
    const div = document.createElement('div')

    render((
      <History
        someProp={FIRST_PROP}
        createHistory={createHistory}
        children={() => <div>{callCount}</div>}
      />
    ), div, () => {
      expect(callCount).toEqual(1)
      render((
        <History
          someProp={DIFFERENT_PROP}
          createHistory={createHistory}
          children={() => <div>{callCount}</div>}
        />
      ), div, () => {
        expect(callCount).toEqual(2)
        unmountComponentAtNode(div)
      })
    })
  })
})
