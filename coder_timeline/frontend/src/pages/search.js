import React, { useState, useEffect } from 'react';
import '../App.css';
import { ArrowsGrid, ArrowsUp, ArrowsDown } from './arrows.js';
import { BrowserRouter as Router,
          Link,
          Redirect } from "react-router-dom";
import Moment from 'react-moment';
import moment from 'moment';



class UserSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rect1 : 0,
      direction: "start",
      updated:false,
      tried:false,
      full:false,
      expanded: -1,
      details:false,
      switch_2:false,
      clear:false,
      username: '',
      user_data: [],
      commit_urls: [],
      all_repo_commits: [],
      sorted_commits: []
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.navBarTopRef = React.createRef()
    this.listenScrollEvent = this.listenScrollEvent.bind(this)
    this.handleExpand = this.handleExpand.bind(this)

    this.getCookie = this.getCookie.bind(this)
    this.fetchAccount = this.fetchAccount.bind(this)
    this.fetchCommits = this.fetchCommits.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.searchUser = this.searchUser.bind(this)
    this.clearPage = this.clearPage.bind(this)

    this.handleExpand = this.handleExpand.bind(this)
    this.map_commits = this.map_commits.bind(this)
    this.which_repo = this.which_repo.bind(this)
    this.see_details = this.see_details.bind(this)
  };



componentDidMount(){
  console.log("mounted - main")
  window.addEventListener('scroll',this.listenScrollEvent);
}

componentWillUnmount(){
  window.removeEventListener('scroll',this.listenScrollEvent);
}


componentDidUpdate(){
  console.log("did update - main")
  if(this.state.updated === true && this.state.switch_2 === false){
    this.fetchCommits()
    console.log("updated:true, switch_2:false")
    this.setState({
      updated:false,
      tried:true
    })
  }else if(this.state.updated === false && this.state.switch_2 === true){
    console.log("updated:false, switch_2:true")
    var my_commits = this.state.all_repo_commits
    var l = this.state.all_repo_commits.length
    var sorted_commits = this.map_commits(my_commits,l)
    this.setState({
      switch_2:false
    })
  }else if(this.state.clear === true){
    console.log("clear:true")
    this.setState({
      clear:false
    })
  }else{
    console.log("updated:false, switch_2:false")
  }
}


listenScrollEvent(e) {
  var r = this.navBarTopRef.current.getBoundingClientRect()
  var rect = r.top
  console.log("this.state.rect1: " + this.state.rect1)
  var prev = this.state.rect1

  this.setState({
    rect1:rect
  })
  console.log("rect.top: " + rect)
  console.log("window.innerHeight: " + window.innerHeight)
  if(prev < rect){
    var message = "scrolling up"
  }else if (prev > rect){
    var message = "scrolling down"
  }else{
    var message = "no change"
  }
  this.setState({
    direction:message
  })
  console.log(message)
}


getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


fetchAccount(){
  console.log("Fetching account..")
  var user = this.state.username
  fetch(`https://api.github.com/users/${user}/repos?sort=created&direction=asc`)
    .then(response => response.json())
    .then(data =>
      this.setState({
        user_data:data,
        updated:true,
        full:true
      })
    ).catch(function(error){
        console.log("ERROR:", error);
    })
}


fetchCommits(){
  console.log("Fetching commits..")
  var x = this.state.user_data.length
  var url_list = []
  var i
  for(i=0;i<x;i++){
    var y = this.state.user_data[i].commits_url
    url_list.push(y)
  }
  this.setState({
    commit_urls:url_list
  })
    var all_commits = []
    for(i=0;i<x;i++){
      var z = url_list[i]
      var a = z.slice(0,-6)
      var url = `${a}`
    fetch(url)
    .then(response => response.json())
    .then(data =>
      all_commits.push(data)
    )
  }
  this.setState({
    all_repo_commits:all_commits,
    switch_2:true
  })
}

handleChange(e){
  var value = e.target.value
  this.setState({
    ...this.state.username,
      username:value
  })
  console.log("username: " + this.state.username)
}


searchUser(e){
  this.fetchAccount();
}


clearPage(){
  console.log("clear")
  this.setState({
    clear:true,
    username: '',
    user_data: [],
    commit_urls: [],
    all_repo_commits: [],
    sorted_commits: []
  })
}


