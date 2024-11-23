import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Comments = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddComment = () => {
    if (!newComment || !name || !email) {
      alert('Por favor, llena todos los campos.');
      return;
    }

    const commentData = {
      text: newComment,
      date: new Date().toLocaleDateString(),
      name,
      email,
    };

    // Llamamos a la función onAddComment para actualizar el estado de los comentarios
    onAddComment(commentData);

    // Limpiamos los campos después de agregar el comentario
    setNewComment('');
    setName('');
    setEmail('');
  };

  return (
    <div className="mt-6">
      <div className="comments-section mt-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {comments.length > 0 ? (
          comments.slice(0, 5).map((comment, index) => (
            <div key={index} className="comment mb-6 p-6 border rounded-lg shadow-md bg-black text-[#FFD700] hover:bg-gray-800 transition duration-300">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-[#FFD700]">{comment.nombre}</p>
                <p className="text-sm text-[#FFD700]">{comment.fecha} - {comment.hora}</p>
              </div>
              <p className="text-[#FFD700] mb-4">{comment.comentario}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-[#FFD700]">No hay comentarios aún.</p>
        )}
      </div>

      {/* Mostrar el formulario para agregar un comentario */}
      <div className="mt-4">
        <input
          className="border border-gray-300 p-2 w-full mb-2"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 p-2 w-full mb-2"
          placeholder="Tu email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="border border-gray-300 p-2 w-full"
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-900 text-white py-2 px-4 rounded-lg"
          onClick={handleAddComment}
        >
          Agregar comentario
        </button>
      </div>
    </div>
  );
};

Comments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      comentario: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      hora: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddComment: PropTypes.func.isRequired,
};

export default Comments;
