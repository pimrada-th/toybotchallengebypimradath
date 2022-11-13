import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {findDOMNode} from 'react-dom';
import './index.css';
import logo from './slimeBot.png';

function Grid(props){
  const botHere = props.botHere;
  return <button className='square' x={props.x} y={props.y}>{botHere ?<Bot x={props.x} y={props.y}/> : ''}</button>;
}

function Bot(props){
  return <img src={logo} className='bot' x={props.x} y={props.y} facing="NORTH"></img>;
}

function ResultBox(){
  return (
    <div className='row'>
      <textarea className='box' rows="5" readOnly={true} id="resultBox"></textarea>   
    </div>
  );
}

function CommandBox(){
  const Command = e => {
    if (e.key === "Enter") {
      const command = e.target.value;
      //check valid commands place(x,y,facing), move(), left(), right(), report()
      const commandsList = ['move()','left()','right()','report()']; //withput place command
      const directionsList = {'NORTH':0,'EAST':90,'SOUTH':180,'WEST':-90}
      const regexPlace = /place\([0-4],[0-4],(NORTH)|(WEST)|(SOUTH)|(EAST)+\)/i;
      const bot = document.getElementsByClassName('bot') ? document.getElementsByClassName('bot')[0]:null;
      const resultBox = document.getElementById('resultBox'); 
      let msg = '';
      if(bot){
        if(commandsList.includes(command)){
          const botRotate = bot.style.transform ? parseInt((bot.style.transform).match(/-*\d/g).join('')) : 0;
          const botXPos = parseInt(bot.getAttribute('x')) ?? 0;
          const botYPos = parseInt(bot.getAttribute('y')) ?? 0;
          const botFacing = bot.getAttribute('facing').toUpperCase() ?? 'NORTH';
          let deg = (-90);
          let degResult = 0;
          let newFacing ='';
          msg = command+'\n';
          switch(command) {
            case "move()":
                //move forward not falling, not change direction 
                //north y+1; south y-1; east x+1; west x-1
                let newY = botYPos;
                let newX = botXPos;
                console.log(botFacing)
                console.log('x '+botXPos+' y '+botYPos)
                if(botFacing === 'NORTH' && botYPos>=0 && botYPos<4){
                  console.log('work1')
                  newY = botYPos+1;
                }
                if(botFacing === 'SOUTH' && botYPos>0 && botYPos<=4){
                  newY = botYPos-1;
                  console.log('work2')
                }
                if(botFacing==='EAST' && botXPos>=0 && botXPos<4){
                  newX = botXPos+1;
                  console.log(newY)
                  console.log('work3')
                }
                if(botFacing==='WEST' && botXPos>0 && botXPos<=4){
                  newX = botXPos-1;
                  console.log('work4')
                }
                if(newX !== botXPos || newY!==botYPos){
                  const exParent = findDOMNode(bot).parentNode.innerHTML = '';
                  const newParent = document.querySelector('[class="square"][x="'+newX+'"][y="'+newY+'"]');
                  bot.setAttribute('x',newX);
                  bot.setAttribute('y',newY);
                  newParent.append(bot);
                  console.log('new x '+newX+' new y '+newY)
                }
              break;
            case "left()":
                degResult = findDirectionDegree(botRotate,deg);
                bot.style.transform = "rotate("+degResult+"deg)";
                //set facing by deg value
                degResult = degResult===(-180) ? degResult = 180 : degResult;
                newFacing = Object.keys(directionsList).find(key => directionsList[key] === degResult);
                bot.setAttribute('facing',newFacing);
                console.log(newFacing)
              break;
            case "right()":
                deg = 90;
                degResult = findDirectionDegree(botRotate,deg);
                bot.style.transform = "rotate("+degResult+"deg)";
                degResult = degResult===(-180) ? degResult = 180 : degResult;
                newFacing = Object.keys(directionsList).find(key => directionsList[key] === degResult);
                bot.setAttribute('facing',newFacing);
                console.log(newFacing)
              break;
            case "report()":
                msg+=botXPos+','+botYPos+','+botFacing+'\n';
                console.log(botXPos+','+botYPos+','+botFacing)
              break;
            default:
          }
        }
        else if(regexPlace.test(command)){
          msg = command+'\n';
          const splitedCommand = command.match(/[0-4]|(NORTH)|(WEST)|(SOUTH)|(EAST)+/gi); //e.g. place(0,0,north) = (3) ['0', '0', 'north']
          const newX = splitedCommand[0] ?? 0; //stand for x
          const newY = splitedCommand[1] ?? 0; //stand for y
          const newFacing = splitedCommand[2] ? splitedCommand[2].toUpperCase() : 'NORTH'; //stand for y
          const exParent = findDOMNode(bot).parentNode.innerHTML = '';
          const newParent = document.querySelector('[class="square"][x="'+newX+'"][y="'+newY+'"]');
          bot.setAttribute('facing',newFacing);
          bot.setAttribute('x',newX);
          bot.setAttribute('y',newY);
          bot.style.transform = "rotate("+directionsList[newFacing]+"deg)";
          newParent.append(bot);
          // place(0,0,north)
        }else{
          msg = 'Invalid command T-T\n';
        }
        resultBox.innerHTML+= msg;
        //set bottom scroll when updated textarea
        resultBox.scrollTop = resultBox.scrollHeight 
      }

      e.target.value = '';  
    }
  };
  return (
    <div className='row'>
      <input className='box'id="commandBox" onKeyUp={Command} autoComplete="new-password"/>
    </div>
  );
}

function findDirectionDegree(botRotate,deg){
  // console.log(botRotate)
  if(botRotate===0){
    return deg;
  }
  else{
    let sumDeg = deg+=botRotate;
    if(sumDeg > 180)
      sumDeg = (-90)
    if(sumDeg<(-180))
      sumDeg = 90;
    return sumDeg;
  }        
}


function Grids(){
  const maxgrid = 5;
  const  x = [0,1,2,3,4];
  const  y = [4,3,2,1,0];
  return (
    <div>
      {y.map(yPos => 
        <div className="row" key={yPos}>
          <div >
            {x.map((xPos) => 
              xPos===0 && yPos===0 ? <Grid x={xPos} y={yPos} key={xPos} botHere={true}/> : <Grid x={xPos} y={yPos} key={xPos} botHere={false}/> //set default at 0,0
            )}
          </div>
        </div>
      )}
      <ResultBox/>
      <CommandBox/>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Grids/>);
