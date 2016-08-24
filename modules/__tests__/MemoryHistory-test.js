import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import MemoryHistory from '../MemoryHistory'
import * as RenderTestSequences from './RenderTestSequences'

describe('MemoryHistory', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  describe('push', () => {
    it('emits a PUSH action', (done) => {
      const children = RenderTestSequences.PushEmitsAPushAction(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.PushEmitsANewLocation(done)
      render(<MemoryHistory children={children}/>, node)
    })

    describe('with state', () => {
      it('uses a key', (done) => {
        const children = RenderTestSequences.PushWithStateUsesAKey(done)
        render(<MemoryHistory children={children}/>, node)
      })
    })
  })

  describe('replace', () => {
    it('emits a REPLACE action', (done) => {
      const children = RenderTestSequences.ReplaceEmitsAReplaceAction(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.ReplaceEmitsANewLocation(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('changes the key', (done) => {
      const children = RenderTestSequences.ReplaceChangesTheKey(done)
      render(<MemoryHistory children={children}/>, node)
    })
  })

  describe('pop', () => {
    it('emits a POP action', (done) => {
      const children = RenderTestSequences.PopEmitsAPopAction(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.PopEmitsANewLocation(done)
      render(<MemoryHistory children={children}/>, node)
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
      render(<MemoryHistory getUserConfirmation={declineAndFinish(done)} children={children}/>, node)
    })

    it('blocks a replace', (done) => {
      const children = RenderTestSequences.PromptBlocksAReplace(done)
      render(<MemoryHistory getUserConfirmation={declineAndFinish(done)} children={children}/>, node)
    })

    it('blocks the back button or go(-1)', (done) => {
      const children = RenderTestSequences.PromptBlocksTheBackButton(done)
      render(<MemoryHistory getUserConfirmation={decline} children={children}/>, node)
    })

    it('blocks the forward button or go(1)', (done) => {
      const children = RenderTestSequences.PromptBlocksTheForwardButton(done)
      render(<MemoryHistory getUserConfirmation={decline} children={children}/>, node)
    })
  })

  describe('inactive prompt', () => {
    it('allows a push', (done) => {
      const children = RenderTestSequences.InactivePromptAllowsAPush(done)
      render(<MemoryHistory children={children}/>, node)
    })
  })
})
