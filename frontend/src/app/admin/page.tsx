'use client';

import { AdminPostsList } from '@/components/admin/AdminPostsList';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { PostEditorForm } from '@/components/admin/PostEditorForm';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { postsApi } from '@/lib/api';
import { Post, PostPayload } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && (!user || !isAdmin)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, isAdmin, isAuthLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchPosts = async () => {
      try {
        const data = await postsApi.getAll();
        setPosts(data);
      } catch (err) {
        setBannerError(
          err instanceof Error ? err.message : 'Failed to load stories',
        );
      } finally {
        setIsPostsLoading(false);
      }
    };

    void fetchPosts();
  }, [isAdmin]);

  const handleStartCreate = () => {
    setEditingPost(null);
    setBannerError(null);
    setBannerSuccess(null);
    setActiveTab('editor');
  };

  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setBannerError(null);
    setBannerSuccess(null);
    setActiveTab('editor');
  };

  const handleCancelEditor = () => {
    setEditingPost(null);
    setActiveTab('posts');
  };

  const handleSavePost = async (
    payload: PostPayload,
    postId: number | null,
  ) => {
    setBannerError(null);
    setBannerSuccess(null);

    if (postId !== null) {
      const updated = await postsApi.update(postId, payload);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      setBannerSuccess('Story updated successfully');
    } else {
      const created = await postsApi.create(payload);
      setPosts((prev) => [created, ...prev]);
      setBannerSuccess('New story published');
    }

    setEditingPost(null);
    setActiveTab('posts');
  };

  const handleDeletePost = async (id: number) => {
    setBannerError(null);
    setBannerSuccess(null);

    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingPost?.id === id) {
        setEditingPost(null);
      }
      setBannerSuccess('Story deleted');
    } catch (err) {
      setBannerError(
        err instanceof Error ? err.message : 'Failed to delete story',
      );
    }
  };

  if (isAuthLoading || !isAdmin) {
    return (
      <div className="py-20 text-center text-sm font-medium text-slate-500">
        Verifying admin access...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <AdminSidebar
          activeTab={activeTab}
          postsCount={posts.length}
          isEditing={editingPost !== null}
          onSelectTab={setActiveTab}
          onStartCreate={handleStartCreate}
        />
      </div>

      <div className="space-y-4 lg:col-span-9">
        {bannerError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {bannerError}
          </div>
        )}

        {bannerSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {bannerSuccess}
          </div>
        )}

        {activeTab === 'editor' ? (
          <PostEditorForm
            key={editingPost?.id ?? 'new'}
            editingPost={editingPost}
            onSave={handleSavePost}
            onCancel={handleCancelEditor}
          />
        ) : (
          <AdminPostsList
            posts={posts}
            isLoading={isPostsLoading}
            onEdit={handleStartEdit}
            onDelete={handleDeletePost}
            onCreateNew={handleStartCreate}
          />
        )}
      </div>
    </div>
  );
}
