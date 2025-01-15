import React from 'react';
import { Link } from 'react-router-dom';
import './ShopSection.css';

function ShopSection() {
    return (
        <div className="shop-section">
            <div className="shop-content">
                <div className="shop-text">
                    <h2 className="yatra-one-regular">the gift shop</h2>
                    <p>
                        We've opened the Real Madrid gift shop.
                        Guiding you through these festive
                        (but sometimes chaotic) times, being
                        a helping hand with picking the best
                        gifts. Have fun!
                    </p>
                    <Link to="/kits" className="shop-button">
                        →
                    </Link>
                </div>
                <div className="shop-image">
                    <img src="/images/realbanner.png" alt="Shop Banner" />
                </div>
            </div>
        </div>
    );
}

export default ShopSection;