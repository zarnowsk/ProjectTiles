import React from 'react';

import '../../stylesheets/ProjectListTilesContainer.scss'
import ProjectListMap from './ProjectListMap.jsx'
import ProjectListTiles from './ProjectListTiles.jsx'
import { getUserLocation } from "../../util/getUserLocation.js";

class ProjectListTilesContainer extends React.Component {

  state = {
    displayMap: true,
    userLocation: ''
  }

  async componentDidMount() {
    this.setState({
      userLocation: await (getUserLocation())
    })
  }

  handleMapToggle = () => {
    this.setState({
      displayMap: !this.state.displayMap
    })
  }

  render() {
    return (
      //height of the container based on available window height
      <div className='tilesContainer__container' style={{ height: this.props.availableHeight }}>
        <ProjectListMap
          display={this.state.displayMap}
          userLocation={this.state.userLocation}
        />
        <ProjectListTiles
          handleMapToggle={this.handleMapToggle}
          displayMap={this.state.displayMap}
        />
      </div>
    )
  }
}

export default ProjectListTilesContainer;