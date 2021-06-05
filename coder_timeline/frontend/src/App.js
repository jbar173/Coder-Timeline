import React from 'react';
import './App.css';
import { BrowserRouter as Router,
          Route,
          Switch,
          Link,
          Redirect } from "react-router-dom";
import MyTimeline from "./pages/timeline.js";
import UserSearch from "./pages/search.js";
import UpdateTimeline from "./pages/update.js";
import CreateEvent from "./pages/create.js";
import { FaLightbulb } from 'react-icons/fa';



class App extends React.Component {
    constructor(props){
    super(props);
    this.state = {
      day: JSON.parse(localStorage.getItem('day'))
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.changeMode= this.changeMode.bind(this)
  };

  componentDidMount(){
    console.log("mounted")
  }

  changeMode(){
    var new_state = !this.state.day
    this.setState({
      day:new_state
    })
    localStorage.setItem('day', JSON.stringify(new_state))
  }

    render(){
      var day = this.state.day
      return (
        <div>
            {day === true ?
              (
                <div>
                    <div id="wrapper" className="container day">
                        <div style={{flex:13}}>
                            <Router>
                              <Switch>
                                <Route exact path = "/" component={MyTimeline} />
                                <Route exact path = "/search/" component={UserSearch} />
                                <Route exact path = "/update/" component={UpdateTimeline} />
                                <Route exact path = "/create/" component={CreateEvent} />
                              </Switch>
                            </Router>
                        </div>
                        <div style={{flex:1, marginTop:"5px",marginBottom:"15px"}}>
                          <button className="icon b-font" type="button" onClick={this.changeMode}>
                              <span><FaLightbulb className="mode-icons"/></span>
                          </button>
                        </div>
                    </div>
                </div>
              )
              :
              (
                <div>
                      <div id="wrapper" className="container night">

                          <div style={{flex:13}}>
                            <Router>
                              <Switch>
                                <Route exact path = "/" component={MyTimeline} />
                                <Route exact path = "/search/" component={UserSearch} />
                                <Route exact path = "/update/" component={UpdateTimeline} />
                                <Route exact path = "/create/" component={CreateEvent} />
                              </Switch>
                            </Router>
                          </div>
                          <div style={{flex:1, marginTop:"5px",marginBottom:"15px"}}>
                            <button className="icon b-font" type="button" onClick={this.changeMode}>
                                <span><FaLightbulb className="mode-icons"/></span>
                            </button>
                          </div>

                      </div>
                 </div>
               )
             }
        </div>
      )
    }

};


export default App;
