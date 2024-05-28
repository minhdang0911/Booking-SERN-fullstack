import React, { Component } from 'react';
import { connect } from 'react-redux';
import './all.scss';
import { FormattedMessage } from 'react-intl';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomeHeader';
import HomeFooter from '../HomeFooter';

class allClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
        };
    }
    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data,
            });
        }
    }

    handleViewDetailSpecialty = (item) => {
        this.props.history.push(`/detail-clinic/${item.id}`);
    };

    render() {
        let { dataClinics } = this.state;
        console.log('dâtclinic', dataClinics);

        return (
            <>
                <HomeHeader />
                <div className="section-share1 section-specialty ">
                    <div className="section-container">
                        <div className="section-header1">
                            <span className="title-section1">
                                <FormattedMessage id="homepage.specialty" />
                            </span>
                        </div>
                        <div className="section-body1">
                            {dataClinics &&
                                dataClinics.length > 0 &&
                                dataClinics.map((clinic, index) => {
                                    return (
                                        <div
                                            className="section-customize1 specialty-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(clinic)}
                                        >
                                            <div
                                                className="bg-image1 seciton-specialty"
                                                style={{
                                                    backgroundImage: `url(${clinic.image})`,
                                                }}
                                            ></div>
                                            <div className="specialty-name1">{clinic.name}</div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="footer1">
                        <HomeFooter />
                    </div>
                </div>
            </>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(allClinic));
