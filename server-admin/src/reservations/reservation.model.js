'use strict';

import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'El ID del usuario es requerido'],
    },
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: [true, 'El ID del campo es requerido'],
    },
    startTime: {
      type: Date,
      required: [true, 'La hora de inicio es requerida'],
    },
    endTime: {
      type: Date,
      required: [true, 'La hora de fin es requerida'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
        message: 'Estado no válido',
      },
      default: 'PENDING',
    },
    confirmation: {
      confirmedAt: Date,
      confirmedBy: String,
    },
    lastModifiedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reservationSchema.index({ userId: 1 });
reservationSchema.index({ fieldId: 1 });
reservationSchema.index({ startTime: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ startTime: 1, fieldId: 1 });
reservationSchema.index({ startTime: -1, status: 1 });

reservationSchema.pre('save', function (next) {
  if (this.endTime <= this.startTime) {
    return next(
      new Error('La hora de fin debe ser posterior a la hora de inicio')
    );
  }
  next();
});

reservationSchema.statics.findConflictingReservations = function (
  fieldId,
  startTime,
  endTime,
  excludeId = null
) {
  const query = {
    fieldId,
    status: { $in: ['CONFIRMED', 'PENDING'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return this.find(query);
};

export default mongoose.model('Reservation', reservationSchema);
