import React, { Component } from 'react';
import './Content.scss';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
class Content extends Component {
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    };
    render() {
        return (
            <section id="promise" className="bg-white">
                <div className="custom-max-width mx-auto px-4 py-3 md:py-4">
                    <div className="grid grid-cols-12 gap-px p-6 md:p-8 bg-primary rounded-2xl">
                        <div className="col-span-12 lg:col-span-4 flex items-center">
                            <p className="font-bold font-serif md:text-xl text-white mb-6 md:mb-0">
                                <FormattedMessage id="content.content1" />
                            </p>
                        </div>
                        <a
                            onClick={this.returnToHome}
                            className="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
                        >
                            <img
                                width="100"
                                height="100"
                                alt="Biên soạn bởi Bác sĩ và Dược sĩ"
                                src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis.svg"
                            />
                            <h3 className="font-medium text-base text-white md:text-center">
                                <FormattedMessage id="content.content2" />
                                <br />
                                <FormattedMessage id="content.content3" />
                            </h3>
                        </a>
                        <a
                            onClick={this.returnToHome}
                            className="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
                        >
                            <img
                                width="100"
                                height="100"
                                alt="Chính sách biên tập nội dung minh bạch"
                                src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis-2.svg"
                            />
                            <h3 className="font-medium text-base text-white md:text-center">
                                <FormattedMessage id="content.content4" />
                                <br />
                                <FormattedMessage id="content.content5" />
                            </h3>
                        </a>
                        <a
                            onClick={this.returnToHome}
                            className="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
                        >
                            <img
                                width="100"
                                height="100"
                                alt="Chính sách quảng cáo"
                                src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis-3.svg"
                            />
                            <h3 className="font-medium text-base text-white md:text-center">
                                <FormattedMessage id="content.content6" />
                                <br />
                                <FormattedMessage id="content.content7" />
                            </h3>
                        </a>
                        <a
                            href="http://localhost:3000/home"
                            className="col-span-12 md:col-span-3 lg:col-span-2 flex gap-1 md:flex-col md:justify-center items-center"
                        >
                            <img
                                width="100"
                                height="100"
                                alt="Chính sách bảo mật"
                                src="https://cdn.youmed.vn/wp-content/themes/youmed/images/promis-4.svg"
                            />
                            <h3 className="font-medium text-base text-white md:text-center">
                                <FormattedMessage id="content.content8" />
                                <br />
                                <FormattedMessage id="content.content9" />
                            </h3>
                        </a>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {};

const mapDispatchToProps = (dispatch) => {};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Content));
