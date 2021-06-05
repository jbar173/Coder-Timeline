import React from 'react';
import '../App.css';
import { FaAngleUp, FaAngleDown, FaAngleRight, FaAngleLeft,
  FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa';


// ARROW ANIMATION COMPONENTS


// Search.js and Timeline.js scroll arrows:

class ArrowsDown extends React.Component {
    render() {
        return (
            <div>
                <p><FaAngleDoubleDown className="double arrow1"/></p>
                <p><FaAngleDoubleDown className="double arrow2"/></p>
                <p><FaAngleDoubleDown className="double arrow3"/></p>
                <p><FaAngleDoubleDown className="double arrow4"/></p>
                <p><FaAngleDoubleDown className="double arrow5"/></p>
                <p><FaAngleDoubleDown className="double arrow6"/></p>
            </div>
        );
    }
}

class ArrowsUp extends React.Component {
    render() {
        return (
            <div>
                <p><FaAngleDoubleUp className="double arrow7"/></p>
                <p><FaAngleDoubleUp className="double arrow6"/></p>
                <p><FaAngleDoubleUp className="double arrow5"/></p>
                <p><FaAngleDoubleUp className="double arrow4"/></p>
                <p><FaAngleDoubleUp className="double arrow3"/></p>
                <p><FaAngleDoubleUp className="double arrow2"/></p>
            </div>
        );
    }
}


// Search.js page arrow grid:

class SingleArrowUp extends React.Component{
        render(){
          return(
            <div className="spinner">
              <table>
                <tr>
                  <td><FaAngleUp className="spin single"/></td>
                </tr>
              </table>
            </div>
           );
         }
    }

class SingleArrowDown extends React.Component{
  constructor(props){
    super(props);
  };
  render(){
      return(
          <div className="spinner">
            <table>
              <tr>
                <td><FaAngleDown className="spin single"/></td>
              </tr>
            </table>
          </div>
        );
    }
  }

class ArrowsGrid extends React.Component{
  constructor(props){
    super(props);
    this.setNewAngle = this.setNewAngle.bind(this)
  };

  setNewAngle(id){
    var x = id
    var y = Math.floor(Math.random() * 360);
    console.log("y: " + y)
    var z = document.querySelector(`#${x}`);
    z.style.transform = `rotate(${y}deg)`;
    z.style.transition = 'transform 2s ease';
  }

  render(){
    var self = this

    return(
      <div className="centre search-page-arrows">
         <div id="wrapper" style={{flexFlow:"row wrap"}}>
             <span id="OneUp" onMouseOver={() => self.setNewAngle("OneUp")} >< SingleArrowUp /></span>
             <span id="OneDown" onMouseOver={() => self.setNewAngle("OneDown")}>< SingleArrowDown /></span>
             <span id="TwoUp" onMouseOver={() => self.setNewAngle("TwoUp")} >< SingleArrowUp /></span>
             <span id="TwoDown" onMouseOver={() => self.setNewAngle("TwoDown")}>< SingleArrowDown /></span>
             <span id="ThreeUp" onMouseOver={() => self.setNewAngle("ThreeUp")} >< SingleArrowUp /></span>
             <span id="ThreeDown" onMouseOver={() => self.setNewAngle("ThreeDown")}>< SingleArrowDown /></span>
             <span id="FourUp" onMouseOver={() => self.setNewAngle("FourUp")} >< SingleArrowUp /></span>
             <span id="FourDown" onMouseOver={() => self.setNewAngle("FourDown")}>< SingleArrowDown /></span>
             <span id="FiveUp" onMouseOver={() => self.setNewAngle("FiveUp")} >< SingleArrowUp /></span>
             <span id="FiveDown" onMouseOver={() => self.setNewAngle("FiveDown")}>< SingleArrowDown /></span>
             <span id="SixUp" onMouseOver={() => self.setNewAngle("SixUp")} >< SingleArrowUp /></span>
             <span id="SixDown" onMouseOver={() => self.setNewAngle("SixDown")}>< SingleArrowDown /></span>

             <span id="SevenUp" onMouseOver={() => self.setNewAngle("SevenUp")} >< SingleArrowUp /></span>
             <span id="SevenDown" onMouseOver={() => self.setNewAngle("SevenDown")}>< SingleArrowDown /></span>
             <span id="EightUp" onMouseOver={() => self.setNewAngle("EightUp")} >< SingleArrowUp /></span>
             <span id="EightDown" onMouseOver={() => self.setNewAngle("EightDown")}>< SingleArrowDown /></span>
             <span id="NineUp" onMouseOver={() => self.setNewAngle("NineUp")} >< SingleArrowUp /></span>
             <span id="NineDown" onMouseOver={() => self.setNewAngle("NineDown")}>< SingleArrowDown /></span>
             <span id="TenUp" onMouseOver={() => self.setNewAngle("TenUp")} >< SingleArrowUp /></span>
             <span id="TenDown" onMouseOver={() => self.setNewAngle("TenDown")}>< SingleArrowDown /></span>
             <span id="ElevenUp" onMouseOver={() => self.setNewAngle("ElevenUp")} >< SingleArrowUp /></span>
             <span id="ElevenDown" onMouseOver={() => self.setNewAngle("ElevenDown")}>< SingleArrowDown /></span>
             <span id="TwelveUp" onMouseOver={() => self.setNewAngle("TwelveUp")} >< SingleArrowUp /></span>
             <span id="TwelveDown" onMouseOver={() => self.setNewAngle("TwelveDown")}>< SingleArrowDown /></span>

             <span id="ThirteenUp" onMouseOver={() => self.setNewAngle("ThirteenUp")} >< SingleArrowUp /></span>
             <span id="ThirteenDown" onMouseOver={() => self.setNewAngle("ThirteenDown")}>< SingleArrowDown /></span>
             <span id="FourteenUp" onMouseOver={() => self.setNewAngle("FourteenUp")} >< SingleArrowUp /></span>
             <span id="FourteenDown" onMouseOver={() => self.setNewAngle("FourteenDown")}>< SingleArrowDown /></span>
             <span id="FifteenUp" onMouseOver={() => self.setNewAngle("FifteenUp")} >< SingleArrowUp /></span>
             <span id="FifteenDown" onMouseOver={() => self.setNewAngle("FifteenDown")}>< SingleArrowDown /></span>
             <span id="SixteenUp" onMouseOver={() => self.setNewAngle("SixteenUp")} >< SingleArrowUp /></span>
             <span id="SixteenDown" onMouseOver={() => self.setNewAngle("SixteenDown")}>< SingleArrowDown /></span>
             <span id="SeventeenUp" onMouseOver={() => self.setNewAngle("SeventeenUp")} >< SingleArrowUp /></span>
             <span id="SeventeenDown" onMouseOver={() => self.setNewAngle("SeventeenDown")}>< SingleArrowDown /></span>
             <span id="EighteenUp" onMouseOver={() => self.setNewAngle("EighteenUp")} >< SingleArrowUp /></span>
             <span id="EighteenDown" onMouseOver={() => self.setNewAngle("EighteenDown")}>< SingleArrowDown /></span>

             <span id="NineteenUp" onMouseOver={() => self.setNewAngle("NineteenUp")} >< SingleArrowUp /></span>
             <span id="NineteenDown" onMouseOver={() => self.setNewAngle("NineteenDown")}>< SingleArrowDown /></span>
             <span id="TwentyUp" onMouseOver={() => self.setNewAngle("TwentyUp")} >< SingleArrowUp /></span>
             <span id="TwentyDown" onMouseOver={() => self.setNewAngle("TwentyDown")}>< SingleArrowDown /></span>
             <span id="TwentyoneUp" onMouseOver={() => self.setNewAngle("TwentyoneUp")} >< SingleArrowUp /></span>
             <span id="TwentyoneDown" onMouseOver={() => self.setNewAngle("TwentyoneDown")}>< SingleArrowDown /></span>
             <span id="TwentytwoUp" onMouseOver={() => self.setNewAngle("TwentytwoUp")} >< SingleArrowUp /></span>
             <span id="TwentytwoDown" onMouseOver={() => self.setNewAngle("TwentytwoDown")}>< SingleArrowDown /></span>
             <span id="TwentythreeUp" onMouseOver={() => self.setNewAngle("TwentythreeUp")} >< SingleArrowUp /></span>
             <span id="TwentythreeDown" onMouseOver={() => self.setNewAngle("TwentythreeDown")}>< SingleArrowDown /></span>
             <span id="TwentyfourUp" onMouseOver={() => self.setNewAngle("TwentyfourUp")} >< SingleArrowUp /></span>
             <span id="TwentyfourDown" onMouseOver={() => self.setNewAngle("TwentyfourDown")}>< SingleArrowDown /></span>

             <span id="TwentyfiveUp" onMouseOver={() => self.setNewAngle("TwentyfiveUp")} >< SingleArrowUp /></span>
             <span id="TwentyfiveDown" onMouseOver={() => self.setNewAngle("TwentyfiveDown")}>< SingleArrowDown /></span>
             <span id="TwentysixUp" onMouseOver={() => self.setNewAngle("TwentysixUp")} >< SingleArrowUp /></span>
             <span id="TwentysixDown" onMouseOver={() => self.setNewAngle("TwentysixDown")}>< SingleArrowDown /></span>
             <span id="TwentysevenUp" onMouseOver={() => self.setNewAngle("TwentysevenUp")} >< SingleArrowUp /></span>
             <span id="TwentysevenDown" onMouseOver={() => self.setNewAngle("TwentysevenDown")}>< SingleArrowDown /></span>
             <span id="TwentyeightUp" onMouseOver={() => self.setNewAngle("TwentyeightUp")} >< SingleArrowUp /></span>
             <span id="TwentyeightDown" onMouseOver={() => self.setNewAngle("TwentyeightDown")}>< SingleArrowDown /></span>
             <span id="TwentynineUp" onMouseOver={() => self.setNewAngle("TwentynineUp")} >< SingleArrowUp /></span>
             <span id="TwentynineDown" onMouseOver={() => self.setNewAngle("TwentynineDown")}>< SingleArrowDown /></span>
             <span id="ThirtyUp" onMouseOver={() => self.setNewAngle("ThirtyUp")} >< SingleArrowUp /></span>
             <span id="ThirtyDown" onMouseOver={() => self.setNewAngle("ThirtyDown")}>< SingleArrowDown /></span>
         </div>
      </div>
    )
  }
}


export {ArrowsUp,ArrowsDown,ArrowsGrid};
