import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Table } from 'antd'; // Import Table từ antd
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import các icon từ antd
import ModalEditUser from './ModalEditUser';
import { message } from 'antd';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            confirmDeleteVisible: false,
            deletingUser: null,
            isOpenModalEditUser: false,
            userEdit: {},
        };
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users,
            });
        }
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        });
    };

    toggleUserModal = () => {
        this.setState((prevState) => ({
            isOpenModalUser: !prevState.isOpenModalUser,
        }));
    };

    toggleUserEditModal = () => {
        this.setState((prevState) => ({
            isOpenModalEditUser: !prevState.isOpenModalEditUser,
        }));
    };

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.message);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                });
                emitter.emit('EVENT_CLEAR_MODAL_DATA', { id: 'your id' });
            }
        } catch (e) {
            console.log(e);
        }
    };

    showDeleteConfirm = (user) => {
        this.setState({
            confirmDeleteVisible: true,
            deletingUser: user,
        });
    };

    handleDeleteUser = async () => {
        const { deletingUser } = this.state;
        try {
            let response = await deleteUserService(deletingUser.id);
            if (response && response.errCode === 0) {
                await this.getAllUsersFromReact();
                message.success('User deleted successfully'); // Hiển thị toast khi xóa thành công
            } else {
                alert(response.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
        this.setState({
            confirmDeleteVisible: false,
            deletingUser: null,
        });
    };

    handleCancelDelete = () => {
        this.setState({
            confirmDeleteVisible: false,
            deletingUser: null,
        });
    };

    handleEditUser = (user) => {
        console.log('check user', user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        });
    };

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false,
                });
                await this.getAllUsersFromReact();
            } else {
                alert(res.errCode);
            }
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        const { arrUsers, confirmDeleteVisible, isOpenModalUser } = this.state;

        const columns = [
            // Định nghĩa cột cho bảng
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'FirstName', dataIndex: 'firstName', key: 'firstName' },
            { title: 'LastName', dataIndex: 'lastName', key: 'lastName' },
            { title: 'Address', dataIndex: 'address', key: 'address' },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button
                            type="primary"
                            style={{ backgroundColor: 'white', color: 'black' }}
                            icon={<EditOutlined />}
                            onClick={() => this.handleEditUser(record)}
                        />

                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => this.showDeleteConfirm(record)}
                        />
                    </span>
                ),
            },
        ];

        return (
            <div className="users-container">
                <ModalUser
                    isOpen={isOpenModalUser}
                    toggleFormParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />

                {this.state.isOpenModalEditUser && (
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFormParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                        // createNewUser={this.createNewUser}
                    />
                )}

                <div className="title text-center">MANAGE USERS</div>
                <div className="button-add-user">
                    <Button
                        type="primary"
                        onClick={this.handleAddNewUser}
                        style={{
                            backgroundColor: '#0071ba',
                            borderColor: '#0071ba',
                            marginLeft: '40px',
                            padding: '0 16px',
                        }}
                    >
                        <i className="fas fa-user-plus btn-add" style={{ marginRight: '8px' }}></i> Add new Users
                    </Button>
                </div>
                <div className="users-table">
                    <Table dataSource={arrUsers} columns={columns} />
                </div>
                <Modal
                    title="Confirm"
                    visible={confirmDeleteVisible}
                    onOk={this.handleDeleteUser}
                    onCancel={this.handleCancelDelete}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ style: { backgroundColor: '#fff', color: '#000', borderColor: '#000' } }}
                >
                    <p>Are you sure you want to delete this user?</p>
                </Modal>
            </div>
        );
    }
}

export default connect()(UserManage);
