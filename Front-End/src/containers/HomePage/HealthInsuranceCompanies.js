import React, { Component } from 'react';
import styled from 'styled-components';
import times from 'lodash/times';
import Marquee from 'react-marquee-slider';
import { withSize } from 'react-sizeme';
import { nanoid } from 'nanoid';
import FullWidth from './FullWidth';
import { FormattedMessage } from 'react-intl';

const Photo = styled.img`
    width: ${(props) => props.scale * 260}px;
    height: ${(props) => props.scale * 170}px;
    border-radius: 4px;
    box-shadow: 0 7px 20px 0 rgba(0, 0, 0, 0.12);
    object-fit: cover;
    object-position: top;

    margin-left: ${(props) => (props.offset === 'true' ? props.scale * 7 : props.scale * 87)}px;
    margin-right: ${(props) => (props.offset === 'true' ? props.scale * 80 : 0)}px;
`;

const photos = [
    'https://bernard.vn/static/548/2022/06/18/baohiem3.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7JItGq_Z8ymbk3orFu9-rc0qLmlSzRM3JZS9kUPXJNQ&s',
    'https://bernard.vn/static/551/2022/06/18/baohiem_insmart.png',
    'https://media.loveitopcdn.com/3807/logo-cong-ty-medici2-compressed.jpg',
    'https://bernard.vn/static/1216/2022/11/23/Bic 1.jpg',
    'https://benhvienbacha.vn/wp-content/uploads/2023/06/17.-atacc.png',
    'https://micdongsaigon.com.vn/wp-content/uploads/2021/08/MIC_logo.jpeg',
    'https://t3.ftcdn.net/jpg/04/70/53/68/360_F_470536851_10hOQkik6Jq8snyhZJbtBHcBCrEm3xwt.jpg',
    'https://yt3.googleusercontent.com/ytc/AIdro_msl7h5JzBf854tp4dmvwBYjsuMeOeMjSPPdHk=s900-c-k-c0x00ffffff-no-rj',
    'https://www.senviet.art/wp-content/uploads/edd/2017/08/prudential1.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYa9X8zy6m4h3FcT6PRTVUUthT0N9wcFX13fFQRckJQw&s',
    'https://static.topcv.vn/company_logos/nF2l1HV8WnQS2bE7oWDt30pLeQ9oSc1L_1662605478____56e7df3f47694c4cc8d124592cb6c7f7.png',
    'https://www.senviet.art/wp-content/uploads/edd/2017/08/logo-bao-hiem-bao-viet.jpg',
    'https://www.aaa.com.vn/image/cache/catalog/TinTuc/Image20220704152137-600x315.png',
];

class HealthInsuranceCompanies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: nanoid(),
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.size.width !== this.props.size.width) {
            this.setState({ key: nanoid() });
        }
    }

    render() {
        const { size } = this.props;
        const { key } = this.state;

        let scale = 0.5;

        if (size && size.width > 800) {
            scale = 0.65;
        }

        if (size && size.width > 1100) {
            scale = 0.8;
        }

        if (size && size.width > 1400) {
            scale = 1;
        }

        return (
            <div style={{ marginTop: '50px' }}>
                <FullWidth>
                    <span style={{ fontSize: '18px', fontWeight: 600, marginLeft: '100px' }}>
                        {' '}
                        <FormattedMessage id="content.content11" />
                    </span>
                    <div style={{ height: scale * 150, marginTop: '30px' }}>
                        <Marquee key={key} velocity={25}>
                            {times(7, Number).map((id) => (
                                <Photo src={photos[id]} alt="" key={`marquee-example-people-${id}`} scale={scale} />
                            ))}
                        </Marquee>
                    </div>

                    <div style={{ height: scale * 60 }} />

                    <div style={{ height: scale * 200 }}>
                        <Marquee key={key} velocity={25}>
                            {times(7, Number).map((id) => (
                                <Photo
                                    src={photos[id + 7]}
                                    alt=""
                                    key={`marquee-example-people-${id + 7}`}
                                    offset="true"
                                    scale={scale}
                                />
                            ))}
                        </Marquee>
                    </div>
                </FullWidth>
            </div>
        );
    }
}

export default withSize()(HealthInsuranceCompanies);
