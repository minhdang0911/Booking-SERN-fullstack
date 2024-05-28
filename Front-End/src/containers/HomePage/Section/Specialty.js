import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomeHeader';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
        };
    }
    async componentDidMount() {
        let res = await getAllSpecialty();

        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data,
            });
        }
    }

    handleViewDetailSpecialty = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`);
    };

    handleClickToAllSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/all-specialty`);
        }
    };
    render() {
        let { dataSpecialty } = this.state;

        return (
            <div className="section-share section-specialty ">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.specialty-popular" />
                        </span>
                        <button className="btn-section" onClick={() => this.handleClickToAllSpecialty()}>
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataSpecialty &&
                                dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div
                                            className="section-customize specialty-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className="bg-image seciton-specialty"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="specialty-name">{item.name}</div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
