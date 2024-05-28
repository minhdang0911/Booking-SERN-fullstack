import React, { Component } from 'react';
import { connect } from 'react-redux';
import './all.scss';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomeHeader';
import HomeFooter from '../HomeFooter';

class allSpecialty extends Component {
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

    render() {
        let { dataSpecialty } = this.state;

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
                            {dataSpecialty &&
                                dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div
                                            className="section-customize1 specialty-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className="bg-image1 seciton-specialty"
                                                style={{
                                                    backgroundImage: `url(${item.image})`,
                                                }}
                                            ></div>
                                            <div className="specialty-name1">{item.name}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(allSpecialty));
