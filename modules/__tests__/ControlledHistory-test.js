import expect from 'expect'
import ControlledHistory from '../ControlledHistory'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import createMemoryHistory from 'history/createMemoryHistory'


const renderTestSequence = ({ history, steps }) => {
  let blocking = false

  const block = () => blocking = true
  const unblock = () => blocking = false

  class Assert extends React.Component {

    count = 0

    componentDidMount() {
      this.assert()
    }
    componentDidUpdate() {
      this.assert()
    }
    assert() {
      const { history, component } = this.props
      const { state } = component
      const nextStep = steps.shift()
      if (nextStep) {
        nextStep({ history, state, component, block, unblock })
      } else {
        unmountComponentAtNode(div)
      }
    }
    render() {
      return <div/>
    }
  }

  class App extends React.Component {
    state = {
      location: history.location,
      action: 'POP'
    }

    render() {
      return (
        <ControlledHistory
          saveKeys={() => {}}
          restoreKeys={() => [ null ]}
          history={history}
          action={this.state.action}
          location={this.state.location}
          onChange={(location, action) => {
            // YOU MUST ALWAYS ACCEPT A SYNC!
            // I wonder if there's a way to warn if you don't ...
            if (action === 'SYNC' || !blocking) {
              this.setState({ location, action })
            }
          }}
        >
          {(history) => (
            <Assert
              history={history}
              component={this}
            />
          )}
        </ControlledHistory>
      )
    }
  }

  const div = document.createElement('div')
  render(<App/>, div)
}

