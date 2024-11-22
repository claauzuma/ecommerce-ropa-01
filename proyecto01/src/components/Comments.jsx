import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Comments = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showComments, setShowComments] = useState(false);

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

    onAddComment(commentData);
    setNewComment('');
    setName('');
    setEmail('');
  };

  return (
    <div className="mt-6">
      <button
        className="text-blue-900 font-semibold"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
      </button>

      {showComments && (
        <div className="comments-section mt-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment p-2 border-b border-gray-200">
                <p className="font-semibold">{comment.date}</p>
                <p>{comment.text}</p>
                <p className="text-sm text-gray-600">Por: {comment.name} - {comment.email}</p>
              </div>
            ))
          ) : (
            <p>No hay comentarios aún.</p>
          )}
        </div>
      )}

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
      text: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddComment: PropTypes.func.isRequired,
};

export default Comments;
