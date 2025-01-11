import React, { useState } from "react";

const GroupModal = ({ onClose, createGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState("");
  const [error, setError] = useState("");

  const handleCreateGroup = () => {
    if (!groupName || !participants) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    const participantsArray = participants.split(",").map((p) => p.trim());

    createGroup({ groupName, participants: participantsArray });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl mb-4">Crear Grupo</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Nombre del grupo"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="text"
          placeholder="Participantes (separados por comas)"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={handleCreateGroup}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
        <button onClick={onClose} className="ml-4 text-gray-500">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default GroupModal;
