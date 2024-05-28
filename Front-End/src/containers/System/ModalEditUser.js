import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            confirmModalVisible: false, // Thêm trạng thái để quản lý hiển thị của hộp thoại xác nhận
        };
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hardcode  ',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            });
        }
        console.log('didmount edit modal', this.props.currentUser);
    }

    toggle = () => {
        this.props.toggleFormParent();
    };

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState(
            {
                ...copyState,
            },
            () => {
                // console.log(this.state);
            },
        );
    };

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                message.error('Missing parameter:' + arrInput[i]);
                break;
            }
        }
        return isValid;
    };

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            // Hiển thị hộp thoại xác nhận trước khi sửa
            this.setState({
                confirmModalVisible: true,
            });
        }
    };

    confirmSaveUser = () => {
        // Call API or dispatch action to edit user
        this.props
            .editUser(this.state)
            .then((response) => {
                if (response && response.errCode === 0) {
                    message.success('User edited successfully!');
                    this.toggle(); // Đóng modal sau khi sửa thành công
                } else {
                    message.success('User edited successfully!');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                message.error('An error occurred while editing user!');
            });

        // Ẩn hộp thoại xác nhận sau khi nhấn nút xác nhận
        this.setState({
            confirmModalVisible: false,
        });
    };

    cancelSaveUser = () => {
        // Ẩn hộp thoại xác nhận nếu người dùng chọn hủy
        this.setState({
            confirmModalVisible: false,
        });
    };

    render() {
        return (
            <>
                <Modal
                    visible={this.state.confirmModalVisible}
                    onCancel={this.cancelSaveUser}
                    onOk={this.confirmSaveUser}
                    title="Confirm"
                    okText="Confirm"
                    cancelText="Cancel"
                    okButtonProps={{ style: { backgroundColor: '#fff', color: '#000', borderColor: '#000' } }}
                >
                    <p>Are you sure you want to edit this user?</p>
                </Modal>

                <Modal
                    visible={this.props.isOpen}
                    onCancel={this.toggle}
                    title={<div style={{ textAlign: 'center' }}>Edit User</div>}
                    footer={[
                        <Button key="cancel" onClick={this.toggle}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleSaveUser}
                            style={{ background: '#1677ff' }}
                        >
                            Save Changes
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="Email">
                            <Input disabled value={this.state.email} />
                        </Form.Item>
                        <Form.Item label="Password">
                            <Input.Password disabled value={this.state.password} />
                        </Form.Item>
                        <Form.Item label="First name">
                            <Input
                                value={this.state.firstName}
                                onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                            />
                        </Form.Item>
                        <Form.Item label="Last name">
                            <Input
                                value={this.state.lastName}
                                onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                            />
                        </Form.Item>
                        <Form.Item label="Address">
                            <Input
                                value={this.state.address}
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
