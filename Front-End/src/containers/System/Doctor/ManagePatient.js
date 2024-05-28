import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import Unauthorized from '../Admin/Unauthorized';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
        };
    }

    async componentDidMount() {
        this.geDataPatient();
    }

    geDataPatient = async () => {
        const { user } = this.props;
        const { currentDate } = this.state;
        const formattedDate = new Date(currentDate).getTime();

        const res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formattedDate,
        });

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
            });
        }
    };

    handleOnChangeDataPicker = (date) => {
        this.setState(
            {
                currentDate: date[0],
            },
            async () => {
                await this.geDataPatient();
            },
        );
    };

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorID,
            patientId: item.patientID,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName,
        };

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
        });
    };

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {},
        });
    };

    sendRemedy = async (dataChildFormModal) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true,
        });
        let res = await postSendRemedy({
            email: dataChildFormModal.email,
            imageBase64: dataChildFormModal.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName,
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false,
            });
            toast.success('Send remedy success');
            this.closeRemedyModal();
            await this.geDataPatient();
        } else {
            this.setState({
                isShowLoading: false,
            });
            toast.error('something wrong');
        }
    };

    render() {
        console.log('patient state', this.state);
        const { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        const { language } = this.props;
        const { isLoggedIn, userInfo } = this.props;
        if (userInfo.roleId !== USER_ROLE.ADMIN && userInfo.roleId !== USER_ROLE.DOCTOR) {
            return <Unauthorized />;
        }
        if (userInfo.roleId == USER_ROLE.ADMIN || userInfo.roleId == USER_ROLE.DOCTOR) {
            return (
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner={
                        <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    }
                    text="Loading ..."
                >
                    <div className="manage-patient-container">
                        <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
                        <div className="manage-patient-body row">
                            <div className="col-4 form-group">
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    className="form-control"
                                    onChange={this.handleOnChangeDataPicker}
                                    value={this.state.currentDate}
                                />
                            </div>

                            <div className="col-12 table-manage-patient">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPatient && dataPatient.length > 0 ? (
                                            dataPatient.map((item, index) => {
                                                const gender =
                                                    language === LANGUAGES.VI
                                                        ? item.patientData.genderData.ValueVi
                                                        : item.patientData.genderData.valueEn;
                                                const time =
                                                    language === LANGUAGES.VI
                                                        ? item.timeTypeDataPatient.ValueVi
                                                        : item.timeTypeDataPatient.valueEn;

                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.patientData.firstName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>
                                                            <button
                                                                className="mp-btn-confirm"
                                                                onClick={() => this.handleBtnConfirm(item)}
                                                            >
                                                                Xác nhận
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No data</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
