'use strict';
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'El nombre del equipo es requerido'],
      trim: true,
    },
    managerId: {
      type: String,
      required: [true, 'El ID del manager es requerido'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['FUTBOL_7', 'FUTBOL_11'],
      required: [true, 'La categoría del equipo es requerida'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    logo: {
      type: String,
      default: 'fields/kinal_sports_nyvxo5',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice para optimizar búsquedas
teamSchema.index({ isActive: 1 });

export default mongoose.model('Team', teamSchema);
