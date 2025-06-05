const { catchAsync } = require('../middleware/errorHandler');
const AppError = require('../utils/AppError');
const Text = require('../models/Text');
const { sequelize } = require('../config/db');

class TextController {
  saveText = catchAsync(async (req, res) => {
    console.log('Received save text request:', req.body);
    const { userId, name, description, category, date, text } = req.body;

    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 400);
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new AppError('O texto é obrigatório e não pode estar vazio', 400);
    }

    if (!name || !description || !category || !date) {
      throw new AppError('Todos os campos são obrigatórios', 400);
    }

    try {
      const savedText = await Text.create({
        userId,
        name,
        description,
        category,
        date,
        text: text.trim()
      });

      console.log('Text saved successfully:', savedText.id);
      res.status(200).json(savedText);
    } catch (error) {
      console.error('Error saving text:', error);
      throw new AppError('Erro ao salvar texto: ' + error.message, 500);
    }
  });

  getText = catchAsync(async (req, res) => {
    console.log('Received get text request for userId:', req.params.userId);
    const { userId } = req.params;

    if (!userId) {
      throw new AppError('ID do usuário é obrigatório', 400);
    }

    try {
      const texts = await Text.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });

      console.log(`Found ${texts.length} texts for user ${userId}`);
      res.status(200).json({
        texts
      });
    } catch (error) {
      console.error('Error fetching texts:', error);
      throw new AppError('Erro ao buscar textos: ' + error.message, 500);
    }
  });

  updateText = catchAsync(async (req, res) => {
    console.log('Received update text request:', req.params.id, req.body);
    const { id } = req.params;
    const { userId, name, description, category, date, text } = req.body;

    const textEntry = await Text.findOne({
      where: { id, userId }
    });

    if (!textEntry) {
      throw new AppError('Texto não encontrado', 404);
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new AppError('O texto é obrigatório e não pode estar vazio', 400);
    }

    if (!name || !description || !category || !date) {
      throw new AppError('Todos os campos são obrigatórios', 400);
    }

    try {
      const updatedText = await textEntry.update({
        name,
        description,
        category,
        date,
        text: text.trim()
      });

      console.log('Text updated successfully:', id);
      res.status(200).json(updatedText);
    } catch (error) {
      console.error('Error updating text:', error);
      throw new AppError('Erro ao atualizar texto: ' + error.message, 500);
    }
  });

  deleteText = catchAsync(async (req, res) => {
    console.log('Received delete text request:', req.params.id, req.query.userId);
    const { id } = req.params;
    const { userId } = req.query;

    const textEntry = await Text.findOne({
      where: { id, userId }
    });

    if (!textEntry) {
      throw new AppError('Texto não encontrado', 404);
    }

    try {
      await textEntry.destroy();
      console.log('Text deleted successfully:', id);
      res.status(200).json({
        message: 'Texto excluído com sucesso'
      });
    } catch (error) {
      console.error('Error deleting text:', error);
      throw new AppError('Erro ao excluir texto: ' + error.message, 500);
    }
  });
}

module.exports = TextController; 