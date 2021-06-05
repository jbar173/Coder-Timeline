import React from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link,
          Redirect } from "react-router-dom";
import Moment from 'react-moment';
import moment from 'moment';


// New project creation page:

class CreateEvent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: 'jbar173',
      project_id:null,
      updated:false,
      updated_2:false,
      has_sections: false,
      final:false,
      add_ps: false,
      editing: false,
      editing_ps: false,
      checked:false,
      error:false,

      ps_list: [],
      activeAccount:{
        'id':null,
        'username':'',
      },
      new_project:{
        'id':null,
        'account':'',
        'name':'',
        'description':'',
        'created_at':'',
        'sections':0
      },
      new_ps:{
        'id':null,
        'name':'',
        'date':'',
        'project':'',
        'in_progress':true,
        'completed':false
      },
      activePs:{
        'id':null,
        'name':'',
        'date':'',
        'project':'',
        'in_progress':true,
        'completed':false
      },
      finalTimeline: []
    }

    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)

    this.getCookie = this.getCookie.bind(this)
    this.fetchDrfAccount = this.fetchDrfAccount.bind(this)
    this.fetchProjectUpdate = this.fetchProjectUpdate.bind(this)
    this.fetchProjectSections = this.fetchProjectSections.bind(this)

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.expand = this.expand.bind(this)

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSectionDateChange = this.handleSectionDateChange.bind(this)
    this.handleCompleted = this.handleCompleted.bind(this)
    this.handleSectionSubmit = this.handleSectionSubmit.bind(this)
    this.handleSectionEditSubmit = this.handleSectionEditSubmit.bind(this)
    this.canc = this.canc.bind(this)

    this.fetchProjectDelete = this.fetchProjectDelete.bind(this)
    this.fetchPSDelete = this.fetchPSDelete.bind(this)

  };


 abortController = new AbortController()


 componentDidMount(){
    console.log("mounted")
    if(this.state.activeAccount.id === null){
      try{
        var account = this.props.location.state.account
        this.setState({
          activeAccount:account
        })
      }catch{
        this.fetchDrfAccount()
      }
    }
 }

 componentWillUnmount(){
   this.abortController.abort()
 }

 componentDidUpdate(){
   console.log("did update")
   if(this.state.updated === true && this.state.updated_2 === false  && this.state.final === false){
     console.log("updated 1")
   }else if(this.state.updated === true && this.state.updated_2 === true){
     console.log("updated 2")
     var x = this.state.new_project.id
     this.fetchProjectUpdate()
     this.setState({
       updated_2:false,
     })
   }else if(this.state.final === true){
     console.log("updated final")
     var x = this.state.new_project.id
     this.fetchProjectSections()
     this.setState({
       final:false,
       project_id:x
     })
   }else{
     console.log("updated else")
   }
 }


//   1. To create a new Project :                               handleSubmit()
//   2. To create a new Project Section:                        handleSectionSubmit()
//   3. Updates the main Project's 'sections' attribute
//        (called each time project section is added):          fetchProjectUpdate()
//   4. Fetches Project Sections, stores in ps_list:            fetchProjectSections()
//   5. When rendering, maps Project Sections (ps_list)
//        underneath main Project details.


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

// If account id isn't carried over in state (componentDidMount),
// function will fetch account from hardcoded username:
 fetchDrfAccount(){
    console.log("Fetching drf account..")
    var account = this.state.username
    var url = `http://127.0.0.1:8000/api/account-detail/${account}/`
    fetch(url)
    .then(response => response.json())
    .then(data =>
      this.setState({
        activeAccount:data,
      })
    )
  }


