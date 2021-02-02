import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// class Square extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       value: null,
//     }
//   }
//   render() {
//     return (
//       <button className='square' onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     )
//   }
// }
function Square(props) {
  return (
    <button className={'square ' + props.className} onClick={() => props.onClick()}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    let className
    if (this.props.winnerDir && this.props.winnerLine.includes(i)) {
      className = `square-${this.props.winnerDir}`
    }
    return <Square value={this.props.squares[i]} className={className} onClick={() => this.props.onClick(i)} />
  }

  render() {
    let rows = []
    for (let i = 0; i < 3; i++) {
      let cells = []
      for (let j = 0; j < 3; j++) {
        let index = i * 3 + j
        cells.push(<React.Fragment key={j}>{this.renderSquare(index)}</React.Fragment>)
      }
      rows.push(
        <div className='board-row' key={i}>
          {cells}
        </div>
      )
    }
    return <div>{rows}</div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          activeGrid: null,
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        {
          squares: squares,
          activeGrid: [Math.floor(i / 3), i % 3],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move}>
          <button
            className={move === this.state.stepNumber ? 'font-weight-bold' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
          {step.activeGrid ? `row:${step.activeGrid[0]}；cell:${step.activeGrid[1]}` : ''}
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner.winner
    } else {
      if (this.state.history.length === 10) {
        status = '平局'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      }
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winner?.line}
            winnerDir={winner?.dir}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  const dir = ['horizontal', 'horizontal', 'horizontal', 'vertical', 'vertical', 'vertical', 'back-slash', 'slash']

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        dir: dir[i],
      }
    }
  }
  return null
}
