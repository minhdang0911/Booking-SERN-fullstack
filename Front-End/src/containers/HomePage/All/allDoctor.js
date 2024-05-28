import React, { Component } from 'react';
import { connect } from 'react-redux';
import './all.scss';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../HomeHeader';
import HomeFooter from '../HomeFooter';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';

class allDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            specialtyName: [],
        };
    }
    async componentDidMount() {
        this.props.loadTopDoctor();
        let res = await getAllSpecialty();
        let data = res.data;
        if (res) {
            let specialtyNames = data.map((item) => item.name);
            this.setState({
                specialtyName: specialtyNames,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux,
            });
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    };

    render() {
        const { specialtyName, arrDoctors } = this.state;
        const { language } = this.props;

        let allDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);
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
                            {allDoctors &&
                                allDoctors.length > 0 &&
                                allDoctors.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }

                                    let nameVi = `${item.positionData.ValueVi},${item.lastName} ${item.firstName} `;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}  `;

                                    return (
                                        <div
                                            className="section-customize1 specialty-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}
                                        >
                                            <div
                                                className="bg-image1 seciton-specialty"
                                                style={{
                                                    backgroundImage: `url(${imageBase64})`,
                                                }}
                                            ></div>
                                            <div className="specialty-name1">
                                                {language === LANGUAGES.VI ? nameVi : nameEn}
                                            </div>
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
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadTopDoctor: () => dispatch(actions.fetchTopDoctor()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(allDoctor));
