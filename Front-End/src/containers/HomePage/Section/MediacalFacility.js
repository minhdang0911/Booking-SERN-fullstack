import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MediacalFacility.scss';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

class MedicalFacility extends Component {
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

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
            document.title = 'Chi tiết chuyên khoa';
        }
    };

    handleClickViewAllClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
            document.title = 'Chi tiết chuyên khoa';
        }
    };

    handleClickToAllClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/all-clinic`);
        }
    };

    render() {
        const { dataClinics } = this.state;

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
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homeheader.health-facility" />
                        </span>
                        <button className="btn-section" onClick={() => this.handleClickToAllClinic()}>
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {dataClinics.map((clinic, index) => (
                                <div
                                    className="section-customize clinic-child "
                                    key={index}
                                    onClick={() => this.handleViewDetailClinic(clinic)}
                                >
                                    <div
                                        className="bg-image section-medical-facility"
                                        style={{ backgroundImage: `url(${clinic.image})` }}
                                    ></div>
                                    <div className="clinic-name">{clinic.name}</div>
                                </div>
                            ))}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