// MAIN PROJECT'S create form event handlers/functions:
 handleTitleChange(e){
   console.log("Handling title change")
   e.stopPropagation()
   var account = this.state.activeAccount.id
   var value = e.target.value
   this.setState({
     new_project:{
       ...this.state.new_project,
       name:value,
       account:account
      }
   })
 }

  handleDescriptionChange(e){
    console.log("Handling description change")
    e.stopPropagation()
    var value = e.target.value
    this.setState({
      new_project:{
      ...this.state.new_project,
      description:value,
      }
    })
  }

  handleDateChange(e){
    console.log("Handling date change")
    e.stopPropagation()
    var value = e.target.value
    this.setState({
      new_project:{
      ...this.state.new_project,
      created_at:value
      }
    })
  }

  handleSubmit(e){
    console.log("Handling submit")
    e.preventDefault()
    console.log("Fetching create project")
    var csrftoken = this.getCookie('csrftoken')
    var name = this.state.new_project.name
    var desc = this.state.new_project.description
    var date = this.state.new_project.created_at

    var url = 'http://127.0.0.1:8000/api/create-project/'

    if(name === '' || desc === '' || date === ''){
      this.setState({
        error:true
      })
    }else{
      fetch(url, {
        signal : this.abortController.signal,
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify(this.state.new_project)
      }).then(response => response.json())
        .then(data =>
            this.setState({
              new_project:data,
              updated:true
            })
          ).catch(function(error){
          console.log("ERROR:", error)
        })
      }
  }
//


// Called each time a project section is added:
  fetchProjectUpdate(){
    var csrftoken = this.getCookie('csrftoken')
    var x = this.state.new_project.id
    var y = this.state.new_project.sections
    var url = `http://127.0.0.1:8000/api/update-project/${x}/`
    fetch(url, {
      signal : this.abortController.signal,
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.new_project)
    }).then(response => response.json()
     ).then(data =>
        this.setState({
          new_project:data,
          updated:true,
          final:true,
          new_ps:{
            'id':null,
            'name':'',
            'date':'',
            'project':'',
            'in_progress':true,
            'completed':false
          }
        })
     ).catch(function(error){
       console.log("ERROR:", error)
     })
  }


fetchProjectDelete(){
  var csrftoken = this.getCookie('csrftoken')
  var id = this.state.new_project.id
  var url = `http://127.0.0.1:8000/api/delete-project/${id}/`
  fetch(url, {
    signal : this.abortController.signal,
    method: 'DELETE',
    headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
    },
  }).then(response => response.json)
    .then(data =>
      this.setState({
        updated:false,
        new_project:{
          'id':null,
          'account':'',
          'name':'',
          'description':'',
          'created_at':'',
          'sections':0
        },
      })
    )
  }

// click function, toggles view between editing and
// not editing the main project:
 edit(){
    var new_state = !this.state.editing
    this.setState({
      editing:new_state
    })
 }

  handleEditSubmit(e){
    console.log("Handling edit")
    e.preventDefault()
    console.log("Fetching update")
    this.fetchProjectUpdate()
    this.setState({
      editing:false
    })
  }


// PROJECT SECTION create form/event handlers:

  handleNameChange(e){
    console.log("handling name change")
    e.stopPropagation()
    var value = e.target.value
    var project_id = this.state.new_project.id

    var completed = this.state.activePs.completed
    if(this.state.editing_ps === false){
      this.setState({
        new_ps:{
          ...this.state.new_ps,
          name:value,
          project:project_id,
          }
      })
    }else{
        this.setState({
          new_ps:{
            ...this.state.activePs,
            name:value,
            project:project_id,
            completed:completed
            }
        })
    }
  }


  handleSectionDateChange(e){
    console.log("handling date change")
    e.stopPropagation()
    var value = e.target.value
    var project_id = this.state.new_project.id
    if(this.state.editing_ps == false){
        this.setState({
          new_ps:{
            ...this.state.new_ps,
            date:value,
            project:project_id
            }
        })
    }else{
        this.setState({
          new_ps:{
            ...this.state.activePs,
            date:value,
            project:project_id
            }
        })
    }
  }


  handleCompleted(e){
    console.log("handling completed")
    e.stopPropagation()
    var project_id = this.state.new_project.id
    if(this.state.new_ps.completed === true){
      var bool = false
    }else{
      var bool = true
    }
    if(this.state.editing_ps == false){
      this.setState({
        new_ps:{
          ...this.state.new_ps,
          completed:bool,
          project:project_id
          }
      })
    }else{
      this.setState({
        new_ps:{
          ...this.state.activePs,
          completed:bool,
          project:project_id
          }
      })
    }
  }


 handleSectionSubmit(e){
    e.preventDefault()
    console.log("Fetching create")
    var csrftoken = this.getCookie('csrftoken')
    var no_error = true
    var project_id = this.state.new_ps.project
    console.log("project_id 1: " + project_id)
    var url = `http://127.0.0.1:8000/api/create-ps/${project_id}/`
    fetch(url, {
      signal : this.abortController.signal,
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.new_ps)
    }).then(response => response.json())
      .then(data =>
          this.setState({
            add_ps:false,
            updated_2:true,
          }),
      ).catch(function(error){
        console.log("ERROR:", error)
        no_error = false
        console.log("no_error: " + no_error)
      })
      if(no_error === true){
        var s = this.state.new_project.sections
        s += 1
        this.setState({
          new_project:{
            ...this.state.new_project,
            sections:s
          }
        })
      }
   }

