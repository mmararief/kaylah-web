// IndexedDB utility functions
const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;
const LIKED_STORIES_STORE = 'liked-stories';

// Open the database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store for liked stories if it doesn't exist
      if (!db.objectStoreNames.contains(LIKED_STORIES_STORE)) {
        const store = db.createObjectStore(LIKED_STORIES_STORE, { keyPath: 'id' });
        // Create index for quick search by time
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    request.onerror = (event) => {
      reject('Error opening IndexedDB: ' + event.target.error);
    };
  });
};

// Like a story - add to IndexedDB
export const likeStory = async (story) => {
  try {
    const db = await openDB();
    const tx = db.transaction(LIKED_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(LIKED_STORIES_STORE);
    
    // Add timestamp for when the story was liked
    const likedStory = {
      ...story,
      likedAt: new Date().toISOString()
    };
    
    const request = store.put(likedStory);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Story successfully saved to IndexedDB');
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error saving story to IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      tx.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in likeStory:', error);
    throw error;
  }
};

// Unlike a story - remove from IndexedDB
export const unlikeStory = async (storyId) => {
  try {
    const db = await openDB();
    const tx = db.transaction(LIKED_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(LIKED_STORIES_STORE);
    
    const request = store.delete(storyId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Story successfully removed from IndexedDB');
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error removing story from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      tx.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in unlikeStory:', error);
    throw error;
  }
};

// Check if a story is liked
export const isStoryLiked = async (storyId) => {
  try {
    const db = await openDB();
    const tx = db.transaction(LIKED_STORIES_STORE, 'readonly');
    const store = tx.objectStore(LIKED_STORIES_STORE);
    
    const request = store.get(storyId);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        resolve(!!request.result); // Convert to boolean
      };
      
      request.onerror = () => {
        resolve(false);
      };
      
      tx.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in isStoryLiked:', error);
    return false;
  }
};

// Get all liked stories
export const getLikedStories = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(LIKED_STORIES_STORE, 'readonly');
    const store = tx.objectStore(LIKED_STORIES_STORE);
    const index = store.index('createdAt');
    
    const request = index.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = (event) => {
        console.error('Error getting liked stories from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      tx.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in getLikedStories:', error);
    return [];
  }
};

// Get count of liked stories
export const getLikedStoriesCount = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(LIKED_STORIES_STORE, 'readonly');
    const store = tx.objectStore(LIKED_STORIES_STORE);
    
    const request = store.count();
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        resolve(0);
      };
      
      tx.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in getLikedStoriesCount:', error);
    return 0;
  }
};

// Clear all liked stories
export const clearLikedStories = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(LIKED_STORIES_STORE, 'readwrite');
    const store = tx.objectStore(LIKED_STORIES_STORE);
    
    const request = store.clear();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('All liked stories cleared from IndexedDB');
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error clearing liked stories from IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      tx.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in clearLikedStories:', error);
    throw error;
  }
}; 