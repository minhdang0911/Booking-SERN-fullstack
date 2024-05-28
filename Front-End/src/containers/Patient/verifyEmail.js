import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postVerifyBookAppointment } from '../../services/userService';
import { Result, Spin } from 'antd';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss';
import { withRouter } from 'react-router-dom';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
            loading: true,
            countdown: 5,
        };
    }

    componentDidMount() {
        this.verifyAppointment();
    }

    async verifyAppointment() {
        if (this.props.location && this.props.location.search) {
            const urlParams = new URLSearchParams(this.props.location.search);
            const token = urlParams.get('token');
            const doctorId = urlParams.get('doctorId');
            const res = await postVerifyBookAppointment({ token, doctorId });

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                });
                this.startCountdown();
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1,
                    loading: false,
                });
            }
        }
    }

    startCountdown = () => {
        const timer = setInterval(() => {
            this.setState(
                (prevState) => ({
                    countdown: prevState.countdown - 1,
                }),
                () => {
                    if (this.state.countdown === 0) {
                        clearInterval(timer);
                        this.props.history.push('/home');
                    }
                },
            );
        }, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.countdownInterval);
    }

    render() {
        const { statusVerify, errCode, loading, countdown } = this.state;
        const { data } = this.props;
        console.log('data', data);
        return (
            <div className="verify-email-page">
                <HomeHeader />
                <div className="verify-email-container">
                    <Spin spinning={loading}>
                        {statusVerify && (
                            <Result
                                status={errCode === 0 ? 'success' : 'error'}
                                title={errCode === 0 ? 'Xác nhận lịch hẹn thành công' : 'Xác nhận lịch hẹn thất bại'}
                                subTitle={
                                    errCode === 0 ? (
                                        <>
                                            <p>
                                                Lịch hẹn của bạn đã được xác nhận thành công. Bạn sẽ được chuyển về
                                                trang chủ sau {countdown} giây.
                                            </p>
                                        </>
                                    ) : (
                                        'Lịch hẹn không tồn tại hoặc đã được xác nhận trước đó.'
                                    )
                                }
                            />
                        )}
                    </Spin>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(VerifyEmail));