// PROJECT SECTION update event handlers//
// click function, toggles view between editing and
// not editing the project section:
 editPS(id){
   console.log("editing project section")
   var new_state = id
   var length = this.state.ps_list.length
   var i
   for(i=0;i<length;i++){
     var ps = this.state.ps_list[i]
     if(ps.id === new_state){
       if(ps.completed === true){
       this.setState({
         editing_ps:new_state,
         activePs:ps,
         checked:true
       })
       }else{
         this.setState({
           editing_ps:new_state,
           activePs:ps,
           checked:false
         })
       }
     }
   }
 }


handleSectionEditSubmit(e){
  console.log("Fetching section update")
  e.preventDefault()
  var csrftoken = this.getCookie('csrftoken')
  var x = this.state.editing_ps
  console.log("this.state.editing_ps: " + x)
  var url = `http://127.0.0.1:8000/api/update-ps/${x}/`
  console.log("*3* url: " + url)
  fetch(url, {
    signal : this.abortController.signal,
    method:'POST',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken':csrftoken,
    },
    body:JSON.stringify(this.state.new_ps)
  }).then(response => response.json()
   ).then(data =>
      this.setState({
        updated:true,
        final:true,
        editing:false,
        editing_ps:false,
        new_ps:{
          'id':null,
          'name':'',
          'date':'',
          'project':'',
          'in_progress':true,
          'completed':false
        }
      })
   ).catch(function(error){
     console.log("ERROR:", error)
   })
 }


// PROJECT SECTION list/delete calls:
  fetchProjectSections(){
    console.log("fetching project sections")
    var proj_id = this.state.new_project.id
    console.log("proj_id 2: " + proj_id)
    var url = `http://127.0.0.1:8000/api/ps-list/${proj_id}/`
    fetch(url)
    .then(response => response.json())
    .then(data =>
      this.setState({
        ps_list:data,
      })
    ).catch(function(error){
    console.log("ERROR:", error)
    })
  }

 fetchPSDelete(id){
   var csrftoken = this.getCookie('csrftoken')
   var s = this.state.new_project.sections
   s -= 1
   var url = `http://127.0.0.1:8000/api/delete-ps/${id}/`
   fetch(url, {
     signal : this.abortController.signal,
     method: 'DELETE',
     headers:{
         'Content-type':'application/json',
         'X-CSRFToken':csrftoken,
     },
   }).then(response => response.json)
     .then(data =>
       this.setState({
         updated_2:true,
         new_project:{
           ...this.state.new_project,
           sections:s
         },
         new_ps:{
           'id':null,
           'name':'',
           'date':'',
           'project':'',
           'in_progress':true,
           'completed':false
         }
       })
     )
   console.log("ps deleted")
 }


// click function for adding a project section:
 expand(){
    this.setState({
      add_ps:true
    })
  }

// reversing add_ps state:
 canc(e){
    e.stopPropagation()
    this.setState({
      add_ps:false
    })
  }

