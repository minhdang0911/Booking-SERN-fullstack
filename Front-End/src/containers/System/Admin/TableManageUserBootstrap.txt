import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './TableManageUser.scss';

class TableUserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
        };
    }
    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prewState, snapshot) {
        if (prevProps.listusers !== this.props.listusers) {
            this.setState({
                userRedux: this.props.listusers,
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteAUser(user.id);
    };

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user);
    };

    render() {
        let arrUsers = this.state.userRedux;

        return (
            <table id="TableManageUser">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {arrUsers &&
                        arrUsers.length > 0 &&
                        arrUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button
                                            onClick={() => this.handleEditUser(item)}
                                            className="mb-[20px] w-[80px] rounded-md bg-[#1d77f5] py-[8px] text-[14px] font-semibold text-white shadow-[0px_0px_0px_2px_rgba(25,113,238,1),inset_0px_1px_1px_0px_rgba(255,255,255,0.3)] [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] btn-editt"
                                        >
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button
                                            onClick={() => this.handleDeleteUser(item)}
                                            className="mb-[20px] w-[80px] rounded-md bg-[#EB3F3F] py-[8px] text-[14px] font-semibold text-white shadow-[0px_0px_0px_2px_rgba(213,61,61,1),inset_0px_1px_1px_0px_rgba(255,255,255,0.3)] [text-shadow:_0_1px_0_rgb(0_0_0_/_20%)] ml-[20px] btn-deletee"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        );
    }
}

const mapStateToProps = (state) => ({
    listusers: state.admin.users,
});

const mapDispatchToProps = (dispatch) => ({
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUser: (id) => dispatch(actions.deleteAUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableUserManage);
