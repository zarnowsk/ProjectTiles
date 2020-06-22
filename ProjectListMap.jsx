import React from 'react'
import '../../stylesheets/ProjectListMap.scss'
import Map from './MapAlpha.jsx'
import { connect } from 'react-redux'
import { getGeoLocation } from "../../util/addressConverter.js";
import { nullChecker } from "../../util/NullChecker";
import ProjectLoader from '../ProjectLoader/ProjectLoader.jsx'

class ProjectListMap extends React.Component {
  state = {
    geoLocations: [],
    isLoaded: false,
    locations: []
  }

  componentDidMount() {
    //ONLY USING INITIAL 100 PROJECTS FOR MAP MARKERS
    //TODO: CHANGE TO PROPER IMPLEMENTATION
    // let projectsList = this.extractAddressesFromProjects();
    // this.setState({ locations: projectsList });
  }

  async componentDidUpdate(prevState, prevProps) {
    if (prevState.locations !== this.state.locations && !this.state.isLoaded) {
      //   //TEMP DISABLE OF GOOGLE API GEOCODE CONVERTER
      //   let geoLocations = await (this.getListOfGeoLocations(this.state.locations));
      //   //let geoLocations = [{ lat: 43.596070, lng: -79.586600 }]; //temp
      this.setState({
        //geoLocations,
        isLoaded: true
      })
    }
  }

  /**
   * Function extracts and returns the address from all 
   * project objects
   */
  extractAddressesFromProjects = () => {
    let projects = this.props.projectList;
    let projectsList = [];

    if (projects.length > 0) {
      for (let i = 0; i < projects.length; ++i) {
        let projectAddress = this.getAddressAsString(projects[i]);
        projectsList.push(projectAddress)
      }
    }
    return projectsList
  }

  /**
   * Function extracts and returns the street address, city and
   * country from each project object as a string
   */
  getAddressAsString = project => {
    let address = '';

    if (nullChecker(project.street_address)) address += project.street_address;
    if (nullChecker(project.city)) address += project.city;
    if (nullChecker(project.country.name)) address += project.country.name;

    return address;
  }

  /**
   * Function converts a list of addresses into a list of geo code locations
   * ({lat:... lng:...})
   */
  getListOfGeoLocations = async locations => {
    let geoLocations = [];

    for (let i = 0; i < locations.length; ++i) {
      if (locations[i].length > 6) { // <-- validate if address is more than just country
        let geoLocation = await (getGeoLocation(locations[i]));

        //validate geoLocation to have lat and lng properties before adding to table
        let geoKeys = Object.keys(geoLocation);
        if (geoKeys.includes("lat") && geoKeys.includes("lng")) {
          geoLocations.push(geoLocation)
        }
      }
    }

    return geoLocations;
  }

  render() {
    let display = this.props.display

    return (
      <div className='projectListMap__container' style={display ? {} : { flex: '0', display: 'none' }} >
        {
          this.state.isLoaded
            ? <Map
              geoLocations={this.state.geoLocations}
              userLocation={this.props.userLocation}
            />
            : <ProjectLoader />
        }
      </div >
    )
  }
}

const mapStateToProps = state => {
  return {
    projectList: state.projectList.projects,
  }
}

export default connect(mapStateToProps)(ProjectListMap);