handleExpand(e){
  e.stopPropagation()
  var x = this.state.expanded_3
  var value = e.target.value
  var id = e.target.name
  if(x === -1){
    console.log("expand from -1")
    console.log("this id: " + id)
    this.setState({
      expanded:id,
      switch_2:true
    })
  }else if(value==='collapse'){
    console.log("collapse")
    this.setState({
      expanded: -1
    })
  }else{
    console.log("expand from other index")
    this.setState({
      expanded:id,
      switch_2:true
    })
  }
}


map_commits(d,l){
  var i
  var h = l
  var list = []

  for(i=0;i<h;i++){
    var k
    var q = d[i]
    var j = q.length

    for(k=0;k<j;k++){
        var n = d[i][k]['html_url']
        var m = d[i][k]['commit']['message']
        var p = d[i][k]['commit']['author']['date']
        list.push([n,m,p])
    }
  }
  this.setState({
    sorted_commits:list
  })
  return list
}


which_repo(commit,repo){
  var html = commit[0]
  var repo_name = repo.name
  var str_html = html.toString()
  if(str_html.includes("/" + repo_name + "/")){
    return true;
  }else{
    return false;
  }
}


see_details(){
  console.log("this.state.details: " + this.state.details)
  var x = !this.state.details
  console.log("Changing to: " + x)
  this.setState({
    details:x
  })
}



  render(){
    console.log("rendered - main")
    var repos = this.state.user_data
    var tried = this.state.tried
    var full = this.state.full
    var defined = true
    if(this.state.user_data.length === 0){
      defined = false
    }
    var user = this.state.username
    var self = this
    var expanded = this.state.expanded
    var details = this.state.details
    var sorted_commits = this.state.sorted_commits
    var expand = "expand"
    var collapse = "collapse"

    return(
      <div>
        {tried === true && full === true && this.state.user_data.length === undefined || tried === false && full === true && this.state.user_data.length === undefined ?
          (
            <div className="error-outer e">
              <div className="error">
                  <h3 style={{marginLeft:"30px"}}>Sorry, that username could not be found! Click "try again" below to search for another user.</h3>
                  <br></br>
                  <button onScroll={this.listenScrollEvent} ref={this.navBarTopRef} className="b-font" type="button" onClick={this.clearPage}>
                    <Link className="link-style" to={{pathname:"/search/",state: { username:'' } }}>Try again</Link>
                  </button>
                  <br></br>
                  <button className="b-font" type="button"><Link className="link-style"
                   to={{pathname:"/"}}>Back to my profile</Link></button>
              </div>
            </div>
          )
          :
          (
            <div className="container">
                   <div>
                         <div className="Navigation-bar">
                             <div className="Nav-bar-left">
                               <div id="wrapper" className="lookup" style={{minWidth:"100px"}}>
                                  <div>
                                    <h2 className="brand" >Github Timeline Lookup</h2>
                                  </div>
                                  <div id="wrapper">
                                    <h2 className="brand dot1">.</h2><h2 className="brand dot2">.</h2><h2 className="brand dot3">.</h2>
                                  </div>
                               </div>
                             </div>
                             <div className="Nav-bar-right" onScroll={this.listenScrollEvent} ref={this.navBarTopRef}>
                                 <input type="TextField" onChange={this.handleChange} style={{width:"190px",cursor:"text"}}
                                  value={user} className="form-control search-bar b-font" placeholder="Type a Github username"/>
                                 <button className="b-font" onClick={this.searchUser} type="button">Search</button>
                                 <button className="b-font" type="button" onClick={this.clearPage}>
                                    <Link className="link-style" to={{pathname:"/search/",
                                      state: { username:'' } }}>Clear results</Link>
                                  </button>
                                 <button className="b-font" type="button">
                                    <Link className="link-style" to={{pathname:"/"}}>Go back to my profile</Link>
                                 </button>
                             </div>
                         </div>
                         {defined ?
                           (
                             <div className="centre">
                                 <div className="outer-bubble" id="wrapper">
                                        <div>
                                            <div>
                                                <h2 className="body" >Repo timeline for: <h2 className="body flash2"
                                                style={{color:"forestgreen"}}>{user}</h2></h2>
                                            </div>
                                            <div className="user" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                                                <h2 className="body user"><h2 className="link-style" style={{cursor:"pointer"}}>Start</h2></h2>
                                            </div>
                                            {this.state.direction === "scrolling up" ?
                                                  (
                                                    <div className="arrows">
                                                        <ArrowsUp />
                                                    </div>
                                                  )
                                                  :
                                                  (
                                                    <div className="arrows">
                                                        <ArrowsDown />
                                                    </div>
                                                  )
                                              }
                                            <div className="end" onClick={() => window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'})}>
                                                <i className="fa fa-angle-up end" />
                                                <h2><h2 style={{paddingTop:"40px",cursor:"pointer"}} className="body flash2-delay link-style">End</h2></h2>
                                            </div>
                                        </div>
                                        <div>
                                           {repos.map(function(repo,index){
                                             return(
                                               <div key={index} className="green-bubble">
                                                   <div>
                                                     <h3>{repo.name}</h3>
                                                     <p>Description: {repo.description}</p>
                                                     <p>Created: <Moment className="bold" format="LLL">{repo.created_at}</Moment></p>
                                                   </div>
                                                   <div className="see">
                                                       {expanded === -1 ?

                                                            (
                                                              <div>
                                                                <button className="b-font" type="button" onClick={self.handleExpand}
                                                                value={expand} name={repo.id} >See commits</button>
                                                              </div>
                                                            )

                                                            :

                                                            (
                                                              <div>

                                                                  {expanded == repo.id ?

                                                                        (
                                                                          <div>
                                                                             {details === true?

                                                                                (
                                                                                  <div>
                                                                                  <p>Commits:</p>
                                                                                       <div className="visible">
                                                                                          <div className="commit-grid" style={{width:"100px"}}>
                                                                                                   {sorted_commits.filter(commit_data => self.which_repo(commit_data,repo)).reverse().map(function(commit_data,num){
                                                                                                        return(
                                                                                                             <div className="commit-border clearfix">
                                                                                                                <div className="inner">
                                                                                                                     <h4>{num +1}. '{commit_data[1]}'</h4>
                                                                                                                     <h5>Commit message: {commit_data[1]}</h5>
                                                                                                                     <h5>Committed: <Moment className="small-bold" format="LLL">{commit_data[2]}</Moment></h5>
                                                                                                                     <h5><Link className="link-style-green" to={{ pathname: `${commit_data[0]}` }} target="_blank" >Go to commit on Github.com</Link></h5>
                                                                                                                </div>
                                                                                                             </div>
                                                                                                        )
                                                                                                    })}
                                                                                            </div>
                                                                                         </div>
                                                                                         <div>
                                                                                             <button className="b-font" type="button" onClick={() => self.see_details()}>Hide details</button>
                                                                                         </div>
                                                                                     </div>
                                                                                )

                                                                                :

                                                                                (
                                                                                      <div>
                                                                                           <p>Commits:</p>
                                                                                           <div className="collapsed">
                                                                                              <div id="wrapper">
                                                                                                <div className="inner-column" style={{width:"300px"}}>
                                                                                                   {sorted_commits.filter(commit_data => self.which_repo(commit_data,repo)).reverse().map(function(commit_data,num){
                                                                                                        return(
                                                                                                             <div>
                                                                                                               <h4>{num +1}. '{commit_data[1]}'</h4>
                                                                                                             </div>
                                                                                                           )
                                                                                                    })}
                                                                                                </div>
                                                                                              </div>
                                                                                           </div>
                                                                                           <div>
                                                                                               <button className="b-font" type="button" onClick={() => self.see_details()}>See details</button>
                                                                                           </div>
                                                                                       </div>
                                                                                 )
                                                                             }
                                                                               <div>
                                                                                 <button className="b-font" type="button" onClick={self.handleExpand}
                                                                                 value={collapse} name={repo.id} >Hide commits</button>
                                                                               </div>
                                                                          </div>
                                                                         )
                                                                         :
                                                                         (
                                                                           <div>
                                                                             <button className="b-font" type="button" onClick={self.handleExpand}
                                                                             value={expand} name={repo.id} >See commits</button>
                                                                           </div>
                                                                         )

                                                                   }

                                                               </div>
                                                           )
                                                         }

                                                     </div>
                                                 </div>
                                               )})
                                             }
                                          </div>
                                   </div>
                              </div>
                             )
                             :
                             (
                               <div className="container" style={{paddingBottom:"36px",paddingTop:"28px"}} >
                                  <ArrowsGrid/>
                               </div>
                             )
                          }
                       </div>
                 </div>
             )

          }
      </div>
    )
  }
}


export default UserSearch;
