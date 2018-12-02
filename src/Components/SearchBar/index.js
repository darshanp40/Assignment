import React, { Component } from 'react'
import './index.css'
export default class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationData: this.props.searchData,
            navBarClass: ''
        }
        this.filterList = this.filterList.bind(this);
        this.toggleNavBar = this.toggleNavBar.bind(this);
    }
    filterList(evt) {
        let searchValue = evt.target.value.toLowerCase();
        var locationData = [];
        this.props.searchData.forEach(function (location, index) {
            var bResult = (location.place.toLowerCase().indexOf(searchValue) > -1);
            this.props.markerData[index].setVisible(bResult);
            if (bResult) {
                locationData.push(location);
            }
        }.bind(this));
        this.setState({
            locationData: locationData
        });
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.searchData !== prevProps.searchData) {
            this.setState({
                locationData: this.props.searchData
            })
        }
    }
    toggleNavBar() {
        this.setState({
            navBarClass: this.state.navBarClass === 'show' ? '' : 'show'
        })
    }
    render() {
        return (
            <section className={`navbar-section ${this.state.navBarClass}`}>
                <nav className="navbar">
                    <div className="navbar-heading">
                        <div className="nav-button" onClick={this.toggleNavBar}>
                            <span className="nav-slice"></span>
                            <span className="nav-slice"></span>
                            <span className="nav-slice"></span>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="navbar-content">
                        <div className="search-box">
                            <input type="text" placeholder="Search place here..." className="search-control" autoComplete="off" id="filter-input" onChange={this.filterList} />
                        </div>
                        <ul id="list-spaces" className="content-list">
                            {
                                this.state.locationData.map((item, key) => {
                                    return (
                                        <li key={key} className="list-item" onClick={this.toggleNavBar}>{item.place}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </nav>
            </section>
        )
    }
}
