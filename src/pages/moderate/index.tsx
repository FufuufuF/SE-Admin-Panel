import usePost from "./hooks/use-post";
import PostCard from "./components/post-card";
import { useEffect } from "react";
import styles from "./index.module.less";
import { theme } from "antd";

export default function Moderate() {
    const { posts, fetchPosts } = usePost();
    const { token } = theme.useToken();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const cssVars = {
        '--border-color': token.colorBorderSecondary,
        '--bg-color': token.colorBgContainer,
        '--header-bg': token.colorBgContainer, // simplified for now
        '--text-color': token.colorText,
    } as React.CSSProperties;

    return (
        <div className={styles.container} style={cssVars}>
            <div className={styles.header}>
                <h2 className={styles.title}>Home</h2>
            </div>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
