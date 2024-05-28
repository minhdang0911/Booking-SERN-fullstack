import React, { Component } from 'react';
import { connect } from 'react-redux';
import './RemedyModal.scss';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { CommonUtils } from '../../../utils';

import { toast } from 'react-toastify';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: '',
        };
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            });
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    hanleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let base64 = reader.result;

                this.setState({
                    imageBase64: base64,
                });
            };
            reader.onerror = (error) => {
                console.error('Error while reading the file:', error);
            };
        }
    };

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    };

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;

        console.log('modal', this.state);
        return (
            <div>
                <Modal centered isOpen={isOpenModal} className={'booking-modal-container'} size="md">
                    <div className="modal-header">
                        <h5 className="modal-title">Gửi hóa đơn khám bệnh thành công</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={closeRemedyModal}>
                            X
                        </button>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email bệnh nhân</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)}
                                />
                            </div>

                            <div className="col-6 form-group">
                                <label>Chọn file đơn thuốc</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    onChange={(event) => this.hanleOnChangeImage(event)}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendRemedy()}>
                            Send
                        </Button>{' '}
                        <Button color="secondary" onClick={closeRemedyModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
