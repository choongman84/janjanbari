import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitch, FaSnapchatGhost, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import './Footer.css';

const Footer = () => {
    const mainSponsors = [
        { id: 1, name: 'Nike', image: '/images/sponsors/nike.webp' },
        { id: 2, name: 'BingX', image: '/images/sponsors/bingx.webp' },
        { id: 3, name: 'Fever', image: '/images/sponsors/fever.webp' }
    ];

    const sponsors = [
        { id: 1, name: '8xbet', image: '/images/sponsors/8xbet.webp' },
        { id: 2, name: 'Ascott', image: '/images/sponsors/ascott.webp' },
        { id: 3, name: 'Cadbury', image: '/images/sponsors/cadbury.webp' },
        { id: 4, name: 'EA Sports', image: '/images/sponsors/easports.webp' },
        { id: 5, name: 'Infinite Athlete', image: '/images/sponsors/infinite.webp' },
        { id: 6, name: 'Linglong Tire', image: '/images/sponsors/linglone.webp' },
        { id: 7, name: 'Match Worn Shirt', image: '/images/sponsors/matchworn.webp' }
    ];

    const otherSponsors = [
        { id: 1, name: 'MSC Cruises', image: '/images/sponsors/msc.webp' },
        { id: 2, name: 'Predator Energy', image: '/images/sponsors/predator.webp' },
        { id: 3, name: 'Singha', image: '/images/sponsors/singha.webp' },
        { id: 4, name: 'Sure', image: '/images/sponsors/Sure.webp' },
        { id: 5, name: 'Three', image: '/images/sponsors/three.webp' }
    ];

    return (
        <>
            <div className="sponsors-wrapper">
                <div className="sponsors-container">
                    <div className="main-sponsors">
                        {mainSponsors.map(sponsor => (
                            <div key={sponsor.id} className="sponsor-item main">
                                <img src={sponsor.image} alt={sponsor.name} />
                            </div>
                        ))}
                    </div>

                    <div className="sponsors-divider"></div>

                    <div className="regular-sponsors">
                        {sponsors.map(sponsor => (
                            <div key={sponsor.id} className="sponsor-item">
                                <img src={sponsor.image} alt={sponsor.name} />
                            </div>
                        ))}
                    </div>

                    <div className="sponsors-divider"></div>

                    <div className="other-sponsors">
                        {otherSponsors.map(sponsor => (
                            <div key={sponsor.id} className="sponsor-item">
                                <img src={sponsor.image} alt={sponsor.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="footer-additional">
                <div className="footer-additional-content">
                    <div className="footer-address">
                        <img src="/images/real.png" alt="Real Madrid Logo" className="footer-additional-logo" />
                        <div className="address-details">
                            <p>Real Madrid</p>
                            <p>Av. de las Fuerzas Armadas, 402,</p>
                            <p>28055 Madrid, Spain</p>
                        </div>
                        <div className="footer-additional-social">
                            <a href="https://facebook.com/realmadrid" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                            <a href="https://instagram.com/realmadrid" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="https://twitter.com/realmadrid" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                            <a href="https://youtube.com/realmadrid" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                            <a href="https://twitch.tv/realmadrid" target="_blank" rel="noopener noreferrer"><FaTwitch /></a>
                            <a href="https://snapchat.com/add/realmadrid" target="_blank" rel="noopener noreferrer"><FaSnapchatGhost /></a>
                            <a href="https://tiktok.com/@realmadrid" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                        </div>
                    </div>

                    <div className="footer-links-section">
                        <h3>Club Info</h3>
                        <h3>Teams</h3>
                        <h3>Tickets</h3>
                        <h3>Tour Bernabéu</h3>
                        <h3>Real Madrid Shop</h3>
                        <h3>Exclusive Content</h3>
                        <h3>Fans</h3>
                        <h3>Madridistas</h3>
                    </div>

                    <div className="footer-app-section">
                        <p>Download the official Real Madrid app and never miss a moment of the action, with exclusive content, live updates and match coverage.</p>
                        <div className="app-store-buttons">
                            <a href="https://apps.apple.com/app/real-madrid-app/id1234567890" className="app-store-link">
                                <img src="/images/app-store.png" alt="Download on the App Store" />
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=com.realmadrid.app" className="app-store-link">
                                <img src="/images/google-play.png" alt="Get it on Google Play" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-divider"></div>
                <div className="footer-bottom">
                    <div className="copyright">
                        <div className="copyright-text">© Real Madrid 2024. All rights reserved.</div>
                    </div>
                    <div className="footer-links">
                        <Link to="/terms">Terms of Use</Link>
                        <span>|</span>
                        <Link to="/privacy">Privacy Policy</Link>
                        <span>|</span>
                        <Link to="/cookies">Cookies Policy</Link>
                        <span>|</span>
                        <Link to="/legal">Legal Notice</Link>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;