import React from 'react';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MediacalFacility from './Section/MediacalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import HealthInsuranceCompanies from './HealthInsuranceCompanies';
import HomeFooter from './HomeFooter';
import Content from './Content';
import ScrollButton from './ScrollButton'; // Import ScrollButton component
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePage.scss';

const HomePage = () => {
    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        slickGoTo: null, // Để trống, vì không có handleAfterChange trong functional component
    };

    return (
        <div id="top">
            <HomeHeader isShowBanner={true} />
            <Specialty settings={settings} />

            <MediacalFacility settings={settings} />
            <OutStandingDoctor settings={settings} />
            <HandBook settings={settings} />
            <About />
            <Content />
            <HealthInsuranceCompanies />
            <HomeFooter />
            <ScrollButton />
        </div>
    );
};

export default HomePage;
