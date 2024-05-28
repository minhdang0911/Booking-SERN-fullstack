import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import './DoctorSchedule.scss';
// import localization from 'moment/locale/vi';
import moment  from 'moment';
import { getScheduleDoctorByDate } from '../../../services/userService';
// import { rest } from 'lodash';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        };
    }

    async componentDidMount() {
        const { language } = this.props;
        const allDays = await this.setArrDays(language);

        // if (this.props.doctorIdFromParent) {
        //     const res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
        //     this.setState({
        //         allAvailableTime: res.data ? res.data : [],
        //     });
        // }

        if (allDays && allDays.length > 0) {
            this.setState({
                allDays: allDays,
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            const allDays = await this.setArrDays(this.props.language);
            this.setState({
                allDays: allDays,
            });
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            const allDays = await this.setArrDays(this.props.language);
            const res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : [],
            });
        }
    }

    setArrDays = async (language) => {
        const allDays = [];
        for (let i = 0; i < 7; i++) {
            const object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    const ddMM = moment(new Date()).format('DD/MM');
                    const today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd -DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi);
                }
            } else {
                if (i === 0) {
                    const ddMM = moment(new Date()).format('DD/MM');
                    const today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    };

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleOnChangeSelect = async (event) => {
        const { doctorIdFromParent } = this.props;
        if (doctorIdFromParent && doctorIdFromParent !== -1) {
            const doctorId = doctorIdFromParent;
            const date = event.target.value;
            const res = await getScheduleDoctorByDate(doctorId, date);

            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                });
            }
            console.log('check schedule res', res);
        }
    };

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
        });
    };

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };

    render() {
        const { allDays, allAvailableTime } = this.state;
        const { language } = this.props;

        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select
                            onChange={(event) => this.handleOnChangeSelect(event)}
                            style={{
                                backgroundColor: 'white',
                                border: '1px solid #ced4da',
                                borderRadius: '5px',
                                padding: '8px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                            }}
                        >
                            {allDays.map((item, index) => (
                                <option
                                    value={item.value}
                                    key={index}
                                    style={{ transition: 'background-color 0.2s ease, color 0.2s ease' }}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="all-avaiable-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                                <span>
                                    <FormattedMessage id="patient.detail-doctor.schedule" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime.length > 0 ? (
                                <>
                                    <div className="time-content-btns">
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay =
                                                language === LANGUAGES.VI
                                                    ? item.timeTypeData.ValueVi
                                                    : item.timeTypeData.valueEn;
                                            return (
                                                <button
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                    key={index}
                                                    className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? item.timeTypeData.ValueVi
                                                        : item.timeTypeData.valueEn}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="book-free">
                                        <div className="choose">
                                            {' '}
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                        </div>
                                        <svg
                                            className="btn-hand"
                                            viewBox="0 0 448 512"
                                            preserveAspectRatio="none"
                                            width="14"
                                            fill="#333"
                                            height="16"
                                        >
                                            <path d="M105.6 83.2v86.177a115.52 115.52 0 0 0-22.4-2.176c-47.914 0-83.2 35.072-83.2 92 0 45.314 48.537 57.002 78.784 75.707 12.413 7.735 23.317 16.994 33.253 25.851l.146.131.148.129C129.807 376.338 136 384.236 136 391.2v2.679c-4.952 5.747-8 13.536-8 22.12v64c0 17.673 12.894 32 28.8 32h230.4c15.906 0 28.8-14.327 28.8-32v-64c0-8.584-3.048-16.373-8-22.12V391.2c0-28.688 40-67.137 40-127.2v-21.299c0-62.542-38.658-98.8-91.145-99.94-17.813-12.482-40.785-18.491-62.791-15.985A93.148 93.148 0 0 0 272 118.847V83.2C272 37.765 234.416 0 188.8 0c-45.099 0-83.2 38.101-83.2 83.2m118.4 0v91.026c14.669-12.837 42.825-14.415 61.05 4.95 19.646-11.227 45.624-1.687 53.625 12.925 39.128-6.524 61.325 10.076 61.325 50.6V264c0 45.491-35.913 77.21-39.676 120H183.571c-2.964-25.239-21.222-42.966-39.596-59.075-12.65-11.275-25.3-21.725-39.875-30.799C80.712 279.645 48 267.994 48 259.2c0-23.375 8.8-44 35.2-44 35.2 0 53.075 26.4 70.4 26.4V83.2c0-18.425 16.5-35.2 35.2-35.2 18.975 0 35.2 16.225 35.2 35.2M352 424c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24"></path>
                                        </svg>
                                        <div className="free">
                                            {' '}
                                            <FormattedMessage id="patient.detail-doctor.Schedule-a-free-appointment" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="no-schedule">
                                    {' '}
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BookingModal
                    isOpenModal={this.state.isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime={this.state.dataScheduleTimeModal}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
