import { useEffect, useCallback, useState } from 'react';
import api from '../utils/api';
import { PostInfo } from '../types';
import { Loadable } from 'recoil';

type TagType = '標的' | '全部';

interface PostListState {
  activeTag: TagType;
  tags: TagType[];
  displayData: PostInfo[];
  searchLoading: boolean;
  filterText: string;
}

// tag 過濾
const filterByTag = (data: PostInfo[], tag: TagType) => (tag === '標的' ? data.filter((p) => p.tag === '標的') : data);

// 本地關鍵字過濾
const filterByKeyword = (data: PostInfo[], text: string) => {
  if (!text) return data;
  const lower = text.toLowerCase();
  return data.filter((p) => p.title.toLowerCase().includes(lower));
};

export function usePostListData(postsLoadable: Loadable<PostInfo[]>) {
  const [postListState, setPostListState] = useState<PostListState>({
    activeTag: '全部',
    tags: ['全部'],
    displayData: [],
    searchLoading: false,
    filterText: '',
  });

  // 初始化/資料來源變動，重置所有狀態
  useEffect(() => {
    if (postsLoadable.state === 'hasValue') {
      const posts: PostInfo[] = postsLoadable.contents;
      const hasTarget = posts.some((p) => p.tag === '標的');
      const tags: TagType[] = hasTarget ? ['標的', '全部'] : ['全部'];
      const initialTag: TagType = hasTarget ? '標的' : '全部';

      setPostListState({
        activeTag: initialTag,
        tags,
        displayData: filterByTag(posts, initialTag),
        searchLoading: false,
        filterText: '',
      });
    }
  }, [postsLoadable.state, postsLoadable.contents]);

  // 切換 tag
  const setTag = useCallback(
    (tag: TagType) => {
      if (postsLoadable.state !== 'hasValue') return;
      const posts: PostInfo[] = postsLoadable.contents;
      setPostListState((prev) => ({
        ...prev,
        activeTag: tag,
        displayData: filterByTag(prev.filterText ? filterByKeyword(posts, prev.filterText) : posts, tag),
      }));
    },
    [postsLoadable]
  );

  // 處理本地搜尋（debounce觸發）
  const handleDebouncedTextChange = useCallback(
    (text: string) => {
      if (postsLoadable.state !== 'hasValue') return;
      const posts: PostInfo[] = postsLoadable.contents;
      if (text) {
        setPostListState((prev) => ({
          ...prev,
          activeTag: '全部',
          tags: ['全部' as TagType],
          filterText: text,
          displayData: filterByKeyword(posts, text),
        }));
      } else {
        const hasTarget = posts.some((p) => p.tag === '標的');
        const tags: TagType[] = hasTarget ? ['標的', '全部'] : ['全部'];
        const initialTag: TagType = hasTarget ? '標的' : '全部';
        setPostListState({
          activeTag: initialTag,
          tags,
          filterText: '',
          displayData: filterByTag(posts, initialTag),
          searchLoading: false,
        });
      }
    },
    [postsLoadable]
  );

  // 處理遠端搜尋（只有有 keyword 時才觸發）
  const handleSearch = useCallback(
    async (text: string) => {
      if (postsLoadable.state !== 'hasValue') return;
      if (!text.trim()) return; // 空字串什麼都不做

      setPostListState((prev) => ({
        ...prev,
        searchLoading: true,
        tags: ['全部' as TagType],
        activeTag: '全部',
        filterText: text,
      }));
      try {
        const res = await api.get<{ posts: PostInfo[] }>(`/my/posts/search?search=${encodeURIComponent(text)}`);
        setPostListState((prev) => ({
          ...prev,
          searchLoading: false,
          displayData: res.data.posts,
        }));
      } catch (err) {
        setPostListState((prev) => ({
          ...prev,
          searchLoading: false,
          displayData: [],
        }));
      }
    },
    [postsLoadable]
  );

  return {
    postListState,
    setTag,
    handleDebouncedTextChange,
    handleSearch,
  };
}
