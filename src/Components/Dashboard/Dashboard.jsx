import React, { useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newData, setNewData] = useState({
    name: '',
    description: '',
    category: 'Pessoal',
    date: '',
    file: null
  });

  const addFolder = () => {
    const { name, description, category, date, file } = newData;
    if (!name || !description || !date || !file) return;

    const id = Date.now();
    const fileURL = URL.createObjectURL(file);

    setFolders(prev => [
      ...prev,
      { id, ...newData, fileURL, isEditing: false, editData: {} }
    ]);

    setNewData({ name: '', description: '', category: 'Pessoal', date: '', file: null });
    setShowForm(false);
  };

  const deleteFolder = id => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const toggleEdit = id => {
    setFolders(prev => prev.map(f =>
      f.id === id
        ? { ...f, isEditing: !f.isEditing, editData: { ...f } }
        : f
    ));
  };

  const updateFolder = id => {
    setFolders(prev => prev.map(f =>
      f.id === id
        ? {
            ...f,
            ...f.editData,
            fileURL: f.editData.file ? URL.createObjectURL(f.editData.file) : f.fileURL,
            isEditing: false,
            editData: {}
          }
        : f
    ));
  };

  const handleChange = (e, isEdit = false, id = null) => {
    const { name, value, files } = e.target;
    if (isEdit) {
      setFolders(prev => prev.map(f =>
        f.id === id
          ? { 
              ...f,
              editData: {
                ...f.editData,
                [name]: name === 'file' ? files[0] : value
              }
            }
          : f
      ));
    } else {
      setNewData(prev => ({
        ...prev,
        [name]: name === 'file' ? files[0] : value
      }));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Meus arquivos</h2>
        <button className="toggle-button" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancelar' : 'Criar Novo'}
        </button>
      </div>

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
          <input
            type="file"
            name="file"
            onChange={handleChange}
          />
          <button onClick={addFolder}>Salvar Pasta</button>
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
                <input
                  type="file"
                  name="file"
                  onChange={e => handleChange(e, true, folder.id)}
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
                <p>Arquivo: {folder.file.name}</p>
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
