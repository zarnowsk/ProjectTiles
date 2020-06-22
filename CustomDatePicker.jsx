import React, { Component } from "react";
import ReactDOM from "react-dom";

import { DatePicker } from "@blueprintjs/datetime";
import { dateFormatter } from "../../util/DateFormatter.js";

import CustomDatePickerInput from "../CustomDatePickerInput/CustomDatePickerInput.jsx";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "../../stylesheets/CustomDatePicker.scss";

const dayPickerProps = {
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

const initialMaxDate = new Date(new Date().getFullYear() + 10, new Date().getMonth(), new Date().getDate());

class CustomDatePicker extends Component {
  state = {
    expanded: false,
    refY: 0,
    resetted: false,
    minDate: new Date(1970, 0, 1, 0, 0, 0, 0),
    maxDate: initialMaxDate
  };

  componentDidMount() {
    window.addEventListener("click", this.handleClicks);
    let toolbarContainer = document.querySelector(`#toolbar-container`)
    toolbarContainer.addEventListener(
      "scroll",
      this.handleDatePickerLocation
    );
    this.setMinMaxValues();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (!prevState.expanded && this.state.expanded) {
      this.handleDatePickerLocation()
    }

    //set max/min selectable date conditionally
    if (this.props.siblingCalendarValue !== prevProps.siblingCalendarValue) {
      this.setMinMaxValues();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClicks);
    let toolbarContainer = document.querySelector(`#toolbar-container`)

    toolbarContainer.removeEventListener(
      "scroll",
      this.handleDatePickerLocation
    );
  }

  setMinMaxValues = () => {
    //if sibling calendar is empty, return date range to default
    if (this.props.siblingCalendarValue.length === 0) {
      this.setState({
        minDate: new Date(1970, 0, 1, 0, 0, 0, 0),
        maxDate: this.tenYearsFromNow()
      })
    } else { //otherwise set min/max date according to sibling calendar
      if (this.props.name === 'dateFrom') {
        this.setState({
          maxDate: new Date(this.props.siblingCalendarValue),
        })
      } else {
        this.setState({
          minDate: new Date(this.props.siblingCalendarValue),
        })
      }
    }
  }

  inputClickHandler = async expanded => {
    await this.setState({ expanded });
    if (!expanded) {
      this.setSelected(null, true);
    }
  };

  applyDate = async () => {
    const { selected } = this.state;
    const { name } = this.props;

    this.props.valueChanged(dateFormatter(selected), name);
    this.setState(state => ({
      ...state,
      expanded: false,
    }));
  };

  onDatePickerChange = async(selected, isUserChange) => {
    if (!isUserChange) return;

    await(this.setSelected(selected));

    this.applyDate();
  };

  setSelected = async (d, nulled = false) => {
    if (!nulled && d !== null) {
      const selected = new Date(d);
      this.setState({
        selected, resetted: false
      });
    }
  };

  handleDatePickerLocation = () => {
    let location = this[`${this.props.name}Ref`].getBoundingClientRect().y

    this.setState(state => ({
      refY: location
    }));
  };

  tenYearsFromNow = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let c = new Date(year + 10, month, day)
    return c
  }

  renderCalendar = () => {
    let cal = null;
    let defVal = null;

    if (this.state.expanded) {

      //default value logic
      if (this.props.name === 'dateTo') {
        //if min selectable date not in default state, set default calendar value to min selectable date
        if (this.state.minDate.getTime() !== new Date(1970, 0, 1, 0, 0, 0, 0).getTime()) {
          defVal = this.state.minDate;
        }
      } else if (this.props.name === 'dateFrom') {
        //if max selectable date not in default state, set default calendar value to max selectable date
        if (this.state.maxDate.getTime() !== this.tenYearsFromNow().getTime()) {
          defVal = this.state.maxDate;
        }
      }

      cal = (
        <div
          className={"datepicker__container__absolute"}
          style={{ top: this.state.refY - 90 }}
        >
          <div className={"datepicker__container__relative"}>
            <DatePicker
              defaultValue={defVal !== null ? defVal : null}
              value={this.props.value !== null ? new Date(this.props.value) : undefined}
              dayPickerProps={{
                ...dayPickerProps
              }}
              onChange={this.onDatePickerChange}
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              placeholder={"M/D/YYYY"}

            />
          </div>
        </div>
      );
    }
    return cal;
  };

  handleClicks = event => {
    const domNode = ReactDOM.findDOMNode(this);

    if (!domNode || !domNode.contains(event.target)) {
      this.setState({
        expanded: false
      });
    }
  };

  render() {
    return (
      <div
        className='costs__react__datepicker__wrapper'
        ref={r => {
          this[`${this.props.name}Ref`] = r;
        }}
      >
        <CustomDatePickerInput
          date={this.props.value !== null ? dateFormatter(new Date(this.props.value)) : ""}
          hasDate={this.props.selected !== null}
          value={this.props.value !== null ? dateFormatter(new Date(this.props.value)) : ""}
          viewable={this.state.expanded}
          onClick={this.inputClickHandler}
          onCancel={this.props.onCancel}
          clearDateValue={this.props.clearDateValue}
          name={this.props.name}
          expanded={this.state.expanded}
        />
        {this.renderCalendar()}
      </div>
    );
  }
}

export default CustomDatePicker;
