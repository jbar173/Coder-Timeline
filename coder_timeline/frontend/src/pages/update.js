import React from 'react';
import '../App.css';
import { BrowserRouter as Router,
          Link,
          Redirect } from "react-router-dom";
import Moment from 'react-moment';
import moment from 'moment';


// Project update page:

class UpdateTimeline extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: 'jbar173',
      fetched:false,
      editing_proj: false,
      deleted:false,
      editing_ps:false,
      new_s:false,
      checked:false,
      ps_deleted:false,
      ps_added:false,
      projectSectionList:[],
      project_num: null,

      activeAccount: {
        'id': null,
        'username': ''
      },
      activeProject:{
        'id':null,
        'name':'',
        'description':'',
        'created_at':'',
        'sections':''
      },
      activeProjectSection:{
        'id':null,
        'name':'',
        'date':'',
        'project':'',
        'in_progress':true,
        'completed':false
      }
    }
    this.getCookie = this.getCookie.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.editing = this.editing.bind(this)
    this.editingPs = this.editingPs.bind(this)
    this.clear = this.clear.bind(this)

    this.fetchProjectSections = this.fetchProjectSections.bind(this)
    this.fetchProjectUpdate = this.fetchProjectUpdate.bind(this)
    this.fetchPSDelete = this.fetchPSDelete.bind(this)

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSectionDateChange = this.handleSectionDateChange.bind(this)
    this.handleCompleted = this.handleCompleted.bind(this)
    this.handleSectionEditSubmit = this.handleSectionEditSubmit.bind(this)

  };


  abortController = new AbortController()

  componentWillUnmount(){
  this.abortController.abort()
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


  componentDidMount(){
    console.log("mounted")
    if(this.state.activeAccount.id === null){
      try{
        var account = this.props.location.state.account
        this.setState({
          activeAccount:account
        })
      }catch{
        console.log("catch 1")
      }
    }
    if((this.state.project_num === null)){
      try{
        var project = this.props.location.state.project
        this.setState({
          project_num:project
        })
      }catch{
        console.log("catch 2")
      }
    }
  }


  componentDidUpdate(){
    console.log("Did update")
    if(this.state.fetched === false){
      this.fetchProject()
      this.fetchProjectSections()
      this.setState({
        fetched:true
      })
    }
    if(this.state.ps_deleted === true || this.state.ps_added === true){
      this.fetchProjectUpdate()
      // ^ updates the 'sections' attribute of the project
      this.setState({
        ps_deleted:false,
        ps_added:false,
        fetched:false
      })
    }
  }


  fetchProject(){
    console.log("Fetching Project...")
    var proj_id = this.state.project_num
    var url = `http://127.0.0.1:8000/api/p-detail/${proj_id}`
    fetch(url)
    .then(response => response.json())
    .then(data =>
      this.setState({
        activeProject:data
      })
    )
  }


  fetchProjectSections(){
    console.log("Fetching project sections...")
    var proj_id = this.state.project_num
    var url = `http://127.0.0.1:8000/api/ps-list/${proj_id}`
    fetch(url)
    .then(response => response.json())
    .then(data =>
        this.setState({
          projectSectionList:data
        })
      )
   }


   fetchProjectUpdate(){
     var csrftoken = this.getCookie('csrftoken')
     var x = this.state.project_num
     var url = `http://127.0.0.1:8000/api/update-project/${x}/`
     fetch(url, {
       signal : this.abortController.signal,
       method:'POST',
       headers:{
         'Content-type':'application/json',
         'X-CSRFToken':csrftoken,
       },
       body:JSON.stringify(this.state.activeProject)
     }).then(response => response.json()
      ).then(data =>
         this.setState({
           activeProject:data,
           activeProjectSection:{
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
     var id = this.state.activeProject.id
     var url = `http://127.0.0.1:8000/api/delete-project/${id}/`

     fetch(url, {
       signal : this.abortController.signal,
       method: 'DELETE',
       headers:{
           'Content-type':'application/json',
           'X-CSRFToken':csrftoken,
       },
     })
      this.setState({
        deleted:true
      })
    }


   fetchPSDelete(id){
     var csrftoken = this.getCookie('csrftoken')
     var s = this.state.activeProject.sections
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
           ps_deleted:true,
           activeProject:{
             ...this.state.activeProject,
             sections:s
           },
           activeProjectSection:{
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



// main project editing functions:

  handleTitleChange(e){
    console.log("handling title change")
    e.stopPropagation()
    var account = this.state.activeAccount.id
    var sections = this.state.activeProject.sections
    var value = e.target.value
    this.setState({
      activeProject:{
        ...this.state.activeProject,
        name:value,
        account:account,
        sections:sections
        }
    })
  }


  handleDescriptionChange(e){
    console.log("handling description change")
    e.stopPropagation()
    var value = e.target.value
    this.setState({
      activeProject:{
      ...this.state.activeProject,
      description:value,
      }
    })
  }


  handleDateChange(e){
    console.log("handling date change")
    e.stopPropagation()
    var value = e.target.value
    this.setState({
      activeProject:{
      ...this.state.activeProject,
      created_at:value
      }
    })
  }


  handleEditSubmit(e){
    console.log("handling edit")
    e.preventDefault()
    console.log("Fetching update")
    this.fetchProjectUpdate()
    this.setState({
      editing_proj:false
    })
  }


  editing(){
    var new_state = !this.state.editing_proj
    this.setState({
      editing_proj:new_state
    })
    console.log("editing")
  }



// project section editing functions:

  handleNameChange(e){
    console.log("handling name change")
    e.stopPropagation()
    var value = e.target.value
    var project_id = this.state.activeProject.id
    this.setState({
      activeProjectSection:{
        ...this.state.activeProjectSection,
        name:value,
        project:project_id,
        }
    })
  }


  handleSectionDateChange(e){
    console.log("handling date change")
    e.stopPropagation()
    var value = e.target.value
    this.setState({
      activeProjectSection:{
        ...this.state.activeProjectSection,
        date:value,
        }
    })
  }


  handleCompleted(e){
    console.log("handling completed")
    e.stopPropagation()
    if(this.state.activeProjectSection.completed === true){
      var bool = false
    }else{
      var bool = true
    }
    this.setState({
      activeProjectSection:{
        ...this.state.activeProjectSection,
        completed:bool,
        }
    })
    console.log("bool: " + bool)
  }


  handleSectionEditSubmit(e){
    console.log("Fetching section update")
    e.preventDefault()
    var csrftoken = this.getCookie('csrftoken')

    if(this.state.activeProjectSection.id === null){
      console.log("id is null")
      var s = this.state.activeProject.sections
      s += 1
      var id = this.state.activeProject.id
      var url = `http://127.0.0.1:8000/api/create-ps/${id}/`
      fetch(url, {
        signal : this.abortController.signal,
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify(this.state.activeProjectSection)
      }).then(response => response.json())
        .then(data =>
          this.setState({
            editing_ps:false,
            new_s:false,
            activeProjectSection:{
              'id':null,
              'name':'',
              'date':'',
              'project':'',
              'in_progress':true,
              'completed':false
            },
            fetched:false,
            ps_added:true,
            activeProject:{
              ...this.state.activeProject,
              sections:s
            }
          })
        ).catch(function(error){
          console.log("ERROR:", error)
        })
    }else{
        console.log("id not null")
        var x = this.state.activeProjectSection.id
        var url = `http://127.0.0.1:8000/api/update-ps/${x}/`
        console.log("*3* url: " + url)
        fetch(url, {
          signal : this.abortController.signal,
          method:'POST',
          headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
          },
          body:JSON.stringify(this.state.activeProjectSection)
        }).then(response => response.json()
         ).then(data =>
            this.setState({
              editing_ps:false,
              activeProjectSection:{
                'id':null,
                'name':'',
                'date':'',
                'project':'',
                'in_progress':true,
                'completed':false
              },
              fetched:false
            })
         ).catch(function(error){
           console.log("ERROR:", error)
         })
    }
  }

// click function, toggles view between editing and
// not editing the project section:
  editingPs(section){
    var new_state = !this.state.editing_ps
    if(section !== 0){
      if(section.completed === true){
      this.setState({
        editing_ps:new_state,
        activeProjectSection:section,
        checked:true
      })
      }else{
        this.setState({
          editing_ps:new_state,
          activeProjectSection:section,
          checked:false
        })
      }
    }else{
      this.setState({
        editing_ps:new_state,
        new_s: true,
        checked:false
      })
     }
    console.log("editing ps")
  }

// clears all current data from project section's edit form:
  clear(){
    this.setState({
      editing_ps:false,
      new_s:false,
      editing_proj:false,
      activeProjectSection:{
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
    var self = this
    var account = this.state.activeAccount
    var project = this.state.activeProject
    var project_sections = this.state.projectSectionList

    var editing_pr = this.state.editing_proj
    var editing_prs = this.state.editing_ps
    var new_s = this.state.new_s
    var deleted = this.state.deleted
    if(this.state.activeProject.sections > 0){
      var has_sections = true
    }else{
      var has_sections = false
    }


    return(

          <div className="container">

            {deleted === false ?

              (

                  <div>

                      {editing_pr === true ?

                        (
                          <div className="t-align-centre" style={{marginLeft:"40px"}}>

                              <div className="large margin-b" style={{marginTop: "40px"}}>
                                <h2 style={{paddingTop:"50px",paddingBottom:"30px",fontSize:"2em"}} className="large f-end margin-b">Edit project</h2>
                              </div>

                              <div style={{marginTop: "40px"}}>
                                  <form onSubmit={this.handleEditSubmit}>
                                      <div>
                                          <div id="wrapper" className="margin-b">
                                            <input className="form-control f-end b-grey" onChange={this.handleTitleChange}
                                              value={project.name} placeholder="Project title"/>
                                          </div>
                                          <div id="wrapper" className="margin-b">
                                            <textarea className="form-control f-end b-grey" onChange={this.handleDescriptionChange}
                                              value={project.description} placeholder="Project description"
                                              rows={15} cols={49} />
                                          </div>
                                          <div id="wrapper" className="margin-b">
                                            <input className="form-control f-end b-grey" onChange={this.handleDateChange} type="date"
                                             value={project.created_at} placeholder="Project start date" />
                                          </div>
                                       </div>
                                       <div style={{paddingBottom:"85px"}} className="margin-b margin-t">
                                            <button className="b-font" onClick={() => self.editing()} type="button">Cancel</button>
                                            <button style={{marginRight:"2px"}} className="b-font" type="submit">Save updates</button>
                                       </div>
                                  </form>
                               </div>

                           </div>

                        )

                        :

                        (

                              <div>

                                  {editing_prs === true ?

                                    (
                                      <div className="margin-t">
                                        {new_s === false ?
                                            (
                                               <div>
                                                    <div className="margin-b t-align-centre">
                                                        <h4 style={{paddingTop:"100px",paddingBottom:"30px",fontSize:"2.5em"}} className="large f-end margin-b">Edit project section:</h4>
                                                    </div>
                                                    <div>
                                                        <form onSubmit={this.handleSectionEditSubmit}>
                                                          <div>
                                                              <div id="wrapper" className="margin-b">
                                                                <input className="form-control f-end b-grey" onChange={this.handleNameChange}
                                                                  value={this.state.activeProjectSection.name} placeholder={this.state.activeProjectSection.name}/>
                                                              </div>
                                                              <div id="wrapper" className="margin-b">
                                                                <input className="form-control f-end b-grey" onChange={this.handleSectionDateChange} type="date"
                                                                 value={this.state.activeProjectSection.date} placeholder={this.state.activeProjectSection.date} />
                                                              </div>
                                                              <div id="wrapper" className="margin-b">
                                                                <label className="f-end">
                                                                    Completed?:
                                                                    <input className="checkbox" onChange={this.handleCompleted}
                                                                      defaultChecked={this.state.checked} type="checkbox"/>
                                                                </label>
                                                              </div>
                                                              <div style={{paddingBottom:"288px"}} className="margin-b margin-t t-align-centre">
                                                                  <button className="b-font" type="button" onClick={() => self.clear()}>Cancel</button>
                                                                  <button className="b-font f-end" type="submit">Save update</button>
                                                              </div>
                                                          </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )

                                            :

                                            (
                                                <div>
                                                    <div className="t-align-centre">
                                                        <h4 style={{paddingTop:"100px",paddingBottom:"60px",fontSize:"2.5em"}} className="large f-end margin-b">New project section:</h4>
                                                    </div>
                                                    <div>
                                                        <form onSubmit={this.handleSectionEditSubmit}>
                                                          <div>
                                                              <div id="wrapper" className="margin-b">
                                                                <input className="form-control f-end t-align-centre b-grey" onChange={this.handleNameChange}
                                                                  value={this.state.activeProjectSection.name} placeholder="Project section name"/>
                                                              </div>
                                                              <div style={{ marginBottom:"8px" }} id="wrapper">
                                                                <p className="f-end">Date:</p>
                                                              </div>
                                                              <div id="wrapper" className="margin-b">
                                                                <input className="form-control f-end b-grey" onChange={this.handleSectionDateChange} type="date"
                                                                 value={this.state.activeProjectSection.date} placeholder="Date" />
                                                              </div>
                                                              <div id="wrapper" className="margin-b">
                                                                <label className="f-end">
                                                                    Completed?:
                                                                    <input className="checkbox" onChange={this.handleCompleted}
                                                                      defaultChecked={this.state.checked} type="checkbox"/>
                                                                </label>
                                                              </div>
                                                              <div style={{paddingBottom:"265px"}} className="margin-b margin-t t-align-centre">
                                                                  <button className="b-font" onClick={() => self.clear()} type="button">Cancel</button>
                                                                  <button className="b-font f-end" type="submit">Save</button>
                                                              </div>
                                                          </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )

                                         }
                                      </div>

                                    )

                                    :

                                    (
                                      <div style={{paddingBottom:"64px"}}>

                                              <div className="Nav-bar-left lookup" id="wrapper">
                                                  <h3 className="brand">Update Project</h3><h2 className="brand dot1">.</h2>
                                                  <h2 className="brand dot2">.</h2><h2 className="brand dot3">.</h2>
                                              </div>

                                              <div>
                                                  <table className="tbl" style={{marginTop:"30px"}}>
                                                      <tr>
                                                          <td><h2 className="large" style={{fontSize: "2em"}}>{project.name}</h2></td>
                                                      </tr>
                                                  </table>
                                              </div>

                                              <div>
                                                  <table className="margin-b tbl">
                                                      <tr>
                                                        <td style={{textAlign:"left",paddingLeft:"75px"}}><p className="large margin-r">Description: </p></td>
                                                        <td><p style={{textAlign:"left",maxWidth:"270px",paddingLeft:"10px"}} className="large">{project.description}</p></td>
                                                      </tr>
                                                      <tr>
                                                        <td style={{textAlign:"left",paddingLeft:"75px"}}><p className="large margin-r">Date started: </p></td>
                                                        <td><p style={{textAlign:"left",paddingLeft:"10px"}} className="large">{project.created_at}</p></td>
                                                      </tr>
                                                      <tr>
                                                        <td style={{textAlign:"left",paddingLeft:"75px"}}><p className="large margin-r">Number of sections: </p></td>
                                                        <td><p style={{textAlign:"left",paddingLeft:"10px"}} className="large">{project.sections}</p></td>
                                                      </tr>
                                                  </table>
                                               </div>

                                               <div>
                                                  <table className="margin-b tbl">
                                                    <tr>
                                                      <td>
                                                          <button className="b-font" type="button" onClick={() => self.editing()}>Edit project</button>
                                                          <button className="b-font" type="button" onClick={() => self.fetchProjectDelete()}>Delete project</button>
                                                      </td>
                                                    </tr>
                                                  </table>
                                               </div>

                                               <div className="margin-b">
                                                  <table className="margin-b tbl" style={{marginTop:"60px"}}>
                                                    <tr>
                                                      <td><h4 className="large f-end">Project sections:</h4></td>
                                                    </tr>
                                                  </table>
                                                    {has_sections === true ?
                                                        (
                                                          <table className="margin-b tbl t-align-centre">
                                                            <tr>
                                                              <td>{project_sections.map(function(project_section,index){
                                                                    return(
                                                                      <div key={index} style={{marginBottom:"40px"}}>
                                                                        <h4>{project_section.name}</h4>
                                                                        <p>Date: <Moment format="LL">{project_section.date}</Moment></p>
                                                                        {project_section.completed === true ?
                                                                          (<p className="completed">Completed</p>)
                                                                          :
                                                                          (<p className="in_progress">In progress</p>)
                                                                        }
                                                                        <button className="b-font" onClick={() => self.editingPs(project_section)} type="button">Edit section</button>
                                                                        <button className="b-font" type="button" onClick={() => self.fetchPSDelete(project_section.id)}>Delete section</button>
                                                                      </div>
                                                                     )}
                                                                   )}
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        )
                                                        :
                                                        (
                                                          <div>
                                                            <table className="margin-b tbl">
                                                              <tr>
                                                                <td><p>No project sections yet</p></td>
                                                              </tr>
                                                            </table>
                                                          </div>
                                                        )
                                                     }
                                                 </div>

                                                 <div className="margin-b" style={{margin:"auto",marginTop:"40px"}}>
                                                     <table className="margin-b tbl">
                                                         <tr>
                                                            <td><button className="b-font" type="button" onClick={() => self.editingPs(0)}>Add project section</button>
                                                                <button className="b-font margin-b" type="button"><Link className="link-style" to={{pathname:"/",
                                                                  state: { account: account } }}>Back to timeline</Link></button>
                                                            </td>
                                                         </tr>
                                                      </table>
                                                 </div>

                                        </div>
                                      )

                                  }

                            </div>

                         )

                      }

                  </div>
                )

                :

                (

                  <div className="t-align-centre" style={{marginTop:"150px", paddingBottom:"490px"}}>
                      <h2 className="brand f-end margin-b">Project deleted!</h2>
                      <button className="b-font margin-b" type="button"><Link className="link-style" to={{pathname:"/",
                        state: { account: account } }}>Back to timeline</Link></button>
                  </div>

                )
              }

          </div>

        )
  }
}
export default UpdateTimeline;
