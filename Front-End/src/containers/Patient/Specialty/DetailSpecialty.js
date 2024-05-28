import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';
import { withRouter } from 'react-router-dom';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import { Select } from 'antd';

const { Option } = Select;

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
        };
    }

    async componentDidMount() {
        document.title = 'Chi tiết chuyên khoa';
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL',
            });

            let resProvince = await getAllCodeService('PROVINCE');

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map((item) => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }

                let dataProvince = resProvince.data;

                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: 'All',
                        type: 'PROVINCE',
                        valueEn: 'ALL',
                        valueVi: 'Toàn quốc',
                    });
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince,
                });
            } else {
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.language !== prevProps.language) {
            document.title = 'Chi tiết chuyên khoa';
        }

        if (this.props.match.params.id !== prevProps.match.params.id) {
            document.title = 'Chi tiết chuyên khoa';
        }
    }

    handleOnChangeSelect = async (value) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = value;

            let res = await getDetailSpecialtyById({
                id: id,
                location: location,
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map((item) => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                });
            } else {
            }
        }
    };

    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
        let { language } = this.props;

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                        )}
                    </div>

                    <div className="search-sp-doctor">
                        <Select defaultValue="All" onChange={this.handleOnChangeSelect}>
                            {listProvince &&
                                listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <Option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>

                    {arrDoctorId &&
                        arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={index}>
                                    <div className="dt-content-left">
                                        <div className="profile-doctor">
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule doctorIdFromParent={item} />
                                        </div>
                                        <div className="doctor-extra-infor">
                                            <DoctorExtraInfor doctorIdFromParent={item} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));