describe.only('ControlledHistory', () => {
  describe('when the history calls back with a new location', () => {
    describe('and a location is "accepted"', () => {
      it('syncs state on history.push', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              const { entries, index } = history
              expect(entries.length).toBe(1)
              expect(index).toBe(0)
              history.push('/two')
            },

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(1)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.replace', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              const { entries, index } = history
              expect(entries.length).toBe(1)
              expect(index).toBe(0)
              history.replace('/two')
            },

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(1)
              expect(index).toBe(0)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.goForward', (done) => {
        renderTestSequence({
          history: createMemoryHistory({
            initialEntries: [ '/one', '/two' ],
            initialIndex: 0
          }),
          steps: [
            ({ history }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(0)
              history.goForward()
            },

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(1)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.goBack', (done) => {
        renderTestSequence({
          history: createMemoryHistory({
            initialEntries: [ '/one', '/two' ],
            initialIndex: 1
          }),
          steps: [
            ({ history }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(1)
              history.goBack()
            },

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(0)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.go(2)', (done) => {
        renderTestSequence({
          history: createMemoryHistory({
            initialEntries: [ '/one', '/two', '/three' ],
            initialIndex: 0
          }),
          steps: [
            ({ history }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(0)
              history.go(2)
            },

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(2)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.go(-2)', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/0' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {},

            ({ history }) => {
              setTimeout(() => {
                history.push('/2')
              }, 0)
            },

            () => {},

            ({ history }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(2)
              setTimeout(() => {
                history.go(-2)
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(0)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })
    })

    describe('and a location is "rejected"', () => {
      it('syncs state on history.push', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history, block }) => {
              block()
              history.push('/1')
            },

            () => {
              // haven't figured out why we get an update here
            },

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(0)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on multiple attempts to history.push', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {
              // haven't figured out why we get an update here
            },

            ({ history, block }) => {
              setTimeout(() => {
                block()
                history.push('/2')
              })
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(1)
              expect(entries[index]).toBe(state.location)
              setTimeout(() => {
                history.push('/1')
              })
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(1)
              expect(entries[index]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.replace', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {},

            ({ history, block }) => {
              setTimeout(() => {
                block()
                history.replace('/2')
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(1)
              // since it was replaced, we won't get it back by identity
              // so we can't check on identity, just values
              expect(entries[index].pathname).toBe('/1')
              expect(entries[index].key).toBe(state.location.key)
              done()
            }
          ]
        })
      })

      it('syncs state on history.goForward', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {},

            ({ history }) => {
              setTimeout(() => {
                history.go(-1)
              }, 0)
            },

            () => {},

            ({ history, block }) => {
              setTimeout(() => {
                block()
                history.goForward()
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(0)
              expect(entries[0]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.goForward after an attempted push (click a link, then click the browser forward button)', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {},

            ({ history, block }) => {
              setTimeout(() => {
                block()
                history.push('/2')
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              // can't help it, we get an entry since you can't really
              // control the history of a browser
              expect(entries.length).toBe(3)
              expect(index).toBe(1)
              expect(entries[1]).toBe(state.location)
              setTimeout(() => {
                // browser forward button
                history.goForward()
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              // can't help it, we get an entry since you can't really
              // control the history of a browser
              expect(entries.length).toBe(3)
              expect(index).toBe(1)
              expect(entries[1]).toBe(state.location)
              done()
            }

          ]
        })
      })

      it('syncs state on history.goBack', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {},

            ({ history, block }) => {
              setTimeout(() => {
                block()
                history.goBack()
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(2)
              expect(index).toBe(1)
              expect(entries[1]).toBe(state.location)
              done()
            }
          ]
        })
      })

      it('syncs state on history.go(-2)', (done) => {
        renderTestSequence({
          history: createMemoryHistory({ initialEntries: [ '/' ] }),
          steps: [
            ({ history }) => {
              setTimeout(() => {
                history.push('/1')
              }, 0)
            },

            () => {},

            ({ history }) => {
              setTimeout(() => {
                history.push('/2')
              }, 0)
            },

            () => {},

            ({ history, block }) => {
              setTimeout(() => {
                block()
                history.go(-2)
              }, 0)
            },

            () => {},

            ({ history, state }) => {
              const { entries, index } = history
              expect(entries.length).toBe(3)
              expect(index).toBe(2)
              expect(entries[2]).toBe(state.location)
              done()
            }
          ]
        })
      })
    })
  })

  describe('when a location descriptor is passed in as a prop', () => {
    it('syncs state with a PUSH action', (done) => {
      renderTestSequence({
        history: createMemoryHistory({ initialEntries: [ '/one' ] }),
        steps: [
          ({ component }) => {
            setTimeout(() => {
              component.setState({
                location: { pathname: '/two', state: { v: 'test' } },
                action: 'PUSH'
              })
            }, 0)
          },

          ({ history, state }) => {
            const { entries, index } = history
            expect(entries.length).toBe(2)
            expect(index).toBe(1)
            expect(entries[index].pathname).toEqual('/two')
            expect(entries[index].pathname).toEqual(state.location.pathname)
            expect(entries[index].state).toEqual(state.location.state)
            done()
          }
        ]
      })
    })

    it('syncs state with a REPLACE action', (done) => {
      renderTestSequence({
        history: createMemoryHistory({ initialEntries: [ '/one' ] }),
        steps: [
          ({ component }) => {
            component.setState({
              location: { pathname: '/two', state: 'test' },
              action: 'REPLACE'
            })
          },

          ({ history, state }) => {
            const { entries, index } = history
            expect(entries.length).toBe(1)
            expect(index).toBe(0)
            expect(entries[index].pathname).toEqual('/two')
            expect(entries[index].pathname).toEqual(state.location.pathname)
            expect(entries[index].state).toEqual(state.location.state)
            done()
          }
        ]
      })
    })
  })

  describe('when a previously seen location is passed in as a prop', () => {
    it('syncs state', (done) => {
      const paths = [ '/0', '/1', '/2' ]
      renderTestSequence({
        history: createMemoryHistory({ initialEntries: [ '/' ] }),
        steps: [
          ({ history }) => {
            setTimeout(() => {
              history.push(paths[1])
            }, 0)
          },

          () => {},

          ({ history }) => {
            setTimeout(() => {
              history.push(paths[2])
            }, 0)
          },

          () => {},

          ({ history, component }) => {
            const expectedIndex = 2
            const { entries, index } = history
            expect(entries.length).toBe(3)
            expect(index).toBe(expectedIndex)
            setTimeout(() => {
              component.setState({
                location: entries[index - 1],
                action: 'POP'
              })
            }, 0)
          },

          ({ history, state, component }) => {
            const expectedIndex = 1
            const { entries, index } = history
            expect(entries.length).toBe(3)
            expect(index).toBe(expectedIndex)
            expect(entries[index].pathname).toEqual(paths[expectedIndex])
            expect(entries[index].pathname).toEqual(state.location.pathname)
            setTimeout(() => {
              component.setState({
                location: entries[index + 1],
                action: 'POP'
              })
            }, 0)
          },

          ({ history, state }) => {
            const expectedIndex = 2
            const { entries, index } = history
            expect(entries.length).toBe(3)
            expect(index).toBe(expectedIndex)
            expect(entries[index].pathname).toEqual(paths[expectedIndex])
            expect(entries[index].pathname).toEqual(state.location.pathname)
            done()
          }
        ]
      })
    })
  })
})

