import React from 'react';
import './Memories.css';
import { saveMemory } from "../firebase/memories";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

/**
 * Memories Component — Dark-Themed Polaroid Gallery
 *
 * @param {Object[]} photos - Array of photo objects
 * @param {string} photos[].image - URL of the uploaded photo
 * @param {string} photos[].uploader - Name of the person who uploaded
 * @param {string} photos[].date - Upload date/time string
 * @param {string} [photos[].caption] - Optional caption below the image
 */
const Memories = () => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
  const q = query(
    collection(db, "memories"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    setPhotos(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })));
  });

  return unsubscribe;
}, []);
  // Subtle rotations for the scattered "pinned to board" feel
  const getRotation = (index) => {
    const rotations = [-5, 3, -2, 4, -4, 2, -3, 5, -1, 3];
    return rotations[index % rotations.length];
  };

  const hasMemories = photos && photos.length > 0;

  return (
    <div className="memories-page">
      {/* Header with camera branding */}
      <header className="memories-header">
        <div className="camera-wrap" aria-hidden="true">
          <span className="camera-emoji">📷</span>
          <div className="camera-glow" />
        </div>
        <h1 className="memories-title">Memory Wall</h1>
        <p className="memories-subtitle">
          A scattered collection of moments worth remembering
        </p>
        <div className="memories-divider" aria-hidden="true" />
      </header>

      {hasMemories ? (
        <div className="polaroid-grid">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="polaroid"
              style={{ transform: `rotate(${getRotation(index)}deg)` }}
            >
              {/* Alternate between glowing pin and cyan tape */}
              {index % 2 === 0 ? (
                <div className="polaroid-pin" aria-hidden="true" />
              ) : (
                <div className="polaroid-tape" aria-hidden="true" />
              )}

              <div className="polaroid-img-wrap">
                <img
  src={photo.imageUrl}
  alt="memory"
  onError={() => console.log("Image failed:", photo.image)}
/>
              </div>

              {photo.caption && (
                <div className="polaroid-caption">{photo.caption}</div>
              )}

              <div className="polaroid-meta">
                <div className="polaroid-name">👤 {photo.uploader}</div>
                <div className="polaroid-date">🕒 {photo.date}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-wrap" aria-hidden="true">
            <span className="empty-camera">📷</span>
            <div className="empty-glow" />
          </div>
          <h2 className="empty-title">No memories yet</h2>
          <p className="empty-desc">Be the first to capture one!</p>
        </div>
      )}
    </div>
  );
};

export default Memories;