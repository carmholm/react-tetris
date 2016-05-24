import React from 'react';
import constants from '../constants.js';

function Row(props) {
    return (
        <div className="row">
            {props.row.map(
                (cell, index) => cell === 0 ? <div className="emptyCell" key={"c"+index}></div> : <div className="fullCell"></div>
            )}
        </div>
    )
}

// Row(object);
// object = {
//     row: aRow,
//     index: index
// }


function Grid(props) {

    var currentX = props.activePiece.activePiecePosition.x / constants.GRID_COLS * 100;
    var currentY = props.activePiece.activePiecePosition.y / constants.GRID_ROWS * 100;


    return (
        <div className="container">
            <div className="grid">
            {
                props.grid.map(
                    (row, index) => <Row row={row} key={"r"+index}/>
                )
            }
            </div>
            <div className="currentPiece"  style={{position: "absolute", top: currentY + "%", left: currentX + "%"}}>
                {   
                    props.activePiece.activePiece.map(
                        (row, index) => <Row row={row} key={"pr"+index} />
                    )
                }
            </div>
        </div>
    )
}

//get initial grid of 0s for any given height/width
function GetInitialGrid(rows, cols){
    var grid = [];
    for (var row=0; row<rows; row++){
        grid[row]=[];
        for (var col=0; col<cols; col++){
            grid[row][col] = 0;
        }
    }
    return grid;
}

module.exports={
    GetInitialGrid: GetInitialGrid,
    Grid: Grid
}