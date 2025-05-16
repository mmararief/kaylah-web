import { fetchStoryDetail } from '../util/api';
import { renderStoryDetailPage } from '../views/story-detail-page';

export const handleStoryDetailPage = async (id) => {
  if (!id) {
    renderStoryDetailPage(null);
    return;
  }

  try {
    const story = await fetchStoryDetail(id);
    renderStoryDetailPage(story);
  } catch (error) {
    console.error('Error in story detail presenter:', error);
    renderStoryDetailPage(null);
  }
}; 