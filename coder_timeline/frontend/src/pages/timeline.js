import React, { useState } from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link,
          Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import Moment from 'react-moment';
import moment from 'moment';
import { ArrowsDown, ArrowsUp } from './arrows.js';



class MyTimeline extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rect1 : 0,
      direction: "start",
      user:{
        "id": null,
        "is_superuser": false,
        "is_staff": false,
        "is_active": false,
        "user_permissions": []
      },
      thisUser:{
        "id": null,
        "is_superuser": false,
        "is_staff": false,
        "is_active": false,
        "user_permissions": []
      },
      username: 'jbar173',
      activeAccount: {
        'id': 2,
        'username': 'jbar173'
      },

      stop:false,
      fetched:false,
      test: false,

      drf: false,
      p_fetched: false,
      c_fetched: false,

      finished_1:false,
      finished_2:false,
      finished: false,
      dates_done:false,
      commits_count:0,

      expanded:-1,
      details:false,

      finalTimeline: [],
      commit_urls: [],
      all_repo_commits: [],
      sorted_commits: [],
      projectList: [],
      projectSectionList: [],

    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.navBarTopRef = React.createRef()
    this.listenScrollEvent = this.listenScrollEvent.bind(this)
    this.handleExpand = this.handleExpand.bind(this)

    this.getCookie = this.getCookie.bind(this)
    this.fetchUser = this.fetchUser.bind(this)
    this.fetchUserList = this.fetchUserList.bind(this)
    this.fetchAccount = this.fetchAccount.bind(this)
    this.fetchCommits = this.fetchCommits.bind(this)
    this.fetchProjectSections = this.fetchProjectSections.bind(this)

    this.sort_dates = this.sort_dates.bind(this)
    this.sortByDateFunction = this.sortByDateFunction.bind(this)

    this.map_commits = this.map_commits.bind(this)
    this.which_repo = this.which_repo.bind(this)
    this.which_project = this.which_project.bind(this)

  };


componentDidMount(){
    console.log("mounted")
    window.addEventListener('scroll',this.listenScrollEvent);
    this.fetchUserList()
    this.fetchAccount()
  }


componentWillUnmount() {
    window.removeEventListener('scroll',this.listenScrollEvent);
}


