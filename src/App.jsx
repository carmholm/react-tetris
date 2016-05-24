import React from 'react';
import ReactDOM from 'react-dom';
import constants from './constants.js';
import Grid from './components/grid.jsx';


function rotateRight(array){
    var n = array.length;
    var rotated = [];
	array.map(function(row, i){
		rotated[i]=[];
		row.map(function(cell, j){
			rotated[i][j] = array[n-j-1][i]
		})
	})
    return rotated;
}

function getTets(){
	var pieces = ['I', 'J', 'Z', 'S', 'O', 'L', 'T'];
	var randomNumber = Math.floor(Math.random()*7);
	return constants.SHAPES[pieces[randomNumber]];
}


class App extends React.Component{
	constructor(props){
		super();
		this.state={
			grid: Grid.GetInitialGrid(constants.GRID_ROWS, constants.GRID_COLS),
			activePiece: getTets(),
			activePiecePosition: {
				x: 3,
				y: -3
			},
			pieceStartTime: new Date()
		}
	this.updateGameState=this.updateGameState.bind(this);
	this.handleKeydown=this.handleKeydown.bind(this);
	}
	componentDidMount(){
		document.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
		this.updateGameState();
	}
	//right 39
	//left 37
	//up 38
	//down 40
	handleKeydown(e){
		console.log(e.which)
		switch(e.which){
			case 39:
				var x = this.state.activePiecePosition.x;
				var newX = x + 1;
				this.state.activePiecePosition.x=newX;
				this.setState({activePIecePosition: this.state.activePiecePosition});
				return;
			case 37:
				var x = this.state.activePiecePosition.x;
				var newX = x - 1;
				this.state.activePiecePosition.x=newX;
				this.setState({activePIecePosition: this.state.activePiecePosition});
				return;
			case 38:
				this.setState({activePiece: rotateRight(this.state.activePiece)});
				return;
			case 40:
				this.hardDrop = true;
				return;
		}
	}
	handleKeyup(e){
		if (e.which === 40){
			this.hardDrop = false;
		}
	}
	updateGameState(){
		var currentState=this.state;
		var y = currentState.activePiecePosition.y;
		var elapsedSeconds = (new Date() - this.state.pieceStartTime)/1000;
		//put the minus three in a constant somewhere?
		var newY = -3 + elapsedSeconds;
		this.state.activePiecePosition.y=newY;
		this.setState({
			activePiecePosition: this.state.activePiecePosition
		})
		requestAnimationFrame(this.updateGameState);
	}
// 	updateGameState() {
//     //... code
//     var currentState = this.state;
    
//     var elapsed = new Date() - this.state.startTime
    
//     if (this.hardDrop) {
//       //go faster
//     }
//     //check if piece can go down
//     //if not, merge with board, setState
//     // setState ? but not always
    
//     requestAnimationFrame(this.updateGameState);
//   }
  	render() {
    	return (
        	<div>
				<Grid.Grid grid={this.state.grid} activePiece={{activePiece: this.state.activePiece, activePiecePosition: this.state.activePiecePosition}} />
        	</div>
    	);
  	}
}


// class App extends React.Component {
//   constructor(props) {
//     super()
//     this.updateGamestate= this.updateGamestate.bind(this);
//     // do it for the others
    
//     this.state = {
//       board: [
        
//       ],
//       currentPiece: {
        
//       },
//       startTime: new Date()
//     }
//   }
//   componentDidMount() {
//     document.addEventListener('keydown', this.keyDown);
//     document.addEventListener('keyup', this.keyUp);
//     //socket.on('handicap', this.handicap)
//     this.updateGamestate();
//   }
  
  
//   keyDown(e) {
//     if (e.which === UP){rotate()} //up
//     if (e.which === RIGHT) {x+=1}
//     if (e.which === DOWN) {this.hardDrop=true}
//     // use e.which to figure out which key is down
//     // let's say that the user presed the DOWN key
//     // this.downKey = true;
//   }
  
//   keyUp(e) {
//     // use e.which to figure out which key is down
//     // let's say that the user presed the DOWN key
    
//     // this.hardDrop = false;
//   }
  
//   updateGameState() {
//     //... code
//     var currentState = this.state;
    
//     var elapsed = new Date() - this.state.startTime
    
//     if (this.hardDrop) {
//       //go faster
//     }
//     //check if piece can go down
//     //if not, merge with board, setState
//     // setState ? but not always
    
//     requestAnimationFrame(this.updateGameState);
//   }
  
//   render() {
//     return (
//         <div>
//             {/*Application body*/}
//         </div>
//     );
//   }
// }

// App.propTypes = {};
// App.defaultProps = {};

ReactDOM.render(<App />, document.querySelector('#app'));
