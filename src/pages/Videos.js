import React from 'react';
import { VideoList } from '../components/video/VideoList';

const Videos = () => {
    return (
        <div className="videos-page">
            <VideoList isSimplified={false} />
        </div>
    );
};

export default Videos;