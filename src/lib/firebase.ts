import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  CropListing, 
  Order, 
  NotificationItem, 
  Conversation, 
  Message, 
  ProductReview, 
  UserRole,
  AIMessage,
  AIConversation,
  TopicCategory
} from '../types';
import { 
  INITIAL_USERS, 
  MOCK_CROP_LISTINGS, 
  MOCK_ORDERS, 
  MOCK_NOTIFICATIONS, 
  MOCK_CONVERSATIONS, 
  MOCK_MESSAGES, 
  INITIAL_REVIEWS,
  MOCK_USER_ADMIN,
  MOCK_USER_FARMER,
  MOCK_USER_BUYER
} from '../data/mockData';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use custom firestoreDatabaseId if provided in config
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const isFirebaseConfigured = Boolean(firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey);

// Authentication Service
export const authService = {
  async signInWithEmail(email: string, password?: string) {
    if (isFirebaseConfigured && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          return { user: userDoc.data() as UserProfile };
        }
        return { user: { id: userCredential.user.uid, email: userCredential.user.email || email, fullName: email.split('@')[0], role: 'farmer', country: 'Kenya' } as UserProfile };
      } catch (err: any) {
        console.warn('Firebase email auth error, falling back to profile matching:', err);
      }
    }

    // Demo/matching account fallback
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) return { user: matched };
    
    return {
      user: {
        id: `usr_${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : email.includes('buyer') ? 'buyer' : 'farmer',
        country: 'Kenya',
        verifiedStatus: true
      } as UserProfile
    };
  },

  async signUp(email: string, password?: string, fullName?: string, role?: string, country?: string) {
    if (isFirebaseConfigured && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: UserProfile = {
          id: userCredential.user.uid,
          email,
          fullName: fullName || email.split('@')[0],
          role: (role as UserRole) || 'farmer',
          country: country || 'Kenya',
          joinedDate: new Date().toISOString().split('T')[0],
          verifiedStatus: true
        };
        await setDoc(doc(db, 'users', newUser.id), newUser);
        return { user: newUser };
      } catch (err: any) {
        console.warn('Firebase signup failed, local fallback:', err);
      }
    }

    const newUser: UserProfile = {
      id: `usr_${role || 'farmer'}_${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      role: (role as UserRole) || 'farmer',
      country: country || 'Kenya',
      joinedDate: new Date().toISOString().split('T')[0],
      verifiedStatus: true
    };
    return { user: newUser };
  },

  async signInWithGoogle() {
    if (isFirebaseConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          return { user: userDoc.data() as UserProfile };
        }
        const newUser: UserProfile = {
          id: user.uid,
          email: user.email || 'user@agrisphere.africa',
          fullName: user.displayName || 'Google Trader',
          role: 'farmer',
          country: 'Kenya',
          avatar: user.photoURL || undefined,
          joinedDate: new Date().toISOString().split('T')[0],
          verifiedStatus: true
        };
        await setDoc(doc(db, 'users', newUser.id), newUser);
        return { user: newUser };
      } catch (err) {
        console.warn('Google sign in error, fallback to demo user:', err);
      }
    }
    return { user: MOCK_USER_FARMER };
  },

  async signOut() {
    if (isFirebaseConfigured) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('Error signing out of Firebase:', err);
      }
    }
    return { error: null };
  },

  async resetPassword(email: string) {
    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      } catch (err: any) {
        throw err;
      }
    }
    return { success: true };
  }
};

