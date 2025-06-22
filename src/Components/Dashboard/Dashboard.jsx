import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [newData, setNewData] = useState({
    name: '',
    description: '',
    category: 'Pessoal',
    date: '',
    text: ''
  });
  const [asciiTexts, setAsciiTexts] = useState({});
  const [binaryTexts, setBinaryTexts] = useState({});
  // Collapse state for each section, per folder.id
  const [showAscii, setShowAscii] = useState({});
  const [showBinary, setShowBinary] = useState({});
  const [showCoding, setShowCoding] = useState({});

  // Get user data from localStorage
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  // Check if user is authenticated
  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  // Fetch user's texts when component mounts
  useEffect(() => {
    if (userId) {
      fetchTexts();
    }
  }, [userId]);

  const fetchTexts = async () => {
    try {
      const response = await api.get(`/text/${userId}`);
      setFolders(response.data.texts.map(text => ({
        ...text,
        isEditing: false,
        editData: {}
      })));
      setError(null);
    } catch (error) {
      setError(error.message || 'Erro ao carregar textos');
      console.error('Error fetching texts:', error);
    }
  };

  const addFolder = async () => {
    const { name, description, category, date, text } = newData;
    if (!name || !description || !date || !text) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await api.post('/text', {
        userId: parseInt(userId),
        name,
        description,
        category,
        date,
        text
      });

      setFolders(prev => [
        ...prev,
        { ...response.data, isEditing: false, editData: {} }
      ]);
      setNewData({ name: '', description: '', category: 'Pessoal', date: '', text: '' });
      setShowForm(false);
      setError(null);
    } catch (error) {
      setError(error.message || 'Erro ao salvar texto');
      console.error('Error saving text:', error);
    }
  };

  const deleteFolder = async (id) => {
    try {
      await api.delete(`/text/${id}?userId=${userId}`);
      setFolders(prev => prev.filter(f => f.id !== id));
      setError(null);
    } catch (error) {
      setError(error.message || 'Erro ao excluir texto');
      console.error('Error deleting text:', error);
    }
  };

  const toggleEdit = id => {
    setFolders(prev => prev.map(f =>
      f.id === id
        ? { ...f, isEditing: !f.isEditing, editData: { ...f } }
        : f
    ));
  };

  const updateFolder = async (id) => {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;

    try {
      const response = await api.put(`/text/${id}`, {
        userId: parseInt(userId),
        ...folder.editData
      });

      setFolders(prev => prev.map(f =>
        f.id === id
          ? {
              ...response.data,
              isEditing: false,
              editData: {}
            }
          : f
      ));
      setError(null);
    } catch (error) {
      setError(error.message || 'Erro ao atualizar texto');
      console.error('Error updating text:', error);
    }
  };

  const handleChange = (e, isEdit = false, id = null) => {
    const { name, value } = e.target;
    if (isEdit) {
      setFolders(prev => prev.map(f =>
        f.id === id
          ? { 
              ...f,
              editData: {
                ...f.editData,
                [name]: value
              }
            }
          : f
      ));
    } else {
      setNewData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  
  const convertToAscii = (text) => {
    return text.split('').map(char => char.charCodeAt(0)).join(' ');
  };

  
  const convertToBinary = (text) => {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  };


  const handleConvert = (id, text) => {
    setAsciiTexts(prev => ({ ...prev, [id]: convertToAscii(text) }));
    setBinaryTexts(prev => ({ ...prev, [id]: convertToBinary(text) }));
  };


  const getBinary4x2Blocks = (text) => {
    return text.split('').map(char => {
      const bin = char.charCodeAt(0).toString(2).padStart(8, '0');
      return [bin.slice(0, 4), bin.slice(4, 8)];
    });
  };

  const getBinary4x4BlocksFromBinary = (binaryString) => {
    if (!binaryString) return [];
    const binaries = binaryString.split(' ');
    const blocks = binaries.map(bin => [bin.slice(0, 4), bin.slice(4, 8)]);
    if (blocks.length % 2 !== 0) {
      blocks.push(['0000', '0000']);
    }
    const result = [];
    for (let i = 0; i < blocks.length; i += 2) {
      result.push([
        blocks[i][0],
        blocks[i][1],
        blocks[i+1][0],
        blocks[i+1][1]
      ]);
    }
    return result;
  };

  const buildRowMatrix = (block) => {
    const D = block.map(row => row.split('').map(Number));
    const R = D.map(row => {
      const r1 = row[0] ^ row[1] ^ row[2] ^ row[3];
      const r2 = row[0] ^ row[3];
      const r3 = row[0] ^ row[2];
      return [r1, r2, r3];
    });
    return R;
  };

  const buildColMatrix = (block) => {
    const D = block.map(row => row.split('').map(Number));
    const C = [[], [], []];
    for (let j = 0; j < 4; j++) {
      const col = [D[0][j], D[1][j], D[2][j], D[3][j]];
      C[0][j] = col[0] ^ col[1] ^ col[2] ^ col[3];
      C[1][j] = col[0] ^ col[3];
      C[2][j] = col[0] ^ col[2];
    }
    return C;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Meus Textos</h2>
          <span className="user-name">Olá, {userName || 'Usuário'}</span>
        </div>
        <div className="header-right">
          <button className="toggle-button" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancelar' : 'Criar Novo'}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="new-folder form-block">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={newData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Descrição"
            value={newData.description}
            onChange={handleChange}
          />
          <select name="category" value={newData.category} onChange={handleChange}>
            <option>Pessoal</option>
            <option>Trabalho</option>
            <option>Projetos</option>
            <option>Outros</option>
          </select>
          <input
            type="date"
            name="date"
            value={newData.date}
            onChange={handleChange}
          />
          <textarea
            name="text"
            placeholder="Digite seu texto aqui..."
            value={newData.text}
            onChange={handleChange}
            rows={5}
          />
          <button onClick={addFolder}>Salvar</button>
        </div>
      )}

      <div className="folder-list">
        {folders.map(folder => (
          <div key={folder.id} className="folder-card">
            {folder.isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  defaultValue={folder.editData.name}
                  onChange={e => handleChange(e, true, folder.id)}
                />
                <input
                  type="text"
                  name="description"
                  defaultValue={folder.editData.description}
                  onChange={e => handleChange(e, true, folder.id)}
                />
                <select
                  name="category"
                  defaultValue={folder.editData.category}
                  onChange={e => handleChange(e, true, folder.id)}
                >
                  <option>Pessoal</option>
                  <option>Trabalho</option>
                  <option>Projetos</option>
                  <option>Outros</option>
                </select>
                <input
                  type="date"
                  name="date"
                  defaultValue={folder.editData.date}
                  onChange={e => handleChange(e, true, folder.id)}
                />
                <textarea
                  name="text"
                  defaultValue={folder.editData.text}
                  onChange={e => handleChange(e, true, folder.id)}
                  rows={5}
                  placeholder="Digite seu texto aqui..."
                />
                <div className="buttons">
                  <button onClick={() => updateFolder(folder.id)}>Salvar</button>
                  <button onClick={() => toggleEdit(folder.id)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <h3>{folder.name}</h3>
                <p>Descrição: {folder.description}</p>
                <p>Categoria: {folder.category}</p>
                <p>Data: {folder.date}</p>
                <p>Texto: {folder.text}</p>
                <div className="buttons">
                  <button onClick={() => toggleEdit(folder.id)}>Editar</button>
                  <button onClick={() => deleteFolder(folder.id)}>Excluir</button>
                  <button onClick={() => handleConvert(folder.id, folder.text)}>Converter</button>
                </div>
                {/* ASCII Section */}
                {binaryTexts[folder.id] && (
                  <div className="ascii-result">
                    <div className="section-header" onClick={() => setShowAscii(prev => ({...prev, [folder.id]: !(folder.id in prev ? prev[folder.id] : false)}))}>
                      <span className="arrow-icon">{(showAscii[folder.id] ?? false) ? '▼' : '►'}</span>
                      <span className="section-label">ASCII</span>
                    </div>
                    {(showAscii[folder.id] ?? false) && (
                      <>
                        <div>{folder.text.split('').map(char => char.charCodeAt(0)).join(' ')}</div>
                      </>
                    )}
                  </div>
                )}
                {/* Binário Section */}
                {binaryTexts[folder.id] && (
                  <div className="binary-result">
                    <div className="section-header" onClick={() => setShowBinary(prev => ({...prev, [folder.id]: !(folder.id in prev ? prev[folder.id] : false)}))}>
                      <span className="arrow-icon">{(showBinary[folder.id] ?? false) ? '▼' : '►'}</span>
                      <span className="section-label">Binário</span>
                    </div>
                    {(showBinary[folder.id] ?? false) && (
                      <>
                        <div className="coding-matrix-row">
                          {getBinary4x2Blocks(folder.text).map((block, idx) => (
                            <div className="coding-matrix-col" key={idx}>
                              <span className="coding-matrix-label">ASCII: {folder.text.charCodeAt(idx)}</span>
                              <table className="coding-matrix binary-matrix">
                                <tbody>
                                  {block.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {row.split('').map((bit, bIdx) => (
                                        <td key={bIdx} className="coding-d">{bit}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {/* Codificação Section */}
                {binaryTexts[folder.id] && (
                  <div className="coding-result">
                    <div className="section-header" onClick={() => setShowCoding(prev => ({...prev, [folder.id]: !(folder.id in prev ? prev[folder.id] : false)}))}>
                      <span className="arrow-icon">{(showCoding[folder.id] ?? false) ? '▼' : '►'}</span>
                      <span className="section-label">Codificação</span>
                    </div>
                    {(showCoding[folder.id] ?? false) && (
                      <>
                        <div className="coding-matrices-col">
                          {getBinary4x4BlocksFromBinary(binaryTexts[folder.id]).map((block, idx, arr) => {
                            const D = block.map(row => row.split(''));
                            const R = buildRowMatrix(block);
                            const C = buildColMatrix(block);
                            const showLabels = idx % 3 === 0; // Only show labels on the first of each row of 3
                            return (
                              <div className="coding-matrix-row" key={idx}>
                                <div className="coding-matrix-col">
                                  {showLabels && <span className="coding-matrix-label">Matriz de dados</span>}
                                  <table className="coding-matrix coding-matrix-d">
                                    <tbody>
                                      {D.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="coding-d">{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="coding-matrix-col">
                                  {showLabels && <span className="coding-matrix-label">Codificação Linhas</span>}
                                  <table className="coding-matrix coding-matrix-r">
                                    <tbody>
                                      {R.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="coding-r">{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="coding-matrix-col">
                                  {showLabels && <span className="coding-matrix-label">Codificação colunas</span>}
                                  <table className="coding-matrix coding-matrix-c">
                                    <tbody>
                                      {C.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="coding-c">{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
