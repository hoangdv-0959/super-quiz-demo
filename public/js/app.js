(function ($, window, document) {
  $(function () {
    // The DOM is ready!

    let mainContent = $('#main-content');
    let questionContent = $('#question');
    let btnSubmit = $('#btn-submit');
    let inputAnswer = $('#input-answer');

    let messageLabel = $('#message');

    let currentQuestionId = '';

    btnSubmit.on('click', (e) => {
      const answer = inputAnswer.val();
      if (!answer) return;
      $.ajax({
        type: 'POST',
        url: `/questions/submit/${currentQuestionId}`,
        contentType: 'application/json',
        data: JSON.stringify({
          answer,
        }),
        success: (data) => {
          if (data.success) {
            messageLabel.removeClass('alert-danger');
            messageLabel.addClass('alert-success');
            messageLabel.text('Success!');
          } else {
            messageLabel.removeClass('alert-success');
            messageLabel.addClass('alert-danger');
            messageLabel.text('Fail!');
          }
        },
        dataType: 'json'
      });
    });

    // get a random question
    $.getJSON('/questions', (data) => {
      currentQuestionId = data.id;
      questionContent.text(data.question);
    });
  });

})(window.jQuery, window, document);
