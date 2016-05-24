import React from 'react';
import ReactDOM from 'react-dom';
import constants from './constants.js';
import Grid from './components/grid.jsx';


function canMoveRight(currGrid, currTet, currTetX){    
    var tetLength = currTet.length;
	var tetXMax = currTetX + tetLength;
	var colOfZeros = true;
	//if right-most edge of tetrimino array is less than grid
	//piece can move right
	if (tetXMax < constants.GRID_COLS) {
		return true;
	} else if (currTetX < constants.GRID_COLS) {
		// when tetrimino 2D array hits edge 
		//check if right-most column is full of zeros
		//if yes, tetrimino can move right one more col
		currTet.forEach(function(row){
			//if column is not full or zeros
			//tetrimino has reached edge and cannot move further right
			if (row[constants.GRID_COLS-currTetX-1] != 0){
				colOfZeros = false;
			}
		})
		return colOfZeros;
	} else {
		return false;
	}    
}

function canMoveLeft(currGrid, currTet, currTetX){    
    var tetLength = currTet.length;
	var tetXMax = currTetX + tetLength;
	var colOfZeros = true;
	//if left-most edge of tetrimino array hasnt reached left-edge of grid
	//piece can move left
	if (currTetX > 0) {
		return true;
	} else if (tetXMax > 0) {
		//when tetrimino 2D array hits left edge 
		//check if left-most column is full of zeros
		//if yes, tetrimino can move left one more col
		currTet.forEach(function(row){
			//if column is not full or zeros
			//tetrimino has reached edge and cannot move further right
			if (row[0-currTetX] != 0){
				colOfZeros = false;
			}
		})
		return colOfZeros;
	} else {
		return false;
	}    
}

function canMoveDown(currGrid, currTet, currTetY){
	var tetLength = currTet.length;
	var tetYMax = currTetY + tetLength;
	var rowOfZeros = true;
	if (currTetY > constants.GRID_ROWS){
		return false;
	} else if (currTetY > constants.GRID_ROWS - tetLength){
		currTet[Math.floor(constants.GRID_ROWS-currTetY)].forEach(function(cell){
			if (cell != 0) {
				rowOfZeros = false;
			}
		});
		return rowOfZeros;
	} else {
		return true;
	}	
}

function canRotate(currGrid, currTet, currTetX){
	var tetXMax = currTetX + currTet.length;
	var rotatedTet = rotateRight(currTet);
	var colOfZeros = true;
	//check if whole tetrimino array is inside grid bounds
	//if yes can rotate
	if (tetXMax <= constants.GRID_COLS && currTetX >= 0) {
		return true;
	} else if (currTetX < constants.GRID_COLS) {
		rotatedTet.forEach(function(row){
		//check column outside bounds
		//if it is not full of zeros, rotation is illegal
			if (row[constants.GRID_COLS-currTetX] != 0){
				colOfZeros = false;
			}
		})
		return colOfZeros;
	} 
}


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

function shuffleBag() {
	var array = ['I', 'J', 'Z', 'S', 'O', 'L', 'T'];	
	var arrLength = array.length;

    while (arrLength > 0) {
        var index = Math.floor(Math.random() * arrLength);
        arrLength--;
        var temp = array[arrLength];
        array[arrLength] = array[index];
        array[index] = temp;
    }
    return array;
}


function getGamePieces(){
    var array = [];
    var i=0;
    while (i<150){
       array.push(shuffleBag()) 
       i++;
}
    var gamePieces = [].concat.apply([], array);
    return gamePieces;
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.state={
			grid: Grid.GetInitialGrid(constants.GRID_ROWS, constants.GRID_COLS),
			yTimer: new Date(),
			gameBag : this.props.gameBag,
			activePiece: constants.SHAPES[this.props.gameBag[0]],
			activePiecePosition: {
				x: constants.X_START,
				y: constants.Y_START
			},
			pieceStartTime: new Date()
		}
	this.updateGameState=this.updateGameState.bind(this);
	this.handleKeydown=this.handleKeydown.bind(this);
	//this.handleKeyup=this.handleKeyup.bind(this);
	}
	componentDidMount(){
		document.addEventListener('keydown', this.handleKeydown);
		//document.addEventListener('keyup', this.handleKeyup);
		this.updateGameState();
	}
	componentWillUnmount(){
		document.removeEventListener('keydown', this.handleKeydown);
		document.removeEventListener('keyup', this.handleKeyup);		
	}
	//mergeBoard(){
		//get next piece
		//
		//
	//}
	//right 39
	//left 37
	//up 38
	//down 40
	handleKeydown(e){
		switch(e.which){
			case 39:
				if (canMoveRight(this.state.grid, this.state.activePiece, this.state.activePiecePosition.x)){
					var x = this.state.activePiecePosition.x;
					var newX = x + 1;
					this.state.activePiecePosition.x=newX;
					this.setState({activePIecePosition: this.state.activePiecePosition});
				}
				return;
			case 37:
				if (canMoveLeft(this.state.grid, this.state.activePiece, this.state.activePiecePosition.x)){
					var x = this.state.activePiecePosition.x;
					var newX = x - 1;
					this.state.activePiecePosition.x=newX;
					this.setState({activePIecePosition: this.state.activePiecePosition});
				}
				return;
			case 38:
				if (canRotate(this.state.grid, this.state.activePiece, this.state.activePiecePosition.x)){
					this.setState({activePiece: rotateRight(this.state.activePiece)});
				}
				return;
			case 40:
				this.hardDrop = true;
				return;
		}
	}

	updateGameState(){
		var currentState=this.state;
		var y = currentState.activePiecePosition.y;
		var elapsedSeconds = (new Date() - this.state.pieceStartTime)/1000;

		if(canMoveDown(this.state.grid, this.state.activePiece, this.state.activePiecePosition.y)){
			var newY = constants.Y_START + elapsedSeconds;
			this.state.activePiecePosition.y=newY;
			this.setState({
			activePiecePosition: this.state.activePiecePosition,
			yTimer: new Date()
			})				
		}
		requestAnimationFrame(this.updateGameState);
	}
	
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

ReactDOM.render(<App gameBag={getGamePieces()}/>, document.querySelector('#app'));
