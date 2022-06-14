import moment from 'moment'
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getLast, getFirst } from './helpers.js';
import './reactAgendaItem.css';

export default class ReactAgendaItem extends Component {
  constructor(props) {
    super(props);
    let backgroundColor = 'rgba(255, 255, 255, 1)';
    if (this.props.item.type == 'deadline') backgroundColor = 'rgba(253, 185, 45, 1)'
    else if (this.props.item.acceptStatus.response == 'accepted') backgroundColor = 'rgba(0, 111, 207, 1)'

    this.state = {
      wrapper: {
        width: '150px',
        height: '30px',
        zIndex: 5,
        border: '1px solid #006FCF',
        backgroundColor: backgroundColor,
        color: this.props.item.acceptStatus.response == 'accepted' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 111, 207, 1)',
      },
      controls: {

      }


    };
    this.updateDimensions = this.updateDimensions.bind(this)
    this.raiseZindex = this.raiseZindex.bind(this)
    this.lowerZindex = this.lowerZindex.bind(this)

  }

  updateDimensions() {
    var elem = document.getElementById(this.props.parent)
    const hours = Math.abs(this.props.item.endDateTime - this.props.item.startDateTime) / 36e5;
    const length = this.props.count ? this.props.count : 1;
    if (elem) {
      const offset = this.props.index ? elem.offsetWidth / length * this.props.index: 0;
      return this.setState({
        wrapper: {
          ...this.state.wrapper,
          width: elem.offsetWidth / length + 'px',
          height: elem.offsetHeight * this.props.rowsPerHour * hours + 'px',
          marginTop: (-elem.offsetHeight / 2) + 'px',
          marginLeft: offset - 10 + 'px',
          zIndex: 5,
        }
      })

    }

  }

  componentWillReceiveProps(props, next) {
    setTimeout(function () {
      this.updateDimensions();
    }.bind(this), 50);

  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);

    this.updateDimensions();

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  lowerZindex(e) {
    let sty = this.state.wrapper;

    if (sty.zIndex === 8) {
      var newState = { wrapper: Object.assign({}, sty, { zIndex: 5 }) };
      return this.setState(newState)
    }

  }
  raiseZindex(e) {
    let sty = this.state.wrapper;

    if (sty.zIndex === 5) {

      var newState = { wrapper: Object.assign({}, sty, { zIndex: 8 }) };
      return this.setState(newState)
    }

  }

  render() {
    var duratH = moment.duration(this.props.item.duration._milliseconds, 'Milliseconds').humanize();
    var duratL = moment(this.props.item.startDateTime).format("HH:mm")
    var duratE = moment(this.props.item.endDateTime).format("HH:mm")

    return <div style={this.state.wrapper} className="agenda-cell-item" onMouseEnter={this.raiseZindex} onMouseLeave={this.lowerZindex} onClick={() => this.props.edit(this.props.item)}>

      {/* {<div className="agenda-controls-item" style={this.state.controls}>
               {this.props.edit?
                <div className="agenda-edit-event">
                  <a onClick={() => this.props.edit(this.props.item)} className="agenda-edit-modele">
                    <i className="edit-item-icon"></i>
                  </a>
                </div>:''}
                {this.props.remove?
                <div className="agenda-delete-event">
                  <a onClick={() => this.props.remove(this.props.item)} className="agenda-delete-modele">
                    <i className="remove-item-icon"></i>
                  </a>
                </div>:''}
              </div>} */}

      <div className="agenda-item-description">
        <p>{this.props.item.name}</p>
        <p>{duratL} - {duratE}</p>
      </div>

    </div>

  }
}

ReactAgendaItem.propTypes = {
  parent: PropTypes.string,
  item: PropTypes.object,
  padder: PropTypes.number,
  edit: PropTypes.func,
  remove: PropTypes.func

};

ReactAgendaItem.defaultProps = {
  parent: 'body',
  item: {},
  padder: 0
}
