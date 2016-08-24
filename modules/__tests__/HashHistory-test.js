import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import HashHistory from '../HashHistory'
import * as RenderTestSequences from './RenderTestSequences'

describe('HashHistory', () => {
  let node
  beforeEach(() => {
    if (window.location.hash !== '')
      window.location.hash = ''

    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  describe('push', () => {
    it('emits a PUSH action', (done) => {
      const children = RenderTestSequences.PushEmitsAPushAction(done)
      render(<HashHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.PushEmitsANewLocation(done)
      render(<HashHistory children={children}/>, node)
    })
  })

  describe('replace', () => {
    it('emits a REPLACE action', (done) => {
      const children = RenderTestSequences.ReplaceEmitsAReplaceAction(done)
      render(<HashHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.ReplaceEmitsANewLocation(done)
      render(<HashHistory children={children}/>, node)
    })
  })

  describe('pop', () => {
    it('emits a POP action', (done) => {
      const children = RenderTestSequences.PopEmitsAPopAction(done)
      render(<HashHistory children={children}/>, node)
    })

    it('emits a new location', (done) => {
      const children = RenderTestSequences.PopEmitsANewLocation(done)
      render(<HashHistory children={children}/>, node)
    })
  })

  describe('with a basename', () => {
    describe('push', () => {
      it('emits a new location', (done) => {
        const children = RenderTestSequences.PushEmitsANewLocation(done)
        render(<HashHistory basename="/base" children={children}/>, node)
      })
    })

    describe('replace', () => {
      it('emits a new location', (done) => {
        const children = RenderTestSequences.ReplaceEmitsANewLocation(done)
        render(<HashHistory basename="/base" children={children}/>, node)
      })
    })

    describe('pop', () => {
      it('emits a new location', (done) => {
        const children = RenderTestSequences.PopEmitsANewLocation(done)
        render(<HashHistory basename="/base" children={children}/>, node)
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
      render(<HashHistory getUserConfirmation={declineAndFinish(done)} children={children}/>, node)
    })

    it('blocks a replace', (done) => {
      const children = RenderTestSequences.PromptBlocksAReplace(done)
      render(<HashHistory getUserConfirmation={declineAndFinish(done)} children={children}/>, node)
    })

    it('blocks the back button or go(-1)', (done) => {
      const children = RenderTestSequences.PromptBlocksTheBackButton(done)
      render(<HashHistory getUserConfirmation={decline} children={children}/>, node)
    })

    it('blocks the forward button or go(1)', (done) => {
      const children = RenderTestSequences.PromptBlocksTheForwardButton(done)
      render(<HashHistory getUserConfirmation={decline} children={children}/>, node)
    })
  })

  describe('"hashbang" hash encoding', () => {
    it('formats the hash correctly', (done) => {
      const children = RenderTestSequences.HashBangHashEncoding(done)
      render(<HashHistory hashType="hashbang" children={children}/>, node)
    })
  })

  describe('"noslash" hash encoding', () => {
    it('formats the hash correctly', (done) => {
      const children = RenderTestSequences.NoSlashHashEncoding(done)
      render(<HashHistory hashType="noslash" children={children}/>, node)
    })
  })

  describe('"slash" hash encoding', () => {
    it('formats the hash correctly', (done) => {
      const children = RenderTestSequences.SlashHashEncoding(done)
      render(<HashHistory hashType="slash" children={children}/>, node)
    })
  })

  describe('inactive prompt', () => {
    it('allows a push', (done) => {
      const children = RenderTestSequences.InactivePromptAllowsAPush(done)
      render(<HashHistory children={children}/>, node)
    })
  })
})
