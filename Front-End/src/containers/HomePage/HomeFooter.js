import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Divider, Input, Button } from 'antd';
import { InstagramOutlined, FacebookOutlined, YoutubeOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormattedMessage } from 'react-intl';

const { Footer } = Layout;

class HomeFooter extends Component {
    state = {
        email: '',
        feedback: '',
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn lên với hiệu ứng mượt
        });
    };

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    };

    handleFeedbackChange = (value) => {
        this.setState({ feedback: value });
    };

    handleSubmit = () => {
        // Code to handle feedback submission
        // You can implement your logic here, like sending feedback to a server
        console.log('Email:', this.state.email);
        console.log('Feedback:', this.state.feedback);
        // Reset form after submission
        this.setState({ email: '', feedback: '' });
    };

    render() {
        return (
            <Footer
                style={{
                    background: 'rgb(239, 239, 239)',
                    padding: '20px 0',
                    color: '#333',
                    marginTop: '10px',
                }}
            >
                <Row justify="center">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <p style={{ textAlign: 'center', marginBottom: 20, fontSize: 16 }}>
                            &copy; {new Date().getFullYear()} <FormattedMessage id="content.content13" />
                        </p>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div style={{ textAlign: 'center' }}>
                            <InstagramOutlined style={{ fontSize: '24px', margin: '0 15px', color: '#c13584' }} />
                            <FacebookOutlined style={{ fontSize: '24px', margin: '0 15px', color: '#1877f2' }} />
                            <YoutubeOutlined style={{ fontSize: '24px', margin: '0 15px', color: '#ff0000' }} />
                        </div>
                    </Col>
                </Row>
                <Divider style={{ margin: '20px 0' }} />
                <Row justify="center" gutter={16}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <h3 style={{ marginBottom: 10 }}>
                                {' '}
                                <FormattedMessage id="content.content14" />
                            </h3>
                            <Input
                                placeholder="Your Email"
                                prefix={<MailOutlined />}
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                            />
                            <ReactQuill
                                theme="snow"
                                value={this.state.feedback}
                                onChange={this.handleFeedbackChange}
                                style={{ marginTop: 10, height: '150px' }}
                                placeholder="Your Message"
                            />
                            <Button
                                type="primary"
                                onClick={this.handleSubmit}
                                style={{ marginTop: 50, backgroundColor: '#ddd' }}
                            >
                                <SendOutlined /> <FormattedMessage id="content.content15" />
                            </Button>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <h3 style={{ marginBottom: 10 }}>
                                {' '}
                                <FormattedMessage id="content.content16" />
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <img
                                    src="https://www.pharmacity.vn/images/Momo.png"
                                    alt="Momo"
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <img
                                    src="https://www.pharmacity.vn/images/Visa.png"
                                    alt="Visa"
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <img
                                    src="https://www.pharmacity.vn/images/MasterCard.png"
                                    alt="Mastercard"
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <img
                                    src="https://www.pharmacity.vn/images/COD.png"
                                    alt="Cash on Delivery"
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <img
                                    src="https://www.pharmacity.vn/images/JCB.png"
                                    alt="JCB"
                                    style={{
                                        width: '50px',
                                        height: 'auto',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Footer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
