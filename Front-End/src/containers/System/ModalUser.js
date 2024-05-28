import React, { Component } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { emitter } from '../../utils/emitter';

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            confirmModalVisible: false,
            errors: {}, 
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
            });
        });
    }

    toggle = () => {
        this.props.toggleFormParent();
    };

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    checkValidateInput = () => {
        let isValid = true;
        let errors = {};

      
        const errorMessages = {
            email: 'Email is required',
            password: 'Password is required',
            firstName: 'First name is required',
            lastName: 'Last name is required',
            address: 'Address is required',
        };

        // Kiểm tra các trường thông tin
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                errors[arrInput[i]] = errorMessages[arrInput[i]];
            }
        }

        // Cập nhật state với thông tin lỗi
        this.setState({ errors });

        return isValid;
    };

    showConfirmModal = () => {
        this.setState({ confirmModalVisible: true });
    };

    hideConfirmModal = () => {
        this.setState({ confirmModalVisible: false });
    };

    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid) {
            this.showConfirmModal();
        }
    };

    confirmAddUser = () => {
        // Call API or dispatch action to add user
        this.props.createNewUser(this.state);
        this.hideConfirmModal();
        message.success('User added successfully'); 
    };

    render() {
        return (
            <>
                <Modal
                    visible={this.props.isOpen}
                    onCancel={this.toggle}
                    title={<div style={{ textAlign: 'center' }}>Add new User</div>}
                    footer={[
                        <Button key="cancel" onClick={this.toggle}>
                            Close
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleAddNewUser}
                            style={{ background: '#1677ff' }}
                        >
                            Add new user
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item
                            label="Email"
                            validateStatus={this.state.errors.email ? 'error' : ''}
                            help={this.state.errors.email}
                        >
                            <Input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, 'email');
                                }}
                                value={this.state.email}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            validateStatus={this.state.errors.password ? 'error' : ''}
                            help={this.state.errors.password}
                        >
                            <Input.Password
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, 'password');
                                }}
                                value={this.state.password}
                            />
                        </Form.Item>
                        <Form.Item
                            label="First name"
                            validateStatus={this.state.errors.firstName ? 'error' : ''}
                            help={this.state.errors.firstName}
                        >
                            <Input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, 'firstName');
                                }}
                                value={this.state.firstName}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Last name"
                            validateStatus={this.state.errors.lastName ? 'error' : ''}
                            help={this.state.errors.lastName}
                        >
                            <Input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, 'lastName');
                                }}
                                value={this.state.lastName}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            validateStatus={this.state.errors.address ? 'error' : ''}
                            help={this.state.errors.address}
                        >
                            <Input
                                type="text"
                                onChange={(event) => {
                                    this.handleOnChangeInput(event, 'address');
                                }}
                                value={this.state.address}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={this.state.confirmModalVisible}
                    onCancel={this.hideConfirmModal}
                    title="Confirmation"
                    footer={[
                        <Button key="cancel" onClick={this.hideConfirmModal}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.confirmAddUser}
                            style={{ background: '#1677ff' }}
                        >
                            Confirm
                        </Button>,
                    ]}
                >
                    <p>Are you sure you want to add this user?</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
