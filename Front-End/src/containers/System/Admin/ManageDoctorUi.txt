import React, { Component } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './ManageDoctor.scss';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' },
// ];

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
    }

    buildDataaInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName} `;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }

        return result;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataaInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataaInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
        console.log('handleEditorChange', html, text);
    };

    handleSaveContentMarkdown = () => {
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
        });
        console.log(this.state);
    };

    handleChange = (selectedOption) => {
        this.setState({ selectedOption }, () => console.log(`Option selected:`, this.state.selectedOption));
    };
    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value,
        });
    };

    render() {
        console.log('all doctors', this.state);
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">Tạo thêm thông tin doctor</div>
                <div className="more-infor">
                    <div className="content-left form-group">
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.listDoctors}
                        />
                    </div>
                    <div className="content-right">
                        <label>Thông tin giới thiệu</label>
                        <textarea
                            onChange={(event) => this.handleOnChangeDesc(event)}
                            value={this.state.description}
                            className="form-control"
                            rows="4"
                        ></textarea>
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />
                </div>
                <button onClick={() => this.handleSaveContentMarkdown()} className="save-content-doctor">
                    Lưu thông tin
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
});

const mapDispatchToProps = (dispatch) => ({
    fetchAllDoctors: (id) => dispatch(actions.fetchAllDoctor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
