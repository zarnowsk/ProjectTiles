import React from 'react'

import '../../stylesheets/ProjectTile.scss'
import ProjectOverviewDefaultImage from "../../images/ProjectOverviewDefault.png";
import { nullChecker } from "../../util/NullChecker";
import CustomTooltip from '../../util/CustomTooltip.js'

class ProjectTile extends React.Component {

  /**
   * Function returns a string containing the address of supplied project
   * or 'Address not available' if project has no address
   */
  getAddress = project => {
    let address = '';

    if (nullChecker(project.street_address)) address += `${project.street_address}, `;
    if (nullChecker(project.city)) address += project.city;
    if (address.length === 0) address += 'Address not available';

    return address
  }

  render() {
    //prepare data to be displayed
    let project = this.props.project;
    let projectTitle = `${project.number} | ${project.name}`
    let projectPhase = `${project.phase}`.replace("Project ", "");
    let projectAddress = this.getAddress(project);

    return (
      <div className="projectTile__container" onClick={() => this.props.handleTileClick(project.g3_IDProject)}>

        <div className='projectTile__imageContainer'>
          <img
            className="projectTile__image"
            src={ProjectOverviewDefaultImage}
            alt=""
          />

          <div className='projectTile__phase'>
            {projectPhase}
          </div>
        </div>

        <div className='projectTile__name'>
          <CustomTooltip title={projectTitle}>{projectTitle}</CustomTooltip>
        </div>

        <div className='projectTile__address'>
          <CustomTooltip title={projectAddress}>{projectAddress}</CustomTooltip>
        </div>

        <div className='projectTile__value'>
          {nullChecker(project.original_contract_value)
            ? '$' + (project.original_contract_value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : 'Project value not available'}
        </div>

      </div>
    )
  }
}

export default ProjectTile;