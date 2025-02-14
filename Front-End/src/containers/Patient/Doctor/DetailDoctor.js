import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorDetail.scss';
import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from '../SocialPlugin/Comment';
import { Avatar, Row, Col } from 'antd';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id,
            });
            let res = await getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                });
            } else {
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}
    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;
        let nameVi = '',
            nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.ValueVi},${detailDoctor.lastName} ${detailDoctor.firstName} `;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}  `;
        }

        let currentURL =
            process.env.REACT_APP_IS_LOCALHOST === 1 ? 'https://www.facebook.com/modang0911/' : window.location.href;

        console.log('state', detailDoctor);

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={8}>
                            <div
                                className="intro-doctor"
                                // style={{
                                //     backgroundImage: `url(${
                                //         detailDoctor && detailDoctor.image ? detailDoctor.image : ''
                                //     })`,
                                // }}
                            >
                                <Avatar size={120} src={detailDoctor && detailDoctor.image} />
                                <div className="up">{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                <div className="down">
                                    {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.description && (
                                        <span>{detailDoctor.Markdown.description}</span>
                                    )}
                                </div>
                                <div className="like-share-plugin">
                                    <LikeAndShare dataHref={currentURL} />
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={16}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <DoctorExtraInfor doctorIdFromParent={this.state.currentDoctorId} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML && (
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}></div>
                        )}
                    </div>
                    <div className="comment-doctor">
                        <Comment dataHref={currentURL} width={'100%'} />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
