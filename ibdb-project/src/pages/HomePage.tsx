import React from 'react'
import ScrollingMenu from '../components/ScrollingMenu';
import '../styles/HomePage.css';
import ScrollingMenuCustom from '../components/ScrollingMenuCustom';

const HomePage = () => {

    return (
        <div id="hpContent">
            <div className="conteiner" id="recentlyReleased">
                <div className="header">
                    <div className="element"></div>
                    <h1>Recently Released</h1>
                </div>
                <ScrollingMenu filter="news" adID={0}/>
            </div>
            <div className="conteiner" id="comingSoon">
                <div className="header">
                    <div className="element"></div>
                    <h1 id="comingSoon">Coming Soon</h1>
                </div>
                <ScrollingMenu filter="coming" adID={1}/>
            </div>
            <div className="conteiner"id="topBooks">
                <div className="header">
                    <div className="element"></div>
                    <h1>Top Books</h1>
                </div>
                <ScrollingMenu filter="rated" adID={2}/>
            </div>
            <div className="conteiner" id="RATI">
                <div className="header">
                    <div className="element"></div>
                    <h1>Recently added to IBDb</h1>
                </div>
                <ScrollingMenu filter="added" adID={3}/>
            </div>
        </div>
    )
}

export default HomePage;