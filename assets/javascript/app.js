$(document).ready(function () {

  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click', '.option', trivia.guessChecker);

})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId: '',
  // questions options and answers data
  questions: {
    q1: 'What Manhattan neighborhood did Jerry reside in?',

    q2: 'Guest-star Teri Hatcher\’s breasts, as confirmed by her character Sidra in season four\’s “The Implant,” were not only real, but …',

    q3: 'In season six\’s “The Doorman,” Frank Costanza wants to name the chest-support garment he and Kramer invent “the Manssiere,” but Kramer prefers…',

    q4: 'Which of these occupations did George’s alias, Art Vandelay, NOT purport to peddle in?',

    q5: "In later seasons, Kramer frequently sought the counsel of an excitable attorney who parodied which member of O.J. Simpson’s defense team?",

    q6: 'Elaine’s preferred “big salad” is, per her illustration, like a salad, “only bigger, ________.”',

    q7: 'Elaine has many talents, including copyediting and recreational skiing. But, as we learn in season eight\’s “The Little Kicks,” this skill is not one of them.',

    q8: "Midway through season eight, Kramer lost plenty of sleep, thanks to this fledgling fast-food chain’s giant neon sign:",

    q9: 'erry loves being friends with famous ex–New York Met Keith Hernandez, but balks at Hernandez’s request to …',

    q10: 'While dining at Mendy’s in season six\’s “The Soup,” Jerry’s stand-up nemesis, Kenny Bania, raves that they make the best _____ in the city.'
  },
  options: {
    q1: ['Lower East Side', 'Upper East Side', 'Upper West Side', 'DUMBO'],
    q2: ['unforgettable', 'exceptional', 'remarkable', 'spectacular'],
    q3: ['"the Bro"', '"the Breast Man"', '"Man\'s Best Friend"', 'the Buddy System'],
    q4: ['latex salesman', 'novelist', 'garbageman', 'importer-exporter'],
    q5: ['Robert Kardashian', 'Alan Dershowitz', 'Johnnie Cochran', 'F.Lee Bailey'],
    q6: ['with more of everything', 'with more ingredients', 'with lots of stuff in it', 'like a big salad'],
    q7: ['singing', 'dancing', 'cooking', 'soccer'],
    q8: ['Boston Market', 'Quiznos', 'Dallas BBQ', 'Kenny Rogers Roasters'],
    q9: ['support his second-spitter theory', 'dog-sit his poodle', 'set him up with Elaine', 'help him move'],
    q10: ['salmon', 'sorbet', 'swordfish', 'steak']
  },
  answers: {
    q1: 'Upper West Side',
    q2: 'spectacular',
    q3: '"the Bro"',
    q4: 'importer-exporter',
    q5: 'Johnnie Cochran',
    q6: 'with lots of stuff in it',
    q7: 'dancing',
    q8: 'Kenny Rogers Roasters',
    q9: 'help him move',
    q10: 'swordfish'
  },
  // trivia methods
  // method to initialize game
  startGame: function () {
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);

    // show game section
    $('#game').show();

    //  empty last results
    $('#results').html('');

    // show timer
    $('#timer').text(trivia.timer);

    // remove start button
    $('#start').hide();

    $('#remaining-time').show();

    // ask first question
    trivia.nextQuestion();

  },
  // method to loop through and display questions and options 
  nextQuestion: function () {

    // set timer to 20 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);

    // to prevent timer speed up
    if (!trivia.timerOn) {
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);

    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];

    // creates all the trivia guess options in the html
    $.each(questionOptions, function (index, key) {
      $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
    })

  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function () {
    // if timer still has time left and there are still questions left to ask
    if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
      $('#timer').text(trivia.timer);
      trivia.timer--;
      if (trivia.timer === 4) {
        $('#timer').addClass('last-seconds');
      }
    }
    // the time has run out and increment unanswered, run result
    else if (trivia.timer === -1) {
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if (trivia.currentSet === Object.keys(trivia.questions).length) {

      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>' +
          '<p>Correct: ' + trivia.correct + '</p>' +
          '<p>Incorrect: ' + trivia.incorrect + '</p>' +
          '<p>Unaswered: ' + trivia.unanswered + '</p>' +
          '<p>Please play again!</p>');

      // hide game sction
      $('#game').hide();

      // show start button to begin a new game
      $('#start').show();
    }

  },
  // method to evaluate the option clicked
  guessChecker: function () {

    // timer ID for gameResult setTimeout
    var resultId;

    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

    // if the text of the option picked matches the answer of the current question, increment correct
    if ($(this).text() === currentAnswer) {
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');

      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else {
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');

      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
    }

  },
  // method to remove previous question results and options
  guessResult: function () {

    // increment to next question set
    trivia.currentSet++;

    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();

    // begin next question
    trivia.nextQuestion();

  }

}