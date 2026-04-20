'use strict';

import mongoose from 'mongoose';

const tournamentsSchema = new mongoose.Schema(
  {
    tournamentsName: {
      type: String,
      required: [true, 'El nombre del torneo es requerido'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['FUTBOL_7', 'FUTBOL_11'],
      required: [true, 'La categoría del torneo es requerida'],
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
    },
    endDate: {
      type: Date,
      required: [true, 'La fecha de finalización es requerida'],
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    status: {
      type: String,
      enum: ['PENDIENTE', 'EN PROGRESO', 'TERMINADO', 'CANCELADO'],
      default: 'PENDIENTE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices para optimizar búsquedas por administración
tournamentsSchema.index({ category: 1 });
tournamentsSchema.index({ status: 1 });
tournamentsSchema.index({ isActive: 1 });

export default mongoose.model('Tournament', tournamentsSchema);
