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
                <p className="text-content">Texto: {folder.text}</p>
                <div className="buttons">
                  <button onClick={() => toggleEdit(folder.id)}>Editar</button>
                  <button onClick={() => deleteFolder(folder.id)}>Excluir</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
