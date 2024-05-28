import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getExtraInforDoctorById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import './DoctorExtraInfor.scss';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
            clinicCoordinates: null,
            viewport: {
                latitude: 0,
                longitude: 0,
                zoom: 10,
                width: '100%',
                height: '100%',
            },
        };
    }

    async componentDidMount() {
        let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
        if (res && res.data && res.data.Doctor_infor) {
            this.setState({
                extraInfor: res.data,
            });
            this.getCoordinates(res.data.Doctor_infor.addressClinic);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res) {
                this.setState({
                    extraInfor: res.data,
                });
                this.getCoordinates(res.data.Doctor_infor.addressClinic);
            }
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status,
        });
    };

    getCoordinates = async (address) => {
        try {
            const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json', {
                params: {
                    access_token: '', // Không cần token
                },
            });

            const { data } = response;
            if (data && data.features && data.features.length > 0) {
                const { center } = data.features[0];
                this.setState({
                    clinicCoordinates: { latitude: center[1], longitude: center[0] },
                    viewport: {
                        ...this.state.viewport,
                        latitude: center[1],
                        longitude: center[0],
                    },
                });
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
        }
    };

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;
        const addressClinic = extraInfor.Doctor_infor ? extraInfor.Doctor_infor.addressClinic : null;

        const position = this.state.clinicCoordinates || { lat: 0, lng: 0 };
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-addres">
                        {' '}
                        <FormattedMessage id="patient.extra-infor-doctor.text-address" />
                    </div>
                    <div className="name-clinic">
                        {extraInfor.Doctor_infor && extraInfor.Doctor_infor.nameClinic
                            ? extraInfor.Doctor_infor.nameClinic
                            : ''}
                    </div>
                    <div className="detail-address">
                        {extraInfor.Doctor_infor && extraInfor.Doctor_infor.addressClinic
                            ? extraInfor.Doctor_infor.addressClinic
                            : ''}
                    </div>
                </div>
                <div className="content-down">
                    {isShowDetailInfor === false && (
                        <div className="short-infor">
                            <FormattedMessage id="patient.extra-infor-doctor.price" />
                            {extraInfor.Doctor_infor &&
                                extraInfor.Doctor_infor.priceTypeData &&
                                language === LANGUAGES.VI && (
                                    <NumberFormat
                                        value={extraInfor.Doctor_infor.priceTypeData.ValueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'VND'}
                                        className="currency"
                                    />
                                )}
                            {extraInfor.Doctor_infor &&
                                extraInfor.Doctor_infor.priceTypeData &&
                                language === LANGUAGES.EN && (
                                    <NumberFormat
                                        value={extraInfor.Doctor_infor.priceTypeData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'$'}
                                        className="currency"
                                    />
                                )}
                            <span className="detail" onClick={() => this.showHideDetailInfor(true)}>
                                {' '}
                                <FormattedMessage id="patient.extra-infor-doctor.detail" />
                            </span>
                        </div>
                    )}

                    {isShowDetailInfor === true && (
                        <>
                            {' '}
                            <div className="title-price">
                                {' '}
                                <FormattedMessage id="patient.extra-infor-doctor.price" />{' '}
                            </div>
                            <div className="detail-infor">
                                <div className="price">
                                    <span className="left">
                                        {' '}
                                        <FormattedMessage id="patient.extra-infor-doctor.price" />
                                    </span>
                                    <span className="right">
                                        {extraInfor &&
                                            extraInfor.Doctor_infor.priceTypeData &&
                                            language === LANGUAGES.VI && (
                                                <NumberFormat
                                                    value={extraInfor.Doctor_infor.priceTypeData.ValueVi}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'VND'}
                                                    className="currency"
                                                />
                                            )}
                                        {extraInfor &&
                                            extraInfor.Doctor_infor.priceTypeData &&
                                            language === LANGUAGES.EN && (
                                                <NumberFormat
                                                    value={extraInfor.Doctor_infor.priceTypeData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'$'}
                                                    className="currency"
                                                />
                                            )}
                                    </span>
                                </div>
                                <div className="note"> {extraInfor && extraInfor.note ? extraInfor.note : ''}</div>
                            </div>
                            <div className="payment">
                                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                                {extraInfor && extraInfor.Doctor_infor.paymentTypeData && language === LANGUAGES.VI
                                    ? extraInfor.Doctor_infor.paymentTypeData.ValueVi
                                    : extraInfor.Doctor_infor.paymentTypeData.valueEn}
                            </div>
                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInfor(false)}>
                                    {' '}
                                    <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {/* <div>
                    {extraInfor.Doctor_infor && extraInfor.Doctor_infor.addressClinic && (
                        <ReactMapGL
                            {...this.state.viewport}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxApiAccessToken={null}
                            onViewportChange={(viewport) => this.setState({ viewport })}
                        >
                            <Marker
                                latitude={position.latitude}
                                longitude={position.longitude}
                                offsetLeft={-20}
                                offsetTop={-10}
                            >
                                <div>You are here</div>
                            </Marker>
                            <Popup latitude={position.latitude} longitude={position.longitude} closeButton={false}>
                                <div>{extraInfor.Doctor_infor.nameClinic}</div>
                                <div>{extraInfor.Doctor_infor.addressClinic}</div>
                            </Popup>
                        </ReactMapGL>
                    )}
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
