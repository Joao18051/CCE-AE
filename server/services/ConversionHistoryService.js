const { ConversionHistory } = require('../models');

class ConversionHistoryService {
  async create({ userId, inputText, asciiResult, binaryResult, codificationResult }) {
    return await ConversionHistory.create({
      userId,
      inputText,
      asciiResult,
      binaryResult,
      codificationResult
    });
  }

  async getAllByUser(userId) {
    return await ConversionHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = ConversionHistoryService; 