import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/images/logo.svg';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';
import { UserOutlined, LoginOutlined, DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import anime from 'animejs/lib/anime.es.js';
import * as actions from '../../store/actions';
import { getAllSpecialty } from '../../services/userService';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholderText: '',
            selectedLanguage: null,
            keyword: '',
            specialties: [],
        };
    }

    async componentDidMount() {
        this.typingAnimation();
        await this.fetchSpecialties();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            this.typingAnimation();
        }
    }

    fetchSpecialties = async () => {
        try {
            const res = await getAllSpecialty();
            if (res && res.errCode === 0) {
                this.setState({
                    specialties: res.data,
                });
            }
            console.log('header res', res);
        } catch (error) {
            console.error('Error fetching specialties:', error);
        }
    };

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
        this.setState({ selectedLanguage: language });
    };

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    };

    redirectToLogin = () => {
        if (this.props.history) {
            this.props.history.push(`/login`);
        }
    };

    typingAnimation = () => {
        const { language } = this.props;
        let placeholderTexts = [];

        if (language === LANGUAGES.VI) {
            placeholderTexts = [
                'T',
                'Tì',
                'Tìm',
                'Tìm ',
                'Tìm c',
                'Tìm ch',
                'Tìm chu',
                'Tìm chuy',
                'Tìm chuyê',
                'Tìm chuyên',
                'Tìm chuyên ',
                'Tìm chuyên k',
                'Tìm chuyên kh',
                'Tìm chuyên kho',
                'Tìm chuyên khoa',
                'Tìm chuyên khoa ',
                'Tìm chuyên khoa k',
                'Tìm chuyên khoa kh',
                'Tìm chuyên khoa khá',
                'Tìm chuyên khoa khám',
                'Tìm chuyên khoa khám ',
                'Tìm chuyên khoa khám b',
                'Tìm chuyên khoa khám bệ',
                'Tìm chuyên khoa khám bện',
                'Tìm chuyên khoa khám bệnh',
            ];
        } else if (language === LANGUAGES.EN) {
            placeholderTexts = [
                'F',
                'Fi',
                'Fin',
                'Find',
                'Find ',
                'Find a',
                'Find a ',
                'Find a m',
                'Find a me',
                'Find a med',
                'Find a medi',
                'Find a medic',
                'Find a medica',
                'Find a medical',
                'Find a medical ',
                'Find a medical s',
                'Find a medical sp',
                'Find a medical spe',
                'Find a medical spec',
                'Find a medical speci',
                'Find a medical special',
                'Find a medical speciali',
                'Find a medical specialis',
                'Find a medical specialist',
            ];
        }

        // Loại bỏ ký tự không mong muốn từ chuỗi placeholder
        placeholderTexts = placeholderTexts.map((text) => text.replace('0', ''));

        anime({
            targets: '.searchInput',
            placeholder: placeholderTexts,
            easing: 'linear',
            loop: true,
            direction: 'alternate',
            duration: 3000,
        });
    };

    handleSearchInputChange = (e) => {
        this.setState({ keyword: e.target.value });
    };

    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`);
    };

    render() {
        const { selectedLanguage, keyword, specialties } = this.state;
        const { userInfo } = this.props;

        const languageMenu = (
            <Menu>
                <Menu.Item key={LANGUAGES.VI} onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                    <span>
                        <img
                            src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FVN.bda9ffec.svg&w=32&q=75"
                            alt="Vietnamese"
                            style={{ width: '32px', height: '21px', marginRight: '5px' }}
                        />{' '}
                        Tiếng Việt
                    </span>
                </Menu.Item>
                <Menu.Item key={LANGUAGES.EN} onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                    <span>
                        <img
                            src="https://w.ladicdn.com/s350x350/63e1d8aeecdb6c0012861212/image-1404-20240118085646-jlr47.png"
                            alt="English"
                            style={{ width: '32px', height: '21px', marginRight: '5px' }}
                        />{' '}
                        English
                    </span>
                </Menu.Item>
            </Menu>
        );

        const languageButtonText = selectedLanguage === LANGUAGES.VI ? 'Tiếng Việt' : 'Tiếng Anh';

        // Lọc danh sách chuyên khoa dựa trên từ khóa tìm kiếm
        const filteredSpecialties = specialties.filter((specialty) =>
            specialty.name.toLowerCase().includes(keyword.toLowerCase()),
        );

        console.log('filteredSpecialties', filteredSpecialties);

        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars"></i>
                            <img className="header-logo" src={logo} onClick={this.returnToHome} alt="logo" />
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <div>
                                    <b>
                                        <FormattedMessage id="homeheader.speciality" />
                                    </b>
                                </div>
                                <div className="subs-title">
                                    <FormattedMessage id="homeheader.searchdoctor" />
                                </div>
                            </div>
                            <div className="child-content">
                                <div>
                                    <b>
                                        <FormattedMessage id="homeheader.health-facility" />
                                    </b>
                                </div>
                                <div className="subs-title">
                                    <FormattedMessage id="homeheader.select-room" />
                                </div>
                            </div>
                            <div className="child-content">
                                <div>
                                    <b>
                                        <FormattedMessage id="homeheader.doctor" />
                                    </b>
                                </div>
                                <div className="subs-title">
                                    <FormattedMessage id="homeheader.select-doctor" />
                                </div>
                            </div>
                            <div className="child-content">
                                <div>
                                    <b>
                                        <FormattedMessage id="homeheader.fee" />
                                    </b>
                                </div>
                                <div className="subs-title">
                                    <FormattedMessage id="homeheader.check-health" />
                                </div>
                            </div>
                        </div>
                        <div className="right-content">
                            <div className="support">
                                <i className="fas fa-question-circle"></i>
                                <FormattedMessage id="homeheader.support" />
                            </div>

                            <Dropdown overlay={languageMenu} className="dropdown">
                                <Button>
                                    {languageButtonText} <DownOutlined />
                                </Button>
                            </Dropdown>

                            {!this.props.isLoggedIn ? (
                                <div className="user-info" onClick={this.redirectToLogin}>
                                    <UserOutlined className="login-icon" />
                                </div>
                            ) : (
                                <div className="user-info">
                                    <span className="welcome">
                                        <FormattedMessage id="homeheader.welcome" />
                                        {userInfo && userInfo.firstName}{' '}
                                    </span>
                                    <LoginOutlined className="logout-icon" onClick={this.props.processLogout} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="home-header-banner">
                    <div className="content-up">
                        <div className="title1">
                            <FormattedMessage id="banner.title1" />
                        </div>
                        <div className="title2">
                            <FormattedMessage id="banner.title2" />
                        </div>
                        <div className="search">
                            <i className="fas fa-search"></i>
                            <input
                                className="searchInput"
                                type="text"
                                placeholder={<FormattedMessage id="banner.placeholder" />}
                                value={keyword}
                                onChange={this.handleSearchInputChange}
                            />
                            {keyword && (
                                <div className={`search-results ${filteredSpecialties.length > 0 ? 'show' : ''}`}>
                                    {filteredSpecialties.length > 0 ? (
                                        filteredSpecialties.map((specialty) => (
                                            <div
                                                className="option-child"
                                                key={specialty.id}
                                                onClick={() => this.handleViewDetailSpecialty(specialty)}
                                            >
                                                <div className="icon-child">
                                                    <img src={specialty.image} alt={specialty.name} />
                                                </div>
                                                <div className="text-child">{specialty.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-results">
                                            <FormattedMessage id="homeheader.noResults" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="content-down"></div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
