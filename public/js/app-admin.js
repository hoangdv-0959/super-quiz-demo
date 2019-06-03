(function ($, window, document) {

  $(function () {
    // The DOM is ready!
    const form = $('#form-create');

    const inputQuestion = $('#input-question');
    const inputAnswer = $('#input-answer');

    form.on('submit', (e) => {
      e.preventDefault();
      const question = inputQuestion.val();
      const answer = inputAnswer.val();

      $.ajax({
        type: 'POST',
        url: `/questions`,
        contentType: 'application/json',
        data: JSON.stringify({
          answer,
          question,
        }),
        success: (data) => {
          console.log(data);
          form.trigger('reset');
        },
        dataType: 'json'
      });
      return false;
    });
  });

})(window.jQuery, window, document);
