const ConversionHistoryService = require('../services/ConversionHistoryService');
const { catchAsync } = require('../middleware/errorHandler');

const service = new ConversionHistoryService();

const saveConversion = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { inputText, asciiResult, binaryResult, codificationResult } = req.body;
  const entry = await service.create({
    userId,
    inputText,
    asciiResult,
    binaryResult,
    codificationResult: JSON.stringify(codificationResult)
  });
  res.status(201).json(entry);
});

const getHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const history = await service.getAllByUser(userId);
  // Parse codificationResult JSON for each entry
  const parsed = history.map(entry => ({
    ...entry.toJSON(),
    codificationResult: JSON.parse(entry.codificationResult)
  }));
  res.json(parsed);
});

module.exports = {
  saveConversion,
  getHistory
}; 