// Firestore Database & Real-time Synchronization Services
export const firestoreService = {
  // Seed initial data to Firestore if empty
  async seedInitialDataIfNeeded() {
    if (!isFirebaseConfigured) return;

    try {
      // Check if listings exist
      const listingsSnap = await getDocs(collection(db, 'listings'));
      if (listingsSnap.empty) {
        console.log('Seeding initial listings to Firestore...');
        const batch = writeBatch(db);
        for (const item of MOCK_CROP_LISTINGS) {
          const docRef = doc(db, 'listings', item.id);
          batch.set(docRef, item);
        }
        for (const u of INITIAL_USERS) {
          const userRef = doc(db, 'users', u.id);
          batch.set(userRef, u);
        }
        for (const ord of MOCK_ORDERS) {
          const orderRef = doc(db, 'orders', ord.id);
          batch.set(orderRef, ord);
        }
        for (const notif of MOCK_NOTIFICATIONS) {
          const notifRef = doc(db, 'notifications', notif.id);
          batch.set(notifRef, notif);
        }
        for (const conv of MOCK_CONVERSATIONS) {
          const convRef = doc(db, 'conversations', conv.id);
          batch.set(convRef, conv);
        }
        for (const msg of Object.values(MOCK_MESSAGES).flat()) {
          const msgRef = doc(db, 'messages', msg.id);
          batch.set(msgRef, msg);
        }
        for (const rev of INITIAL_REVIEWS) {
          const revRef = doc(db, 'reviews', rev.id);
          batch.set(revRef, rev);
        }
        const settingsRef = doc(db, 'systemSettings', 'global_config');
        batch.set(settingsRef, {
          id: 'global_config',
          escrowFeeRate: 2.5,
          systemBroadcast: 'System Advisory: Cross-border trade clearing active across Kenya (KEPHIS) & Ghana (COCOBOD). Normal inspection turnaround 24 hours.',
          maintenanceMode: false,
          updatedAt: new Date().toISOString()
        });

        await batch.commit();
        console.log('Firestore seed completed successfully!');
      }
    } catch (err) {
      console.warn('Firestore seeding check failed (will operate seamlessly with in-memory + Firestore fallback):', err);
    }
  },

  // Real-time Subscriptions
  subscribeToListings(callback: (listings: CropListing[]) => void) {
    if (!isFirebaseConfigured) return () => {};
    const q = query(collection(db, 'listings'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CropListing));
        callback(items);
      }
    }, (err) => {
      console.warn('Error subscribing to listings:', err);
    });
  },

  subscribeToOrders(callback: (orders: Order[]) => void) {
    if (!isFirebaseConfigured) return () => {};
    const q = query(collection(db, 'orders'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order));
        callback(items);
      }
    }, (err) => {
      console.warn('Error subscribing to orders:', err);
    });
  },

  subscribeToUsers(callback: (users: UserProfile[]) => void) {
    if (!isFirebaseConfigured) return () => {};
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as UserProfile));
        callback(items);
      }
    }, (err) => {
      console.warn('Error subscribing to users:', err);
    });
  },

  subscribeToConversations(callback: (conversations: Conversation[]) => void) {
    if (!isFirebaseConfigured) return () => {};
    const q = query(collection(db, 'conversations'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Conversation));
        callback(items);
      }
    }, (err) => {
      console.warn('Error subscribing to conversations:', err);
    });
  },

  subscribeToMessages(callback: (messages: Message[]) => void) {
    if (!isFirebaseConfigured) return () => {};
    const q = query(collection(db, 'messages'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Message));
        callback(items);
      }
    }, (err) => {
      console.warn('Error subscribing to messages:', err);
    });
  },

  subscribeToNotifications(callback: (notifs: NotificationItem[]) => void) {
    if (!isFirebaseConfigured) return () => {};
    const q = query(collection(db, 'notifications'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NotificationItem));
        callback(items);
      }
    }, (err) => {
      console.warn('Error subscribing to notifications:', err);
    });
  },

  subscribeToSettings(callback: (settings: { escrowFeeRate: number; systemBroadcast: string; maintenanceMode: boolean }) => void) {
    if (!isFirebaseConfigured) return () => {};
    const docRef = doc(db, 'systemSettings', 'global_config');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as any);
      }
    }, (err) => {
      console.warn('Error subscribing to settings:', err);
    });
  },

  // Listings CRUD
  async saveListing(listing: CropListing) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'listings', listing.id), listing);
      } catch (err) {
        console.warn('Failed to save listing to Firestore:', err);
      }
    }
  },

  async deleteListing(listingId: string) {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'listings', listingId));
      } catch (err) {
        console.warn('Failed to delete listing from Firestore:', err);
      }
    }
  },

  // Orders CRUD
  async saveOrder(order: Order) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (err) {
        console.warn('Failed to save order to Firestore:', err);
      }
    }
  },

  async updateOrder(orderId: string, updates: Partial<Order>) {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'orders', orderId), updates);
      } catch (err) {
        console.warn('Failed to update order in Firestore:', err);
      }
    }
  },

  // Users CRUD
  async saveUser(user: UserProfile) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'users', user.id), user);
      } catch (err) {
        console.warn('Failed to save user to Firestore:', err);
      }
    }
  },

  async updateUser(userId: string, updates: Partial<UserProfile>) {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'users', userId), updates);
      } catch (err) {
        console.warn('Failed to update user in Firestore:', err);
      }
    }
  },

  // Messages & Conversations
  async saveMessage(message: Message) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'messages', message.id), message);
      } catch (err) {
        console.warn('Failed to save message to Firestore:', err);
      }
    }
  },

  async saveConversation(conversation: Conversation) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'conversations', conversation.id), conversation);
      } catch (err) {
        console.warn('Failed to save conversation to Firestore:', err);
      }
    }
  },

  // System Settings
  async saveSystemSettings(settings: { escrowFeeRate: number; systemBroadcast: string; maintenanceMode: boolean }) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'systemSettings', 'global_config'), {
          ...settings,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Failed to save system settings to Firestore:', err);
      }
    }
  },

  // Notifications
  async saveNotification(notification: NotificationItem) {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'notifications', notification.id), notification);
      } catch (err) {
        console.warn('Failed to save notification to Firestore:', err);
      }
    }
  },

  async markNotificationAsRead(notificationId: string) {
    if (isFirebaseConfigured) {
      try {
        await updateDoc(doc(db, 'notifications', notificationId), { read: true });
      } catch (err) {
        console.warn('Failed to update notification in Firestore:', err);
      }
    }
  }
};