// clears all current data from project section's edit form:
 clear(){
  this.setState({
    editing_ps:false,
    add_ps: false,
    editing: false,
    activePs:{
      'id':null,
      'name':'',
      'date':'',
      'project':'',
      'in_progress':true,
      'completed':false
    }
  })
 }


  render(){
    var error = this.state.error
    var updated = this.state.updated        // Toggled to true once main project create form is submitted

    var add_ps = this.state.add_ps          // Toggled to true when add project section is clicked
    var ps_list = this.state.ps_list
    var self = this
    var editing = this.state.editing        // Toggled to true whilst editing main project
    var editing_ps = this.state.editing_ps  // Toggled to true whilst editing a project section

    var active_ps = this.state.activePs

    var num_sections = this.state.new_project.sections
    var has_sections
    if(num_sections > 0){
      has_sections = true
    }else{
      has_sections = false
    }


// Lines 637-646: error view (caught in handleSubmit(),line 227)


    return(

          <div style={{paddingBottom:"8px"}}>
              {error === true ?
                  (
                    <div className="error-outer e">
                      <div className="error">
                          <p style={{marginBottom:"40px"}}>Error: Unable to save project. All fields must be filled out.</p>
                          <button onClick={()=> this.setState({error:false})} type="button">
                            <Link className="b-font link-style" to={{pathname:"/create/"}}>Try again</Link>
                          </button>
                          <button type="button"><Link className="b-font link-style"
                           to={{pathname:"/"}}>Back to my profile</Link></button>
                      </div>
                    </div>
                  )
                  :
                  (<div>
                    {updated === true ?

                      (
                        <div>

                          {editing === true?

                            (
                              <div className="margin-b t-align-centre" style={{paddingBottom:"60px",paddingTop:"100px"}}>

                                    <div style={{marginTop: "20px",marginBottom: "40px"}}>
                                        <h2 className="brand f-end margin-b">Edit project</h2>
                                    </div>

                                    <div className="margin-b margin-t">
                                         <form onSubmit={this.handleEditSubmit}>
                                            <div>
                                                <div id="wrapper" className="margin-b">
                                                      <input className="form-control f-end" onChange={this.handleTitleChange}
                                                        value={this.state.new_project.name} placeholder="Project title"/>
                                                </div>
                                                <div id="wrapper" className="margin-b">
                                                      <textarea className="form-control f-end" onChange={this.handleDescriptionChange}
                                                        value={this.state.new_project.description} placeholder="Project description"
                                                        rows={15} cols={49} />
                                                </div>
                                                <div id="wrapper" className="margin-b">
                                                      <input className="form-control f-end" onChange={this.handleDateChange} type="date"
                                                       value={this.state.new_project.created_at} placeholder="Project start date" />
                                                </div>
                                                <div className="margin-b margin-t t-align-centre">
                                                      <button className="b-font" onClick={() => self.edit()} type="button">Cancel</button>
                                                      <button className="b-font" type="submit">Save updates</button>
                                                </div>
                                           </div>
                                        </form>
                                   </div>

                              </div>
                            )

                            :

                            (
                                <div>

                                    <div className="Nav-bar-left lookup" id="wrapper">
                                        <h3 className="brand">Project details</h3><h2 className="brand dot1">.</h2>
                                        <h2 className="brand dot2">.</h2><h2 className="brand dot3">.</h2>
                                    </div>

                                    <div>
                                        <table className="tbl" style={{marginTop:"30px"}}>
                                            <tr>
                                                <td><h2 className="large" style={{fontSize: "2em"}}>
                                                {this.state.new_project.name}</h2></td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div>
                                        <table className="margin-b tbl">
                                            <tr>
                                                <td style={{textAlign:"left"}}><p className="large margin-r">Github account: </p></td>
                                                <td><p style={{textAlign:"left"}} className="large">{this.state.activeAccount.username}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign:"left"}}><p className="large margin-r">Description: </p></td>
                                                <td><p style={{textAlign:"left",maxWidth:"150px"}} className="large">{this.state.new_project.description}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign:"left"}}><p className="large margin-r">Date started: </p></td>
                                                <td><p style={{textAlign:"left"}} className="large"><Moment format="LL">{this.state.new_project.created_at}</Moment></p></td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign:"left"}}><p className="large margin-r">Number of sections: </p></td>
                                                <td><p style={{textAlign:"left"}} className="large">{num_sections}</p></td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div>
                                       <table className="margin-b tbl">
                                         <tr>
                                           <td>
                                              <button className="b-font" onClick={() => self.edit()} type="button">Edit project details</button>
                                              <button className="b-font" type="button" onClick={() => self.fetchProjectDelete()}>Delete project</button>
                                              <button className="b-font" type="button">
                                                <Link className="link-style" to={{pathname:"/"}}>Back to timeline</Link>
                                              </button>
                                           </td>
                                         </tr>
                                       </table>
                                     </div>

                                     <div>
                                        {add_ps === false ?

                                            (
                                                <div className="margin-b">
                                                    <table className="margin-b tbl">
                                                      <tr>
                                                        <td><button className="b-font margin-b" onClick={this.expand}>Add a project section</button></td>
                                                      </tr>
                                                    </table>

                                                    <div>
                                                      <table className="margin-b tbl">
                                                        <tr>
                                                          <td><h4 className="large f-end">Project sections:</h4></td>
                                                        </tr>
                                                      </table>
                                                    </div>

                                                    <div>
                                                        {has_sections === true ?
                                                            (
                                                              <table className="margin-b tbl t-align-centre">
                                                                <tr>
                                                                  <td>{editing_ps === false ?
                                                                       (
                                                                         <div>
                                                                            {ps_list.map(function(section,index){
                                                                              return(
                                                                                <div key={index}>
                                                                                  <h4>{section.name}</h4>
                                                                                  <p>Date: <Moment format="LL">{section.date}</Moment></p>
                                                                                  {section.completed === true ?
                                                                                    (<p className="completed">Completed</p>)
                                                                                    :
                                                                                    (<p className="in_progress">In progress</p>)
                                                                                  }
                                                                                  <button className="b-font" onClick={() => self.editPS(section.id)} type="button">Edit section details</button>
                                                                                  <button className="b-font" type="button" onClick={() => self.fetchPSDelete(section.id)}>Delete</button>
                                                                                </div>
                                                                               )}
                                                                             )}
                                                                          </div>
                                                                       )

                                                                       :

                                                                       (
                                                                         <div className="margin-b margin-t">
                                                                             <form onSubmit={this.handleSectionEditSubmit}>
                                                                               <div>
                                                                                   <div id="wrapper" className="margin-b">
                                                                                     <input className="form-control f-end" onChange={this.handleNameChange}
                                                                                       value={this.state.new_ps.name} placeholder={this.state.activePs.name}/>
                                                                                   </div>
                                                                                   <div id="wrapper" className="margin-b">
                                                                                     <input className="form-control f-end" onChange={this.handleSectionDateChange} type="date"
                                                                                      value={this.state.new_ps.date} placeholder={this.state.activePs.date} />
                                                                                   </div>
                                                                                   <div id="wrapper" className="margin-b">
                                                                                     <label className="f-end">
                                                                                         Completed?:
                                                                                         <input className="checkbox" onChange={this.handleCompleted}
                                                                                           defaultChecked={this.state.checked} type="checkbox"/>
                                                                                     </label>
                                                                                   </div>
                                                                                   <div className="margin-b t-align-centre">
                                                                                     <button className="b-font" type="button" onClick={() => self.clear()}>Cancel</button>
                                                                                     <button className="b-font f-end" type="submit">Save update</button>
                                                                                   </div>

                                                                               </div>
                                                                             </form>
                                                                         </div>
                                                                       )
                                                                      }</td>
                                                                  </tr>
                                                                </table>
                                                             )

                                                             :

                                                             (
                                                               <table className="margin-b tbl">
                                                                   <tr>
                                                                     <td><p>No project sections yet</p></td>
                                                                   </tr>
                                                               </table>
                                                             )
                                                       }
                                                 </div>
                                                </div>

                                            )

                                            :

                                            (
                                              <div className="margin-b">

                                                              <div className="margin-b margin-t">
                                                                  <div id="wrapper" className="margin-b f-end">
                                                                      <h4 style={{marginTop:"20px"}} className="large f-end margin-b">New project section:</h4>
                                                                  </div>
                                                                  <form onSubmit={this.handleSectionSubmit}>
                                                                    <div>
                                                                        <div id="wrapper" className="margin-b">
                                                                          <input style={{marginTop:"30px"}} className="form-control f-end" onChange={this.handleNameChange}
                                                                            value={this.state.new_ps.name} placeholder="Project section title"/>
                                                                        </div>
                                                                        <div id="wrapper" className="margin-b">
                                                                          <input className="form-control f-end" onChange={this.handleSectionDateChange} type="date"
                                                                           value={this.state.new_ps.date} placeholder="Project section start date" />
                                                                        </div>
                                                                        <div id="wrapper" className="margin-b">
                                                                          <label className="f-end">
                                                                              Completed?:
                                                                              <input className="form-control" onChange={this.handleCompleted} type="checkbox"
                                                                                />
                                                                          </label>
                                                                        </div>
                                                                        <div id="wrapper" className="f-end">
                                                                          <button className="b-font f-end" type="submit">Add project section</button>
                                                                        </div>
                                                                        <div id="wrapper" className="f-end">
                                                                          <button className="b-font f-end" onClick={this.canc} type="button">Cancel</button>
                                                                        </div>
                                                                    </div>
                                                                  </form>
                                                              </div>

                                                              <div className="margin-b margin-t">
                                                                  {has_sections === true ?
                                                                    (
                                                                          <div>
                                                                            <table className="margin-b tbl t-align-centre">
                                                                                <tr>
                                                                                  <td>
                                                                                    <h4 className="large f-end margin-b">Project sections:</h4>
                                                                                    {ps_list.map(function(section,index){
                                                                                      return(
                                                                                        <div key={index}>
                                                                                          <h3>{section.name}</h3>
                                                                                          <p>Date: <Moment format="LL">{section.date}</Moment></p>
                                                                                          {section.completed === true ?
                                                                                            (<p className="completed">Completed</p>)
                                                                                            :
                                                                                            (<p className="in_progress">In progress</p>)
                                                                                          }
                                                                                        </div>
                                                                                        )}
                                                                                      )}
                                                                                 </td>
                                                                               </tr>
                                                                            </table>
                                                                          </div>

                                                                    )
                                                                    :
                                                                    (
                                                                          <div id="wrapper" className="margin-b f-end">
                                                                            <table className="margin-b tbl">
                                                                                <tr>
                                                                                  <td>
                                                                                    <p className="f-end">No project sections yet</p>
                                                                                 </td>
                                                                               </tr>
                                                                            </table>
                                                                          </div>
                                                                    )
                                                                  }
                                                            </div>

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
                              <div className="Nav-bar-left lookup" id="wrapper">
                                  <h3 className="brand">Add new project</h3><h2 className="brand dot1">.</h2>
                                  <h2 className="brand dot2">.</h2><h2 className="brand dot3">.</h2>
                              </div>
                              <div className="margin-b margin-t" >
                                    <form onSubmit={this.handleSubmit}>
                                        <div>
                                            <div id="wrapper" className="margin-b">
                                                <input className="form-control b-font f-end large t-align-centre search-bar" onChange={this.handleTitleChange}
                                                  value={this.state.new_project.name} placeholder="Project title" style={{cursor:"text"}}/>
                                            </div>
                                            <div id="wrapper" className="margin-b">
                                                <textarea className="form-control f-end large t-align-centre" onChange={this.handleDescriptionChange}
                                                  value={this.state.new_project.description} placeholder="Project description"
                                                  rows={15} cols={40} />
                                            </div>
                                            <div id="wrapper" className="margin-b f-end">
                                                <h2 className="f-end" >Start date:</h2>
                                            </div>
                                            <div id="wrapper" className="margin-b">
                                                <input className="form-control f-end t-align-centre" onChange={this.handleDateChange} type="date"
                                                 value={this.state.new_project.created_at} style={{cursor:"text"}} placeholder="Project start date" />
                                            </div>
                                            <div id="wrapper" className="margin-b f-end">
                                              <div className="f-end">
                                                <button className="b-font" type="button">
                                                  <Link className="link-style" to={{pathname:"/"}}>Cancel</Link>
                                                </button>
                                                <button style={{marginBottom:"22px"}} className="b-font" type="submit">Add project</button>
                                              </div>
                                            </div>
                                        </div>
                                     </form>
                                </div>
                           </div>
                         )
                    }
                </div>
              )
          }
      </div>
    )
  }
}

export default CreateEvent;
