import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../Header/Header';
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { message } from 'antd';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';
import Unauthorized from '../Admin/Unauthorized';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors || prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataaInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false }));
                console.log('data', data);
            }
            this.setState({
                rangeTime: data,
            });
        }
    }

    buildDataaInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName} `;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }

        return result;
    };

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    };

    handleOnChangeDataPicker = (date) => {
        this.setState({
            currentDate: date[0],
        });
    };

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });

            this.setState({
                rangeTime: rangeTime,
            });
        }
    };

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            message.error('Invalid date');
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            message.error('Invalid selected doctor!');
            return;
        }

        let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter((item) => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((time) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = time.keyMap;
                    result.push(object);
                });
            } else {
                message.error('Invalid selected time!');
                return;
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate,
        });

        if (res && res.errCode === 0) {
            message.success('Save Infor Success');
        } else {
            message.error('Save failed');
        }

        console.log('result', result);
        console.log('check savebulk', res);
    };

    render() {
        const { isLoggedIn, userInfo } = this.props;
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        if (userInfo.roleId !== USER_ROLE.ADMIN && userInfo.roleId !== USER_ROLE.DOCTOR) {
            return <Unauthorized />;
        }

        if (userInfo.roleId == USER_ROLE.ADMIN || userInfo.roleId == USER_ROLE.DOCTOR) {
            return (
                <div className="manage-schedule-container">
                    <div className="m-s-title">
                        <FormattedMessage id="manage-schedule.title" />
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="manage-schedule.choose-doctor" />
                                </label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    {' '}
                                    <FormattedMessage id="manage-schedule.choose-date" />
                                </label>
                                <DatePicker
                                    className="form-control"
                                    onChange={this.handleOnChangeDataPicker}
                                    value={this.state.currentDate}
                                    minDate={yesterday}
                                />
                            </div>
                            <div className="col-12 pick-hour-container">
                                {rangeTime &&
                                    rangeTime.length > 0 &&
                                    rangeTime.map((item, index) => {
                                        return (
                                            <button
                                                onClick={() => this.handleClickBtnTime(item)}
                                                key={index}
                                                className={
                                                    item.isSelected === true
                                                        ? 'btn btn-schedule active'
                                                        : 'btn btn-schedule'
                                                }
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </button>
                                        );
                                    })}
                            </div>
                            <div className="col-12">
                                <button onClick={this.handleSaveSchedule} className="btn btn-primary btn-save-schedule">
                                    {' '}
                                    <FormattedMessage id="manage-schedule.save" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
