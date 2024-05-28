import React, { Component } from 'react';
import { TweenMax, Power3 } from 'gsap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { getAllSpecialty } from '../../../services/userService';

class OutStandingDoctor extends Component {
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

    animateElement = (element) => {
        TweenMax.from(element, 1, {
            opacity: 0,
            x: -50,
            ease: Power3.easeOut,
        });
    };

    handleClickToAllDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/all-doctor`);
        }
    };

    render() {
        const { specialtyName, arrDoctors } = this.state;
        const { language } = this.props;

        let allDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);

        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 2000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        initialSlide: 1,
                    },
                },
            ],
        };

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.outstanding-doctor" />
                        </span>
                        <button className="btn-section" onClick={() => this.handleClickToAllDoctor()}>
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {allDoctors.map((item, index) => {
                                let imageBase64 = '';
                                if (item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                }

                                let nameVi = `${item.positionData.ValueVi},${item.lastName} ${item.firstName} `;
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}  `;

                                return (
                                    <div
                                        className="section-customize"
                                        key={index}
                                        onClick={() => this.handleViewDetailDoctor(item)}
                                        ref={(element) => this.animateElement(element)}
                                    >
                                        <div className="customize-border">
                                            <div className="outer-bg">
                                                <div
                                                    className="bg-image section-outstanding-doctor"
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>
                                            </div>

                                            <div className="position text-center">
                                                <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                <div>Cơ xương khớp</div>
                                            </div>
                                        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
