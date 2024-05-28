import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, Upload, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as actions from '../../store/actions';
import './Register.scss';
import { withRouter } from 'react-router-dom';

const { Option } = Select;

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            captchaPassed: false, // State to track if captcha is passed
        };
    }

    handleRegister = (values) => {
        // Chuyển đổi chữ cái đầu tiên của first name và last name thành chữ in hoa
        values.firstName = this.capitalizeFirstLetter(values.firstName);
        values.lastName = this.capitalizeFirstLetter(values.lastName);

        const { fileList } = this.state;
        const avatar = fileList.length > 0 ? fileList[0].thumbUrl : '';

        const { email, password, firstName, lastName, phoneNumber, address, gender } = values;

        this.props
            .createNewUser({
                email,
                password,
                firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
                lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
                phoneNumber,
                address,
                gender,
                roleId: 'R3', // Always set roleId to R3 for registration
            })
            .then(() => {
                // Chuyển hướng người dùng về trang đăng nhập sau khi đăng ký thành công
                this.props.history.push('/login');
            });
    };

    handleCaptchaComplete = () => {
        // Function to handle captcha completion
        this.setState({ captchaPassed: true });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });
    capitalizeFirstLetter = (str) => {
        return str.replace(/\b\w/g, function (match) {
            return match.toUpperCase();
        });
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;

        return (
            <div className="register-container">
                <div className="title">Register</div>
                <Form name="register" onFinish={this.handleRegister} scrollToFirstError>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                            {
                                pattern: /^[a-zA-Z0-9._%+-]+@(?!.*(?:\.co$))(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                                message: 'Please enter a valid email address!',
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui nhập nhập mật khẩu',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu xác nhận',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên',
                                whitespace: true,
                                pattern: /^[^\d]+$/, // không chứa số
                            },
                        ]}
                    >
                        <Input placeholder="Họ" />
                    </Form.Item>

                    <Form.Item
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ',
                                whitespace: true,
                                pattern: /^[^\d]+$/, // không chứa số
                            },
                        ]}
                    >
                        <Input placeholder="tên" />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                                pattern: /^0\d{9}$/, // bắt đầu bằng số 0 và theo sau bởi 9 số khác
                            },
                        ]}
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập địa chỉ!',
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Địa chỉ" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        rules={[
                            {
                                required: true,
                                message: 'Please select your gender!',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Option value="M">Nam</Option>
                            <Option value="F">Nữ </Option>
                            <Option value="O">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    createNewUser: (userData) => dispatch(actions.createNewUser(userData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));