componentDidUpdate(){
    console.log("did update")

    if(this.state.fetched === false && this.state.test === false){
        console.log("updated 1")
        this.setState({
          test:true,
        })
    }else if(this.state.fetched === false && this.state.test === true){
        console.log("updated 2")
        this.setState({
          test:true,
          fetched:true
        })
        console.log("updated 2: this.state.finalTimeline.length: " + this.state.finalTimeline.length)
    }else if(this.state.finalTimeline.length === 2 && this.state.fetched === true && this.state.c_fetched === false){
        console.log("updated 3")
        var u
        var us = this.state.user
        var current_id = us['current_id']
        console.log("current_id: " + current_id)
        this.fetchUser()

        this.fetchCommits()
        this.setState({
          c_fetched:true,
          finished_1:true
        })
        console.log("finished_1 now = true")
        if(this.state.finished_2 === true){
          console.log("updated 3.1-both finished")
          this.setState({
            finished:true,
            fetched:false
          })
        }
    }else if(this.state.finalTimeline.length === 2 && this.state.fetched === true && this.state.drf === false){
        console.log("updated 4")
        this.fetchProjectSections()
        this.setState({
          drf:true,
          finished_2:true
        })
        console.log("finished_2 now = true")
        if(this.state.finished_1 === true){
          console.log("updated 4.1-both finished")
          this.setState({
            finished:true,
            fetched:false
          })
        }
    }else if(this.state.finished === true && this.state.all_repo_commits.length > this.state.commits_count) {
        console.log("updated 5")
        console.log("sorting commits")
        var my_commits = this.state.all_repo_commits
        var l = my_commits.length
        var sorted_commits = this.map_commits(this.state.all_repo_commits,l)
        var count = this.state.commits_count
        count += 1
        this.setState({
          sorted_commits:sorted_commits,
          commits_count:count
        })
    }else{
        console.log("updated-else")
        console.log("**this.state.rect1: " + this.state.rect1)
      }
}



  fetchUserList(){
    console.log("Fetching user list")
    var url = `http://127.0.0.1:8000/api/user-list/`
    fetch(url)
    .then(response => response.json())
    .then(data =>
      this.setState({
        user:data
      })
    )
  }


  fetchUser(){
   console.log("Fetching user detail")
   var current_id = this.state.user.current_id

   if(current_id == null){
       console.log("user not authenticated")
   }else{
       var url = `http://127.0.0.1:8000/api/user-detail/${current_id}`
       fetch(url)
       .then(response => response.json())
       .then(data =>
          this.setState({
            thisUser:data
          })
        )
    }
  }


  fetchAccount(){
      console.log("Fetching account..")
      var user = this.state.username
      var acc_id = this.state.activeAccount.id
      var urls = [
        `https://api.github.com/users/${user}/repos?sort=created&direction=asc/`,
        `http://127.0.0.1:8000/api/p-list/${acc_id}/`
      ]
      return Promise.all(
        urls.map(url =>
          fetch(url)
          .then(response => response.json())
          .then(data => {
            this.setState({
              finalTimeline:[
                data,
                ...this.state.finalTimeline
              ]
            })
          })
        )
      )
    }


  map_commits(d,l){
    console.log("mapping commits")
    var i
    var h = l
    var list = []
    var date_order_list = []

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


  fetchProjectSections(){
    console.log("Fetching project sections...")
    var pr = this.state.finalTimeline
    var projects = pr.flat()
    var length = projects.length
    var i
    var p_ps_list = []

    for(i=0;i<length;i++){
      var proj = projects[i]
      var proj_id = proj.id
      if(!proj.commits_url){
        var url = `http://127.0.0.1:8000/api/ps-list/${proj_id}`
        fetch(url)
        .then(response => response.json())
        .then(data =>
          p_ps_list.push(data)
        )
        }
      else{
        console.log("Is Github repo")
      }
      }
    this.setState({
      projectSectionList:p_ps_list
    })
  }


  fetchCommits(){
    var x = this.state.finalTimeline
    var flat = x.flat()
    var length = flat.length
    var url_list = []
    var test = flat[0]
    var i
    for(i=0;i<length;i++){
      var repo = flat[i]
      if(!repo.commits_url){
        console.log("Is Project")
      }else{
        var y = repo.commits_url
        url_list.push(y)
      }
    }
    var l = url_list.length
    this.setState({
      commit_urls:url_list
    })
    console.log("Fetching commits..")
    var all_commits = []
    for(i=0;i<l;i++){
      var z = url_list[i]
      var a = z.slice(0,-6)
      var url = `${a}`
      fetch(url)
      .then(response => response.json())
      .then(data =>
        this.setState({
          all_repo_commits:[
            data,
            ...this.state.all_repo_commits
          ],
          updated:false
        })
      )
    }
  }


  which_repo(commit,repo){
    console.log("which repo?")
    var html = commit[0]
    var repo_name = repo.name
    var str_html = html.toString()
    if(str_html.includes("/" + repo_name + "/")){
      return true;
    }else{
      return false;
    }
  }


  which_project(section,project){
    if(this.state.expanded !== -1){
      console.log("which project?")
      var s = section.project
      var p = project.id
      if(s === p){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }


  sortByDateFunction(a,b){
    if (a.created_at < b.created_at) {
        return 1;
    }
    if (a.created_at > b.created_at) {
        return -1;
    }
    return 0;
  }


  sort_dates(list){
    var mylist = list.flat()
    var final_list = []
    var length = mylist.length
    var i
    for(i=0;i<length;i++){
        var s = mylist[i].created_at
        var t = moment(s)
        var u = t.format('YYYY-MM-DD')
        mylist[i]['created_at'] = u;
        final_list.push(mylist[i])
        mylist.splice(i,1)
        i -= 1
        length -= 1
      }
    var sorted = []
    if(this.state.finalTimeline.length === 2){
      var sorted = final_list.sort(this.sortByDateFunction);
    }
    console.log("returning timeline")
    return sorted;
  }


  handleExpand(e){
    e.stopPropagation()
    var x = this.state.expanded
    var value = e.target.value
    var id = e.target.name
    if(x === -1){
      console.log("expand from -1")
      console.log("this id: " + id)
      this.setState({
        expanded:id
      })
    }else if(value==='collapse'){
      console.log("collapse")
      this.setState({
        expanded:-1
      })
    }else{
      console.log("expand from other index")
      this.setState({
        expanded:id
      })
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



  render(){
    console.log("rendered")

    var superuser = this.state.thisUser.is_superuser
    console.log("superuser?: " + superuser)
    var username = this.state.username

    var account = this.state.activeAccount
    var self = this

    var main_list = this.state.finalTimeline
    var x = this.sort_dates(main_list)

    var expanded = this.state.expanded
    var collapse = "collapse"
    var expand = "expand"
    var details = this.state.details

    var sorted_commits = this.state.sorted_commits
    var project_s = this.state.projectSectionList
    var project_sections = project_s.flat()



    return(
      <div>
          {superuser === true ?
            (
              <div className="container">

                  <div className="Navigation-bar">
                      <div className="Nav-bar-left">
                        <div id="wrapper" className="lookup">
                            <h2 className="brand" >Code Timeline: {username}</h2><h2 className="brand dot1">.</h2>
                            <h2 className="brand dot2">.</h2><h2 className="brand dot3">.</h2>
                        </div>
                      </div>
                      <div className="Nav-bar-right" onScroll={this.listenScrollEvent} ref={this.navBarTopRef}>
                          <button className="b-font" type="button"><Link className="link-style"
                          to={{pathname:"/search/"}}>Search for another Github user</Link></button>
                      </div>
                  </div>

                  <div className="centre">
                    <div className="outer-bubble" id="wrapper">
                        <div id="wrapper">
                          <div>
                                <div className="user" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                                    <h2><h2 style={{cursor:"pointer"}} className="body flash2-delay link-style">Start</h2></h2>
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
                                    <h2><h2 style={{paddingTop:"40px",cursor:"pointer"}} className="body flash2-delay link-style">End</h2></h2>
                                </div>
                           </div>
                        </div>
                        <div>
                          {x.reverse().map(function(item,index) {
                            return(
                              <div className="green-bubble">

                                      <div key={item.id}>
                                          <h3>{item.name}</h3>
                                          <p>Description: {item.description}</p>
                                          <p>Started: <Moment format="LL">{item.created_at}</Moment></p>
                                      </div>

                                      <div>
                                          {expanded === -1 ?
                                            (
                                              <div>
                                                  {item.commits_url ?

                                                      (
                                                        <div>
                                                          <button className="b-font" type="button" onClick={self.handleExpand}
                                                          value={expand} name={item.id} >See commits</button>
                                                        </div>
                                                      )
                                                      :
                                                      (
                                                        <div>
                                                            <div>
                                                              <p>Sections: {item.sections}</p>
                                                            </div>
                                                            <div>
                                                                <button className="b-font">
                                                                    <Link className="link-style" to={{pathname:"/update/",
                                                                  state: { account: account, project: item.id } }}>Edit project</Link>
                                                                </button>
                                                            </div>
                                                            <div>
                                                                {item.sections === 0 ?
                                                                  (
                                                                    <div>
                                                                        <br></br>
                                                                    </div>
                                                                  )
                                                                  :
                                                                  (
                                                                    <div>
                                                                      <button className="b-font" type="button" onClick={self.handleExpand}
                                                                      value={expand} name={item.id} >See sections</button>
                                                                    </div>
                                                                  )
                                                                }
                                                            </div>
                                                        </div>
                                                      )
                                                  }
                                              </div>
                                            )
                                            :
                                            (
                                              <div>
                                                  {expanded == item.id ?
                                                    (
                                                        <div>
                                                          {item.commits_url ?
                                                            (
                                                              <div>
                                                                    <div>
                                                                      {details === false ?
                                                                            (
                                                                              <div>
                                                                                  <h4>Commits:</h4>
                                                                                    <div className="collapsedcollapsed">
                                                                                      <div id="wrapper">
                                                                                        <div className="inner-column" style={{width:"300px"}}>
                                                                                          {sorted_commits.filter(commit_data => self.which_repo(commit_data,item)).reverse().map(function(commit_data,num){
                                                                                               return(
                                                                                                    <div>
                                                                                                      <h5>{num +1}. '{commit_data[1]}'</h5>
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
                                                                            :
                                                                            (
                                                                              <div>
                                                                                  <h4>Commits:</h4>
                                                                                  <div className="visible">
                                                                                     <div id="wrapper" style={{width:"100px"}}>
                                                                                        {sorted_commits.filter(commit_data => self.which_repo(commit_data,item)).reverse().map(function(commit_data,num){
                                                                                             return(
                                                                                                  <div className="commit-border">
                                                                                                      <div className="inner">
                                                                                                          <h5>{num +1}. '{commit_data[1]}'</h5>
                                                                                                          <h5>Commit message: {commit_data[1]}</h5>
                                                                                                          <h5>Committed:</h5>
                                                                                                          <Moment format="LLL">{commit_data[2]}</Moment>
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
                                                                      }
                                                                    </div>
                                                                    <div>
                                                                        <button className="b-font" type="button" onClick={self.handleExpand}
                                                                          value={collapse} name={item.id} >Hide commits</button>
                                                                    </div>

                                                              </div>
                                                            )
                                                            :
                                                            (
                                                              <div>
                                                                  <div>
                                                                    {details === false ?
                                                                      (
                                                                        <div>
                                                                          <h4>Project sections:</h4>
                                                                            <div className="collapsed">
                                                                              <div id="wrapper">
                                                                                <div className="inner-column" style={{width:"300px"}}>
                                                                                  {project_sections.filter(project_section => self.which_project(project_section,item)).map(function(project_section,ind){
                                                                                    return(
                                                                                        <div>
                                                                                          <h5>{ind +1}. {project_section.name}</h5>
                                                                                        </div>
                                                                                      )}
                                                                                    )}
                                                                                </div>
                                                                              </div>
                                                                            </div>
                                                                            <div>
                                                                                <button className="b-font" type="button" onClick={() => self.see_details()}>See details</button>
                                                                            </div>
                                                                        </div>
                                                                      )
                                                                      :
                                                                      (
                                                                        <div>
                                                                            <h4>Project sections:</h4>
                                                                            <div className="visible">
                                                                                <div id="wrapper" style={{width:"100px"}}>
                                                                                  {project_sections.filter(project_section => self.which_project(project_section,item)).map(function(project_section,ind){
                                                                                    return(
                                                                                      <div className="commit-border">
                                                                                          <div className="inner">
                                                                                              <h5>{ind +1}. {project_section.name}</h5>
                                                                                              <h5>{project_section.date}</h5>
                                                                                              {project_section.completed === true ?
                                                                                                (<h5 className="completed">Completed</h5>)
                                                                                                :
                                                                                                (<h5 className="in_progress">In progress</h5>)
                                                                                              }
                                                                                          </div>
                                                                                      </div>
                                                                                      )}
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <button className="b-font" type="button" onClick={() => self.see_details()}>Hide details</button>
                                                                            </div>
                                                                        </div>
                                                                      )
                                                                    }
                                                                  </div>
                                                                  <div>
                                                                      <button className="b-font" type="button" onClick={self.handleExpand}
                                                                      value={collapse} name={item.id} >Hide sections</button>
                                                                  </div>
                                                              </div>
                                                            )
                                                          }
                                                       </div>
                                                     )
                                                     :
                                                     (
                                                       <div>
                                                           {item.commits_url ?
                                                               (
                                                                 <div>
                                                                   <button className="b-font" type="button" onClick={self.handleExpand}
                                                                   value={expand} name={item.id} >See commits</button>
                                                                 </div>
                                                               )
                                                               :
                                                               (
                                                                 <div>
                                                                   <button className="b-font" type="button" onClick={self.handleExpand}
                                                                   value={expand} name={item.id} >See sections</button>
                                                                 </div>
                                                               )
                                                           }
                                                       </div>
                                                     )
                                                  }
                                             </div>
                                            )
                                          }
                                      </div>
                                </div>
                              )
                            }
                          )}
                          <div className="flex-col-end" style={{paddingRight:"30px"}}>
                             <div>
                                 <button type="button"><Link className="link-style b-font" to={{pathname:"create/",
                                   state: { account: account } }}>Add a project</Link></button>
                             </div>
                             <div>
                                  <p className="b-font">
                                    <Link to={{ pathname: "http://127.0.0.1:8000/admin/" }} target="_blank"
                                    className="link-style" style={{textDecoration:"underline"}}>admin</Link>
                                  </p>
                             </div>
                          </div>
                        </div>
                      </div>
                  </div>
             </div>
        )
        :
        (
              <div className="container" onScroll={this.listenScrollEvent} ref="category_scroll">

                  <div className="Navigation-bar">
                      <div className="Nav-bar-left">
                        <div id="wrapper" className="lookup">
                            <h2 className="brand" >Code Timeline: {username}</h2><h2 className="brand dot1">.</h2>
                            <h2 className="brand dot2">.</h2><h2 className="brand dot3">.</h2>
                        </div>
                      </div>
                      <div className="Nav-bar-right" onScroll={this.listenScrollEvent} ref={this.navBarTopRef}>
                          <button className="b-font" type="button"><Link className="link-style"
                          to={{pathname:"/search/"}}>Search for another Github user</Link></button>
                      </div>
                  </div>

                  <div className="centre">
                    <div className="outer-bubble" id="wrapper">
                      <div id="wrapper">
                        <div>
                            <div className="user" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                                <h2><h2 style={{cursor:"pointer"}} className="body flash2-delay link-style">Start</h2></h2>
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
                                <h2><h2 style={{paddingTop:"40px",cursor:"pointer"}} className="body flash2-delay link-style">End</h2></h2>
                            </div>
                          </div>
                        </div>
                        <div>
                          {x.reverse().map(function(item,index) {
                            return(
                              <div className="green-bubble">
                                    <div key={item.id}>
                                        <h3>{item.name}</h3>
                                        <p>Description: {item.description}</p>
                                        <p>Started: <Moment format="LL">{item.created_at}</Moment></p>
                                    </div>

                                    <div>
                                        {expanded === -1 ?
                                          (
                                            <div>
                                                {item.commits_url ?
                                                    (
                                                      <div>
                                                        <button className="b-font" type="button" onClick={self.handleExpand}
                                                        value={expand} name={item.id} >See commits</button>
                                                      </div>
                                                    )
                                                    :
                                                    (
                                                      <div>
                                                        <div>
                                                          <p>Sections: {item.sections}</p>
                                                        </div>
                                                        <div>
                                                            {item.sections === 0 ?
                                                              (
                                                                <div>
                                                                    <br></br>
                                                                </div>
                                                              )
                                                              :
                                                              (
                                                                <div>
                                                                  <button className="b-font" type="button" onClick={self.handleExpand}
                                                                  value={expand} name={item.id} >See sections</button>
                                                                </div>
                                                              )
                                                            }
                                                        </div>
                                                      </div>
                                                    )
                                                }
                                            </div>
                                          )
                                          :
                                          (
                                            <div>
                                                {expanded == item.id ?
                                                  (
                                                      <div>
                                                        {item.commits_url ?
                                                          (
                                                            <div>
                                                                  <div>
                                                                    {details === false ?
                                                                          (
                                                                            <div>
                                                                              <h4>Commits:</h4>
                                                                                <div className="collapsed">
                                                                                  <div id="wrapper">
                                                                                    <div className="inner-column" style={{width:"300px"}}>
                                                                                      {sorted_commits.filter(commit_data => self.which_repo(commit_data,item)).reverse().map(function(commit_data,num){
                                                                                           return(
                                                                                                <div>
                                                                                                  <h5>{num +1}. '{commit_data[1]}'</h5>
                                                                                                </div>
                                                                                              )
                                                                                       })}
                                                                                    </div>
                                                                                  </div>
                                                                                </div>
                                                                                <div>
                                                                                  <button className="b-font" type="button" onClick={() => self.see_details()}>See details</button>
                                                                                  <p>- - - -</p>
                                                                                </div>
                                                                            </div>
                                                                          )
                                                                          :
                                                                          (
                                                                            <div>
                                                                                <h4>Commits:</h4>
                                                                                <div className="visible">
                                                                                    <div id="wrapper" style={{width:"100px"}}>
                                                                                        {sorted_commits.filter(commit_data => self.which_repo(commit_data,item)).reverse().map(function(commit_data,num){
                                                                                             return(
                                                                                                  <div className="commit-border">
                                                                                                    <div className="inner">
                                                                                                        <h5>{num +1}. '{commit_data[1]}'</h5>
                                                                                                        <h5>Commit message: {commit_data[1]}</h5>
                                                                                                        <h5>Committed:</h5>
                                                                                                        <Moment format="LLL">{commit_data[2]}</Moment>
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
                                                                    }
                                                                  </div>
                                                                  <div>
                                                                      <button className="b-font" type="button" onClick={self.handleExpand}
                                                                        value={collapse} name={item.id} >Hide commits</button>
                                                                  </div>

                                                            </div>
                                                          )
                                                          :
                                                          (
                                                            <div>
                                                                <div>
                                                                  {details === false ?
                                                                    (
                                                                      <div>
                                                                        <h4>Project sections:</h4>
                                                                          <div className="collapsed">
                                                                            <div id="wrapper">
                                                                              <div className="inner-column" style={{width:"300px"}}>
                                                                                {project_sections.filter(project_section => self.which_project(project_section,item)).map(function(project_section,ind){
                                                                                  return(
                                                                                      <div>
                                                                                        <h5>{ind +1}. {project_section.name}</h5>
                                                                                      </div>
                                                                                    )}
                                                                                  )}
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                          <div>
                                                                            <button className="b-font" type="button" onClick={() => self.see_details()}>See details</button>
                                                                          </div>
                                                                      </div>
                                                                    )
                                                                    :
                                                                    (
                                                                      <div>
                                                                          <h4>Project sections:</h4>
                                                                          <div className="visible">
                                                                              <div id="wrapper" style={{width:"100px"}}>
                                                                                  {project_sections.filter(project_section => self.which_project(project_section,item)).map(function(project_section,ind){
                                                                                    return(
                                                                                      <div className="commit-border">
                                                                                        <div className="inner">
                                                                                            <h5>{ind +1}. {project_section.name}</h5>
                                                                                            <h5>{project_section.date}</h5>
                                                                                            {project_section.completed === true ?
                                                                                              (<h5 className="completed">Completed</h5>)
                                                                                              :
                                                                                              (<h5 className="in_progress">In progress</h5>)
                                                                                            }
                                                                                        </div>
                                                                                      </div>
                                                                                     )}
                                                                                   )}
                                                                              </div>
                                                                          </div>
                                                                          <div>
                                                                              <button className="b-font" type="button" onClick={() => self.see_details()}>Hide details</button>
                                                                          </div>
                                                                      </div>
                                                                    )
                                                                  }
                                                                </div>
                                                                <div>
                                                                    <button className="b-font" type="button" onClick={self.handleExpand}
                                                                    value={collapse} name={item.id} >Hide sections</button>
                                                                </div>
                                                            </div>
                                                          )
                                                        }
                                                     </div>
                                                   )
                                                   :
                                                   (
                                                     <div>
                                                         {item.commits_url ?
                                                             (
                                                               <div>
                                                                 <button className="b-font" type="button" onClick={self.handleExpand}
                                                                 value={expand} name={item.id} >See commits</button>
                                                               </div>
                                                             )
                                                             :
                                                             (
                                                               <div>
                                                                 <button className="b-font" type="button" onClick={self.handleExpand}
                                                                 value={expand} name={item.id} >See sections</button>
                                                               </div>
                                                             )
                                                         }
                                                     </div>
                                                   )
                                                }
                                           </div>
                                          )
                                        }
                                    </div>
                              </div>
                            )
                          }
                       )}
                  </div>
              </div>
            </div>
          )
        </div>
       )
      }
    </div>
    )
  }
}


export default MyTimeline;
