import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, USER_ROLE } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import TableManageUser from './TableManageUser';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { EditFilled, SaveFilled, UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Col, Input } from 'antd';
import { Select } from 'antd';
import { Tooltip } from 'antd';
import { Modal } from 'antd';
import Unauthorized from './Unauthorized';
const { Option } = Select;

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
            action: '',
            userEditId: '',
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let arrGenders = this.props.genderRedux;

        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;

            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
            });
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
            });
        }

        if (prevProps.listusers !== this.props.listusers) {
            let arrRoles = this.props.roleRedux;
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgUrl: '',
            });
        }
    }

    hanleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let base64 = reader.result;
                console.log('base64', base64);
                const objectUrl = URL.createObjectURL(file);
                this.setState({
                    previewImgUrl: objectUrl,
                    avatar: base64,
                });
            };
            reader.onerror = (error) => {
                console.error('Error while reading the file:', error);
            };
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true,
        });
    };

    handleSaveUser = () => {
        let isValid = this.checkValidataInput();
        if (isValid === false) return;

        let { action } = this.state;
        // Fire redux create user
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }

        // Fire redux edit user
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editAUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                id: this.state.userEditId,
                avatar: this.state.avatar,
            });
        }
    };

    checkValidataInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                Modal.error({
                    title: 'Validation Error',
                    content: `This input is required: ${arrCheck[i]}`,
                    footer: [
                        <Button
                            style={{ backgroundColor: 'red', margin: '0 auto', display: 'flex' }}
                            key="ok"
                            type="primary"
                            onClick={() => Modal.destroyAll()}
                        >
                            OK
                        </Button>,
                    ],
                });
                break;
            }
        }
        return isValid;
    };

    onChangeInput = (event, id) => {
        if (!event || !event.target) {
            console.error('Event or event.target is undefined');
            return;
        }
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }

        console.log('edit form parent', user);
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: '',
            previewImgUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        });
    };

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let { email, password, firstName, lastName, phoneNumber, address, gender, position, role, avatar } = this.state;
        const { isLoggedIn, userInfo } = this.props;

        if (userInfo.roleId !== USER_ROLE.ADMIN) {
            return <Unauthorized />;
        }

        if (userInfo.roleId === USER_ROLE.ADMIN) {
            return (
                <div className="user-redux-container">
                    <div className="title">Learn Redux</div>
                    <div>{isGetGenders === true ? 'Loading genders' : ''}</div>
                    <div className="user-redux-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 my-3">
                                    <FormattedMessage id="manage-user.add" />
                                </div>
                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.email" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        value={email}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'email');
                                        }}
                                        disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                    />
                                </div>
                                <Col span={6}>
                                    <label>
                                        <FormattedMessage id="manage-user.password" />
                                    </label>
                                    <Input.Password
                                        value={password}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'password');
                                        }}
                                        disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                    />
                                </Col>
                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.first-name" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={firstName}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'firstName');
                                        }}
                                    />
                                </div>
                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.last-name" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={lastName}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'lastName');
                                        }}
                                    />
                                </div>
                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.phone-number" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'phoneNumber');
                                        }}
                                    />
                                </div>
                                <div className="col-9">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.address" />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={address}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'address');
                                        }}
                                    />
                                </div>

                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.gender" />
                                    </label>
                                    <select
                                        value={gender}
                                        className="form-control"
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'gender');
                                        }}
                                    >
                                        {genders &&
                                            genders.length > 0 &&
                                            genders.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.position" />
                                    </label>
                                    <select
                                        className="form-control"
                                        value={position}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'position');
                                        }}
                                    >
                                        {positions &&
                                            positions.length > 0 &&
                                            positions.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label>
                                        {' '}
                                        <FormattedMessage id="manage-user.role" />
                                    </label>
                                    <select
                                        className="form-control"
                                        value={role}
                                        onChange={(event) => {
                                            this.onChangeInput(event, 'role');
                                        }}
                                    >
                                        {roles &&
                                            roles.length > 0 &&
                                            roles.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>

                                <div className="col-3">
                                    <label>
                                        <FormattedMessage id="manage-user.image" />
                                    </label>
                                    <div className="preview-img-container">
                                        <input
                                            id="previewimg"
                                            type="file"
                                            hidden
                                            onChange={(event) => this.hanleOnChangeImage(event)}
                                        />
                                        <Tooltip title="Tải ảnh">
                                            <label className="label-upload" htmlFor="previewimg">
                                                <UploadOutlined /> Tải ảnh
                                            </label>
                                        </Tooltip>

                                        <div
                                            className="preview-image"
                                            style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                            onClick={() => this.openPreviewImage()}
                                        ></div>
                                    </div>
                                </div>

                                <div className="col-12 my-3">
                                    <Button
                                        type={this.state.action === CRUD_ACTIONS.EDIT ? 'warning' : 'primary'}
                                        onClick={() => this.handleSaveUser()}
                                        icon={this.state.action === CRUD_ACTIONS.EDIT ? <EditFilled /> : <SaveFilled />}
                                        style={{
                                            color: 'white',
                                            background: this.state.action === CRUD_ACTIONS.EDIT ? '#faad14' : '#1890ff',
                                            borderColor:
                                                this.state.action === CRUD_ACTIONS.EDIT ? '#faad14' : '#1890ff',
                                        }}
                                    >
                                        {this.state.action === CRUD_ACTIONS.EDIT ? (
                                            <FormattedMessage id="manage-user.edit" />
                                        ) : (
                                            <FormattedMessage id="manage-user.save" />
                                        )}
                                    </Button>
                                </div>

                                <div className="col-12">
                                    <TableManageUser
                                        handleEditUserFromParent={this.handleEditUserFromParent}
                                        action={this.state.action}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.isOpen && (
                        <Lightbox
                            mainSrc={this.state.previewImgUrl}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    )}
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listusers: state.admin.users,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUser: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
