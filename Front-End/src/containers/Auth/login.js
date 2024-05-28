import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { handleLoginApi } from '../../services/userService';
import * as actions from '../../store/actions';
import './Login.scss';
import Register from './Register';
import { USER_ROLE, path } from '../../utils';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            userInfoList: [],
            isShowPassword: false,
            errMessage: '',
        };
    }

    handleChangeUsername = (event) => {
        this.setState({
            username: event.target.value,
        });
    };

    handleChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };

    handleLogin = async () => {
        this.setState({
            errMessage: '',
        });
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                console.log('login success');
            }

            if (data.user.roleId === USER_ROLE.PATIENT) {
                this.props.navigate(path.HOMEPAGE);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message,
                    });
                }
            }
            console.log(error.response);
        }
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    };

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    render() {
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 login-text">Đăng nhập</div>
                        <div className="col-12 form-group login-input">
                            <label>Tên đăng nhập:</label>
                            <input
                                value={this.state.username}
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                onChange={(event) => this.handleChangeUsername(event)}
                                onKeyPress={(event) => this.handleKeyPress(event)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Mật khẩu:</label>
                            <div className="custom-input-password">
                                <input
                                    value={this.state.password}
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    onChange={(event) => this.handleChangePassword(event)}
                                    onKeyPress={(event) => this.handleKeyPress(event)}
                                />
                                <span onClick={this.handleShowHidePassword}>
                                    <i className={this.state.isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>

                        <div className="col-12" style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12 ">
                            <button className="btn-login" onClick={this.handleLogin}>
                                Đăng nhập
                            </button>
                        </div>

                        <div className="col-12">
                            <span className="forgot-password">Quên mật khẩu</span>
                        </div>
                        <div className="col-12 text-center mt-3">
                            <span className="text-other-login">Hoặc đăng nhập với</span>
                        </div>
                        <div className="col-12 social-login">
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div>
                        <div className="col-12 text-center mt-3">
                            <span className="text-other-login">Nếu bạn chưa có tài khoản? </span>
                            <Link to="/register">Đăng ký ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
