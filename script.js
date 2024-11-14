const commentsList = [{
    id: 1,
    userName: 'kritika',
    commentText: 'Hi There',
    replies: [{
      id: 2,
      userName: 'manshi',
      commentText: 'Yo',
    }]
  },
  {
    id: 6,
    userName: 'divya',
    commentText: 'Second comment',
    replies: [],
  },
  {
    id: 3,
    userName: 'Lakshmi',
    commentText: 'Third comment',
    replies: [{
        id: 4,
        userName: 'Sara',
        commentText: 'this is the first reply',
      },
      {
        id: 5,
        userName: 'Test user',
        commentText: 'this is the second reply',
      },
    ]
  }
];


document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submit-comment');
  const commentInput = document.getElementById('comment-input');
  const commentsContainer = document.querySelector('.comments-container');
  let currentReplyComent = null;
  let currentSubmitReplyBtn = null;
  let currentEditComment = null;
  let currentSubmitEditBtn = null;

  let lastId = getUniqueID();

  function getUniqueID() {
    let maxID = 0;
    commentsList.forEach(comment => {
      if (comment.id > maxID) {
        maxID = comment.id;
      }
      if (comment.replies) {
        comment.replies.forEach(reply => {
          if (reply.id > maxID) {
            maxID = reply.id;
          }
        });
      }
    });
    return maxID + 1;
  }

  submitBtn.addEventListener('click', function() {
    const commentText = commentInput.value.trim();
    if (commentText !== '') {
      commentsList.push({
        id: lastId++,
        userName: 'New User',
        commentText: commentText,
      })
      commentInput.value = '';
      loadUI();
    }
  });

  function loadUI() {
    commentsContainer.innerHTML = '';
    commentsList.forEach(comment => {
      addComment(commentsContainer, comment);
    })
  }

  function addComment(parentContainer, comment) {
    const commentDiv = document.createElement('div');
    commentDiv.id = comment.id;
    commentDiv.classList.add('comment');
    const parentCommentDiv = document.createElement('div');
    parentCommentDiv.classList.add('parent-comment');
    commentDiv.appendChild(parentCommentDiv);

    const replies = document.createElement('div');
    replies.classList.add('replies');
    commentDiv.appendChild(replies);

    const avatar = document.createElement('img');
    avatar.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTigsa3tSTmjI1-Nee2vsylFPoXSUHchsitangcPPuyDQ&s';
    avatar.alt = 'User Avatar';
    avatar.classList.add('avatar');
    parentCommentDiv.appendChild(avatar);

    const commentDetails = document.createElement('div');
    commentDetails.classList.add('comment-details');
    parentCommentDiv.appendChild(commentDetails);

    const nameElement = document.createElement('h4');
    nameElement.classList.add('user-name');
    nameElement.textContent = comment.userName;
    commentDetails.appendChild(nameElement);

    const commentTextNode = document.createElement('p');
    commentTextNode.classList.add('comment-text');
    commentTextNode.textContent = comment.commentText;
    commentDetails.appendChild(commentTextNode);

    const commentActions = document.createElement('div');
    commentActions.classList.add('comment-actions')
    commentDetails.appendChild(commentActions);

    const replyBtn = document.createElement('button');
    replyBtn.classList.add('reply-btn');
    replyBtn.textContent = 'Reply';
    replyBtn.addEventListener('click', function() {
      handleReply(commentDiv);
    });
    commentActions.appendChild(replyBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function() {
      handleEdit(commentDiv);
    });
    commentActions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function() {
      handleDelete(commentDiv);
    });
    commentActions.appendChild(deleteBtn);


    if (comment && comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        addComment(replies, reply);
      })
    }

    parentContainer.appendChild(commentDiv);
  }

  function updateCommentsList(commentId, commentText) {
    const processing = (list) => {
      list.forEach(comment => {
        if (comment.id == commentId) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push({
            id: lastId++,
            userName: 'New User',
            commentText: commentText,
          })
        }
        if (comment.replies && comment.replies.length > 0) {
          processing(comment.replies);
        }
      })
    }

    processing(commentsList);
  }

  function handleReply(commentDiv) {
    if (currentReplyComent) {
      currentReplyComent.parentNode.removeChild(currentReplyComent);
      currentSubmitReplyBtn.parentNode.removeChild(currentSubmitReplyBtn);
    }
    const replyInput = document.createElement('input');
    replyInput.type = 'text';
    replyInput.placeholder = 'Enter your reply...';
    replyInput.classList.add('reply-input');

    const submitBtn = document.createElement('button');
    submitBtn.classList.add('submit-btn');
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', function() {
      const inputText = replyInput.value.trim();
      if (inputText !== '') {
        updateCommentsList(commentDiv.id, inputText);
        replyInput.parentNode.removeChild(replyInput);
        submitBtn.parentNode.removeChild(submitBtn);
        currentReplyComent = null;
        currentSubmitReplyBtn = null;
        loadUI();
      }
    });

    commentDiv.querySelector('.comment-details').appendChild(replyInput);
    commentDiv.querySelector('.comment-details').appendChild(submitBtn);
    currentReplyComent = replyInput;
    currentSubmitReplyBtn = submitBtn;
  }

  function removeByCommentId(commentId) {
    const processing = (list) => {
      list.forEach((comment, index) => {
        if (comment.id == commentId) {
          list.splice(index, 1);
        }
        if (comment.replies && comment.replies.length > 0) {
          processing(comment.replies);
        }
      })
    }

    processing(commentsList);
  }

  function handleDelete(commentDiv) {
    removeByCommentId(parseInt(commentDiv.id));
    loadUI();
  }

  function editCommentsList(commentId, commentText) {
    const processing = (list) => {
      list.forEach(comment => {
        if (comment.id == commentId) {
          comment.commentText = commentText;
        }
        if (comment.replies && comment.replies.length > 0) {
          processing(comment.replies);
        }
      })
    }

    processing(commentsList);
  }

  function handleEdit(commentDiv) {
    if (currentEditComment) {
      currentEditComment.parentNode.removeChild(currentEditComment);
      currentSubmitEditBtn.parentNode.removeChild(currentSubmitEditBtn);
    }
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = commentDiv.querySelector('.comment-text').textContent;
    editInput.placeholder = 'Enter your new input...';
    editInput.classList.add('edit-input');

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.classList.add('edit-button');
    submitBtn.addEventListener('click', function() {
      const newCommentText = editInput.value.trim();
      if (newCommentText !== '') {
        editCommentsList(commentDiv.id, newCommentText);
        editInput.parentNode.removeChild(editInput);
        submitBtn.parentNode.removeChild(submitBtn);
        currentEditComment = null;
        currentSubmitEditBtn = null;
        loadUI();
      }
    });

    commentDiv.querySelector('.comment-details').appendChild(editInput);
    commentDiv.querySelector('.comment-details').appendChild(submitBtn);
    currentEditComment = editInput;
    currentSubmitEditBtn = submitBtn;
  }

  loadUI();

});
