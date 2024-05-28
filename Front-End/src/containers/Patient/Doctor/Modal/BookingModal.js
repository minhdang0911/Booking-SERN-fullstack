import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BookingModal.scss';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import { postPatientBooking } from '../../../../services/userService';
import { Modal, Input, Button, DatePicker, notification } from 'antd';
import { css } from '@emotion/react';
import { CircleLoader } from 'react-spinners';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';

import moment from 'moment';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: null,
            selectedGender: '',
            doctorId: '',
            genders: [],
            timeType: '',
            loading: false,
            emailError: false,
            fullNameError: false,
            phoneNumberError: false,
            birthdayError: false,
        };
    }

    updateStateFromUserInfo = () => {
        const { userInfo } = this.props;
        if (userInfo) {
            const { firstName, lastName, email } = userInfo;
            const fullName = `${firstName} `;
            this.setState({ fullName, email });
        }
    };

    async componentDidMount() {
        this.props.getGenders();
    }

    componentDidUpdate(prevProps) {
        const { isOpenModal } = this.props;
        if (isOpenModal && !prevProps.isOpenModal) {
            this.updateStateFromUserInfo();
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            });
        }
    }

    buildDataGender = (data) => {
        return data.map((item) => ({
            label: item.valueVi,
            value: item.keyMap,
        }));
    };

    capitalizeFirstLetter = (str) => {
        // Loại bỏ các ký tự số
        const withoutNumbers = str.replace(/[0-9]/g, '');

        // Chuyển đổi chữ cái đầu tiên của mỗi từ thành chữ in hoa
        const capitalized = withoutNumbers.replace(/(^|\s)\S/g, function (match) {
            return match.toUpperCase();
        });

        return capitalized;
    };

    handleOnChangeInput = (e, id) => {
        let value = e.target.value;
        this.setState({ [id]: value });

        // Kiểm tra email
        if (id === 'email') {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|edu\.com|gmail\.vn|(?:(?:[a-zA-Z0-9-]+\.)+)(?:com))$/;
            if (!emailRegex.test(value)) {
                this.setState({ emailError: true });
            } else {
                this.setState({ emailError: false });
            }
        }

        // Kiểm tra số điện thoại
        if (id === 'phoneNumber') {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(value)) {
                this.setState({ phoneNumberError: true });
            } else {
                this.setState({ phoneNumberError: false });
            }
        }

        // Kiểm tra và tự động viết hoa chữ cái đầu của Tên
        // Kiểm tra và tự động viết hoa chữ cái đầu của Tên
        if (id === 'fullName') {
            value = this.capitalizeFirstLetter(value);
        }

        // Cập nhật state của input hiện tại
        this.setState({ [id]: value });
    };

    handleOnChangeDataPicker = (date, dateString) => {
        if (dateString) {
            const selectedDate = moment(dateString, 'YYYY-MM-DD', true); // Chuyển đổi dateString thành một đối tượng Moment
            if (selectedDate.isValid()) {
                this.setState({ birthday: selectedDate, birthdayError: false });

                // Kiểm tra tuổi >= 18
                const eighteenYearsAgo = moment().subtract(18, 'years').startOf('day');

                if (moment().diff(selectedDate, 'years') < 18) {
                    this.setState({ birthdayError: true });
                }
            } else {
                // Xử lý trường hợp dateString không hợp lệ
                console.error('Ngày không hợp lệ:', dateString);
                this.setState({ birthdayError: true });
            }
        } else {
            // Xử lý trường hợp dateString trống
            this.setState({ birthdayError: true });
        }
    };

    handleChangeSelect = (value) => {
        this.setState({ selectedGender: value });
    };

    buildTimeBooking = (dataTime) => {
        const { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            const time = language === LANGUAGES.VI ? dataTime.timeTypeData.ValueVi : dataTime.timeTypeData.valueEn;
            const date = moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY');
            return `${time} - ${date}`;
        }
        return '';
    };

    buildDoctorName = (dataTime) => {
        const { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            const name =
                language === LANGUAGES.VI
                    ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                    : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
            return name;
        }
        return '';
    };

    handleComfirmBooking = async () => {
        const { fullName, phoneNumber, email, address, reason, birthday, selectedGender } = this.state;

        // Kiểm tra ngày sinh
        const eighteenYearsAgo = moment().subtract(18, 'years');
        if (moment(birthday).isAfter(eighteenYearsAgo)) {
            this.setState({ birthdayError: true });
            return;
        } else {
            this.setState({ birthdayError: false });
        }

        // Kiểm tra email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|edu\.com|gmail\.vn|(?:[a-zA-Z0-9-]+\.)+com)$/;

        if (!emailRegex.test(email)) {
            this.setState({ emailError: true });
            return;
        } else {
            this.setState({ emailError: false });
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            this.setState({ phoneNumberError: true });
            return;
        } else {
            this.setState({ phoneNumberError: false });
        }

        // Kiểm tra và tự động viết hoa chữ cái đầu của Tên
        const capitalizedFullName = fullName.replace(/\b\w/g, (char) => char.toUpperCase());
        this.setState({ fullName: capitalizedFullName });

        // Gọi API đặt lịch và xử lý kết quả
        const date = birthday ? birthday.toDate() : null;
        const timeString = this.buildTimeBooking(this.props.dataTime);
        const doctorName = this.buildDoctorName(this.props.dataTime);
        this.setState({ loading: true }); // Bắt đầu hiển thị loading
        const res = await postPatientBooking({
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            date: this.props.dataTime.date,
            birthday: date ? date.getTime() : null,
            selectedGender: selectedGender.value,
            doctorId: this.props.dataTime.doctorId,
            timeType: this.props.dataTime.timeType,
            language: this.props.language,
            timeString,
            doctorName,
        });

        if (res && res.errCode === 0) {
            notification.success({
                message: 'Booking Success',
                description: 'Your appointment has been successfully booked.',
                placement: 'bottomRight',
            });
            this.props.closeBookingModal();
        } else {
            notification.error({
                message: 'Booking Error',
                description: 'There was an error while booking a new appointment.',
                placement: 'bottomRight',
            });
        }
        this.setState({ loading: false }); // Dừng hiển thị loading
    };

    render() {
        const { isOpenModal, closeBookingModal, dataTime, userInfo } = this.props;
        const { emailError, fullNameError, phoneNumberError, birthdayError, selectedGender } = this.state;
        console.log('   selectedGender', selectedGender);
        return (
            <Modal
                centered
                visible={isOpenModal}
                onCancel={closeBookingModal}
                footer={null}
                className={'booking-modal-container'}
                size="lg"
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor
                                doctorId={dataTime?.doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.fullname" />
                                </label>
                                <Input
                                    value={this.state.fullName}
                                    onChange={(e) => this.handleOnChangeInput(e, 'fullName')}
                                    className={fullNameError ? 'error' : ''}
                                />
                                {fullNameError && (
                                    <span className="error-message" style={{ color: 'red' }}>
                                        <FormattedMessage id="patient.error.error-fullname" />
                                    </span>
                                )}
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phonenumber" />
                                </label>
                                <Input
                                    value={this.state.phoneNumber}
                                    onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')}
                                    className={phoneNumberError ? 'error' : ''}
                                />
                                {phoneNumberError && (
                                    <span className="error-message" style={{ color: 'red' }}>
                                        <FormattedMessage id="patient.error.error-phone" />
                                    </span>
                                )}
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email" />
                                </label>
                                <Input
                                    value={this.state.email}
                                    onChange={(e) => this.handleOnChangeInput(e, 'email')}
                                    className={emailError ? 'error' : ''}
                                />
                                {emailError && (
                                    <span className="error-message" style={{ color: 'red' }}>
                                        <FormattedMessage id="patient.error.error-email" />
                                    </span>
                                )}
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <Input
                                    value={this.state.address}
                                    onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <Input
                                    value={this.state.reason}
                                    onChange={(e) => this.handleOnChangeInput(e, 'reason')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birthday" />
                                </label>
                                <DatePicker
                                    className={`form-control ${birthdayError ? 'error' : ''}`}
                                    onChange={this.handleOnChangeDataPicker}
                                    value={this.state.birthday}
                                />
                                {birthdayError && (
                                    <span className="error-message" style={{ color: 'red' }}>
                                        <FormattedMessage id="patient.error.error-date" />
                                    </span>
                                )}
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.gender" />
                                </label>
                                <Select
                                    value={this.state.selectedGender}
                                    options={this.state.genders}
                                    onChange={this.handleChangeSelect}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <Button type="primary" onClick={this.handleComfirmBooking}>
                            <FormattedMessage id="patient.booking-modal.confirm" />
                        </Button>
                        <Button onClick={closeBookingModal}>
                            <FormattedMessage id="patient.booking-modal.cancel" />
                        </Button>
                    </div>
                    <div className="loader-container">
                        <CircleLoader loading={this.state.loading} css={override} size={30} />
                    </div>
                </div>
            </Modal>
        );
    }
}

const override = css`
    display: block;
    margin: 0 auto;
`;

const mapStateToProps = (state) => ({
    language: state.app.language,
    genders: state.admin.genders,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    getGenders: () => dispatch(actions.fetchGenderStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
