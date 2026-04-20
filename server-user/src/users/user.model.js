'use strict';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: [true, 'El ID de autenticación es requerido'],
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dug3apxt3/image/upload/auth_service/profiles/avatarDefault-1749508519496_oam3k3',
    },
    favoriteSports: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('UserProfile', userSchema);
