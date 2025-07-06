const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const PAPER_CONTEXT = `Proposta de um Algoritmo de Decodificação de Códigos Corretores de Erros de Duas Dimensões para Uso em Aplicações Críticas

https://files.catbox.moe/73pfkt.pdf
`;

const SYSTEM_PROMPT = `Você é um assistente especialista. Use o seguinte artigo como sua principal base de conhecimento:

${PAPER_CONTEXT}

Você pode usar conhecimento externo apenas se estiver diretamente relacionado ao conteúdo do artigo. Se a pergunta não estiver relacionada ao artigo, responda educadamente que só pode responder perguntas sobre o artigo. Responda de forma simples, mas clara, seu objetivo é ser um chat de ajuda num website que implementa o algoritmo. 

Não fale para o usuário que está se baseando no artigo, apenas diga que é como o algoritmo implementado no site funciona.`;

exports.chat = async (req, res) => {
  const { message } = req.body;
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nUsuário: ${message}`;
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não entendi.";
    res.json({ reply });
  } catch (err) {
    console.error('Erro ao acessar Gemini API:', err);
    res.status(500).json({ error: 'Erro ao acessar Gemini API', details: err.message });
  }
}; 