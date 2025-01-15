import React, { useState, useCallback } from 'react';
import { VideoComponent } from '../components/video/VideoComponent';
import { fetchVideos } from '../services/videoService';
import './VideoListPage.css';

export const VideoListPage = () => {
    const [videos, setVideos] = useState([]);
    const [showAllVideos] = useState(false);

    const loadVideos = useCallback(async () => {
        try {
            const data = await fetchVideos(1, 8);
            setVideos(data);
        } catch (error) {
            console.error('Error loading videos:', error);
        }
    }, []);

    React.useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    const mainVideo = videos[0];
    const sideVideos = videos.slice(1, 3);
    const highlightVideos = showAllVideos ? videos.slice(3) : videos.slice(3, 7);

    return (
        <div className="videolist-page">
            <div className="videolist-container">
                <div className="videolist-header">
                    <h1 className="videolist-title">RM PLAY</h1>
                </div>
                <div className="videolist-main-section">
                    <div className="videolist-main-content">
                        {mainVideo && (
                            <VideoComponent
                                title={mainVideo.title}
                                thumbnail={mainVideo.thumbnail}
                                embedCode={mainVideo.embed}
                                hideTeamLogo={true}
                                isMainVideo={true}
                            />
                        )}
                    </div>
                    <div className="videolist-side-content">
                        {sideVideos.map((video) => (
                            <div key={video.id} className="videolist-side-card">
                                <VideoComponent
                                    title={video.title}
                                    thumbnail={video.thumbnail}
                                    embedCode={video.embed}
                                    hideTeamLogo={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="videolist-highlights-section">
                    <h2 className="videolist-section-title">ALL VIDEOS</h2>
                    <div className={`videolist-grid ${showAllVideos ? 'expanded' : ''}`}>
                        {highlightVideos.map((video) => (
                            <div key={video.id} className="videolist-card">
                                <VideoComponent
                                    title={video.title}
                                    thumbnail={video.thumbnail}
                                    embedCode={video.embed}
                                    hideTeamLogo={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};