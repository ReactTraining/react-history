import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import BrowserHistory from '../BrowserHistory'
import * as RenderTestSequences from './RenderTestSequences'

describe('BrowserHistory', () => {
  let node
  beforeEach(() => {
    window.history.replaceState(null, null, '/')
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  describe('push', () => {
    it('emits a PUSH action', (done) => {
      const children = RenderTestSequences.PushAction(done)
      render(<BrowserHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.PushNewLocation(done)
      render(<BrowserHistory children={children}/>, node)
    })

    describe('with state', () => {
      it('uses a key', (done) => {
        const children = RenderTestSequences.PushWithStateUsesAKey(done)
        render(<BrowserHistory children={children}/>, node)
      })
    })
  })

  describe('replace', () => {
    it('emits a REPLACE action', (done) => {
      const children = RenderTestSequences.ReplaceAction(done)
      render(<BrowserHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.ReplaceNewLocation(done)
      render(<BrowserHistory children={children}/>, node)
    })

    it('changes the key', (done) => {
      const children = RenderTestSequences.ReplaceChangesTheKey(done)
      render(<BrowserHistory children={children}/>, node)
    })
  })

  describe('pop', () => {
    it('emits a POP action', (done) => {
      const children = RenderTestSequences.PopAction(done)
      render(<BrowserHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.PopNewLocation(done)
      render(<BrowserHistory children={children}/>, node)
    })
  })

  describe('with a basename', () => {
    describe('push', () => {
      it('emits a new location', (done) => {
        const children = RenderTestSequences.PushNewLocation(done)
        render(<BrowserHistory basename="/base" children={children}/>, node)
      })
    })

    describe('replace', () => {
      it('emits a new location', (done) => {
        const children = RenderTestSequences.ReplaceNewLocation(done)
        render(<BrowserHistory basename="/base" children={children}/>, node)
      })
    })

    describe('pop', () => {
      it('emits a new location', (done) => {
        const children = RenderTestSequences.PopNewLocation(done)
        render(<BrowserHistory basename="/base" children={children}/>, node)
      })
    })
  })

  describe('prompt', () => {
    const declineAndFinish = (done) =>
      (_, callback) => {
        callback(false)
        done()
      }

    const decline = (_, callback) =>
      callback(false)

    it('blocks a push', (done) => {
      const children = RenderTestSequences.PromptBlocksAPush(done)
      render(<BrowserHistory getUserConfirmation={declineAndFinish(done)} children={children}/>, node)
    })

    it('blocks a replace', (done) => {
      const children = RenderTestSequences.PromptBlocksAReplace(done)
      render(<BrowserHistory getUserConfirmation={declineAndFinish(done)} children={children}/>, node)
    })

    it('blocks the back button or go(-1)', (done) => {
      const children = RenderTestSequences.PromptBlocksTheBackButton(done)
      render(<BrowserHistory getUserConfirmation={decline} children={children}/>, node)
    })

    it('blocks the forward button or go(1)', (done) => {
      const children = RenderTestSequences.PromptBlocksTheForwardButton(done)
      render(<BrowserHistory getUserConfirmation={decline} children={children}/>, node)
    })
  })

  describe('inactive prompt', () => {
    it('allows a push', (done) => {
      const children = RenderTestSequences.InactivePromptAllowsAPush(done)
      render(<BrowserHistory children={children}/>, node)
    })
  })
})