// AI Agronomist Firebase Persistence
export async function saveConversationToFirebase(
  userId: string,
  title: string,
  topic: TopicCategory
): Promise<string> {
  const convId = `ai_conv_${Date.now()}`;
  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'ai_conversations', convId), {
        id: convId,
        userId,
        title,
        topic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return convId;
    } catch (err) {
      console.warn('Firebase ai_conversations error:', err);
    }
  }
  return convId;
}

export async function saveMessageToFirebase(
  conversationId: string,
  message: AIMessage
): Promise<void> {
  if (isFirebaseConfigured) {
    try {
      const msgId = message.id || `ai_msg_${Date.now()}`;
      await setDoc(doc(db, 'ai_messages', msgId), {
        id: msgId,
        conversationId,
        sender: message.sender,
        content: message.content,
        topic: message.topic || 'General',
        keyTakeaways: message.keyTakeaways || [],
        suggestedFollowups: message.suggestedFollowups || [],
        isVoiceInput: message.isVoiceInput || false,
        timestamp: new Date().toISOString()
      });
      // update conversation updatedAt
      await updateDoc(doc(db, 'ai_conversations', conversationId), {
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not persist message to Firebase:', err);
    }
  }
}

export async function fetchConversationsFromFirebase(userId: string): Promise<AIConversation[]> {
  if (!isFirebaseConfigured) return [];

  try {
    const convQuery = query(collection(db, 'ai_conversations'), where('userId', '==', userId));
    const convSnap = await getDocs(convQuery);
    if (convSnap.empty) return [];

    const conversations: AIConversation[] = [];
    for (const d of convSnap.docs) {
      const convData = d.data();
      const msgQuery = query(collection(db, 'ai_messages'), where('conversationId', '==', d.id));
      const msgSnap = await getDocs(msgQuery);
      
      const msgs = msgSnap.docs.map(mDoc => {
        const m = mDoc.data();
        return {
          id: m.id || mDoc.id,
          sender: m.sender,
          content: m.content,
          timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
          topic: m.topic,
          keyTakeaways: m.keyTakeaways,
          suggestedFollowups: m.suggestedFollowups,
          isVoiceInput: m.isVoiceInput
        };
      });

      conversations.push({
        id: d.id,
        userId: convData.userId,
        title: convData.title,
        topic: convData.topic as TopicCategory,
        updatedAt: convData.updatedAt,
        messages: msgs
      });
    }
    return conversations;
  } catch (err) {
    console.warn('Error fetching AI conversations from Firebase:', err);
    return [];
  }
}
