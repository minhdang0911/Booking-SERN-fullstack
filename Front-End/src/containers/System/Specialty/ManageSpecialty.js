import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils, USER_ROLE } from '../../../utils';
import { createNewSpecialty } from '../../../services/userService';
import { message } from 'antd';
import Unauthorized from '../Admin/Unauthorized';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        };
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
        });
    };

    hanleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);

            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            message.success('Add new specialty success');
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            });
        } else {
            message.error('Something wrong....');
        }
        console.log('test', this.state);
    };

    render() {
        const { isLoggedIn, userInfo } = this.props;

        if (userInfo.roleId !== USER_ROLE.ADMIN) {
            return <Unauthorized />;
        }
        if (userInfo.roleId == USER_ROLE.ADMIN) {
            return (
                <div className="manage-specialty-container">
                    <div className="ms-title">Quản lý chuyên khoa</div>

                    <div className="add-new-specialty row">
                        <div className="col-6 form-group">
                            <label>Tên chuyên khoa</label>
                            <input
                                className="form-control"
                                type="text"
                                value={this.state.name}
                                onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Ảnh chuyên khoa</label>
                            <input
                                className="form-control-file"
                                type="file"
                                onChange={(event) => this.hanleOnChangeImage(event)}
                            />
                        </div>

                        <div className="col-12">
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn-save-specialty" onClick={() => this.handleSaveNewSpecialty()}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
