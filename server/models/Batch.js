import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sellerId: { type: String, required: true },
  farmName: String,
  farmerName: String,
  productName: String,
  date: String,
  milkingTime: String,
  litersDispatched: Number,
  fatPercentage: Number,
  snfPercentage: Number,
  chillerTemp: Number,
  somaticCellCount: String,
  adulterationTests: {
    urea: String,
    detergent: String,
    starch: String,
    waterAdded: String,
    antibioticResidues: String
  },
  feedLog: String,
  cattleVaccinationStatus: String,
  labCertNumber: String,
  status: String
}, {
  timestamps: true
});

export const Batch = mongoose.model('Batch', batchSchema);
