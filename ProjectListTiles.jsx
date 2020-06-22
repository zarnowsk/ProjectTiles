import React from 'react'
import { connect } from "react-redux";

import { fetchNextPageProjectsStart } from "../../redux/project-list/projectList.actions.js";

import '../../stylesheets/ProjectListTiles.scss'
import ProjectTile from './ProjectTile.jsx'
import { authorizeProjecProfileAccess } from "../../util/AccessControl";

let lastUsedToken = null;

class ProjectListTiles extends React.Component {

  componentDidMount() {
    window.addEventListener("message", this.receiveMessage);
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.receiveMessage);
  }

  receiveMessage = (event) => {
    //enable clicking inside tiles container after "ACCESS DENIED" modal is closed
    if (event.data.type == "navbar__success__model__closed") {
      let grid = document.getElementsByClassName('tiles__body')[0].style.pointerEvents = 'auto';
    }
  }

  /**
   * Opens project summary page of clicked project in the old G3 env
   * or displays access denied pop up
   */
  handleTileClick = async (oldg3Project) => {

    //check if user is authorized to view the project profie
    let authorized = await (authorizeProjecProfileAccess(oldg3Project));

    if (authorized) {
      window.open(`${process.env.G3_DIRECT_LINK}/${oldg3Project}/Project/${oldg3Project}`, "_blank")
      //if not authorized, display ACCESS DENIED model
    } else {

      //disable tile clicking to prevent continuous access denied pop-up display
      document.getElementsByClassName('tiles__body')[0].style.pointerEvents = 'none';

      //display access denied pop up
      window.postMessage(
        {
          type: "navbar__open-settings",
          header: "Access Denied",
          message: "You do not have access to this project, please contact your administrator to request access.",
          popup_state: "error",
          button_text: "Got it"
        },
        "*"
      );
    }
  }

  /**
   * Used to fetch next page of records if user has scrolled to the bottom
   * of the current list
   */
  handleScroll = (event) => {
    //determine if user is near reaching the bottom of the list
    const bottom = event.target.scrollHeight - event.target.scrollTop < event.target.clientHeight + 200;

    const { fetchNextPageProjectsStart, isFetching } = this.props
    if (isFetching) return;

    //load next batch of projects
    if (bottom) {
      if (this.props.nextPageToken !== null && this.props.nextPageToken !== lastUsedToken) {
        let { nextPageToken } = this.props
        fetchNextPageProjectsStart('', '', nextPageToken);
        lastUsedToken = nextPageToken;
        return;
      }
    }
  }

  render() {
    return (
      <div className='tiles__container'>
        <div className='tiles__header'>
          <div className='tiles__header-title'>Total Projects: {this.props.totalProjects}</div>
          <button className={this.props.displayMap
            ? 'tiles__header-button--selected'
            : 'tiles__header-button'} onClick={this.props.handleMapToggle}>Map</button>
        </div>

        <div className='tiles__body' onScroll={this.handleScroll}>
          {this.props.projectList.map(project => {
            return (
              <ProjectTile project={project} key={project.g3_IDProject} handleTileClick={this.handleTileClick} />
            )
          })}

        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    projectList: state.projectList.projects,
    nextPageToken: state.projectList.nextPageToken,
    sortInfo: state.projectList.sortInfo,
    isFetching: state.projectList.isFetching,
    totalProjects: state.projectList.totalProjects,
  }
};

const mapDispatchToProps = dispatch => ({
  fetchNextPageProjectsStart: (searchParams, sortInfo, nextPageToken) => dispatch(fetchNextPageProjectsStart(searchParams, sortInfo, nextPageToken))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectListTiles);