import { Avatar, Image, theme } from 'antd';
import {
    CommentOutlined,
    RetweetOutlined,
    HeartOutlined,
    ShareAltOutlined,
    EllipsisOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import type { Post } from '../types';
import styles from './index.module.less';
import React from 'react';

export interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const { token } = theme.useToken();

    const cssVars = {
        '--primary-color': token.colorPrimary,
        '--text-color': token.colorText,
        '--text-secondary-color': token.colorTextSecondary,
        '--border-color': token.colorBorderSecondary,
        '--hover-bg': token.colorFillAlter, 
        '--hover-icon-bg': token.colorFillSecondary,
        '--primary-bg-hover': token.colorPrimaryBg,
    } as React.CSSProperties;

    const mediaCount = post.media?.length || 0;
    
    // Simple grid layout logic for preview
    const getGridStyle = () => {
        if (mediaCount === 1) return { gridTemplateColumns: '1fr' };
        return { gridTemplateColumns: '1fr 1fr' };
    };

    return (
        <div className={styles.card} style={cssVars}>
            <div className={styles.avatarCol}>
                <Avatar 
                    style={{ backgroundColor: token.colorPrimary, verticalAlign: 'middle' }}
                    size={40}
                >
                    {post.user.nickname[0]?.toUpperCase()}
                </Avatar>
            </div>
            <div className={styles.contentCol}>
                <div className={styles.header}>
                    <div className={styles.userInfo}>
                        <span className={styles.nickname}>{post.user.nickname}</span>
                        <span className={styles.meta}>@{post.user.id} · {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.moreBtn}>
                        <EllipsisOutlined style={{ fontSize: 18 }} />
                    </div>
                </div>
                
                <div className={styles.text}>
                    {post.text}
                </div>

                {mediaCount > 0 && (
                    <div className={styles.mediaGrid} style={getGridStyle()}>
                        <Image.PreviewGroup>
                            {post.media.map((m, index) => (
                                <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: mediaCount === 1 ? '0' : '100%', height: mediaCount === 1 ? 'auto' : 0 }}>
                                     <Image 
                                        src={m.url}
                                        className={styles.mediaItem}
                                        wrapperStyle={{ 
                                            position: mediaCount === 1 ? 'static' : 'absolute', 
                                            top: 0, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '100%',
                                            display: 'block'
                                        }}
                                        style={{ 
                                            height: mediaCount === 1 ? 'auto' : '100%', 
                                            width: '100%', 
                                            objectFit: 'cover' 
                                        }}
                                    />
                                </div>
                            ))}
                        </Image.PreviewGroup>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={`${styles.actionItem} ${styles.reply}`}>
                        <div className={styles.iconWrapper}><CommentOutlined /></div>
                        {post.stats.commentCount > 0 && <span>{post.stats.commentCount}</span>}
                    </button>
                    <button className={`${styles.actionItem} ${styles.retweet}`}>
                        <div className={styles.iconWrapper}><RetweetOutlined /></div>
                    </button>
                    <button className={`${styles.actionItem} ${styles.like}`}>
                        <div className={styles.iconWrapper}><HeartOutlined /></div>
                         <span>{post.stats.scoreCount}</span>
                    </button>
                    <button className={`${styles.actionItem}`}>
                         <div className={styles.iconWrapper}><BarChartOutlined /></div>
                    </button>
                     <button className={`${styles.actionItem}`}>
                         <div className={styles.iconWrapper}><ShareAltOutlined /></div>
                    </button>
                </div>
            </div>
        </div>
    )
}
