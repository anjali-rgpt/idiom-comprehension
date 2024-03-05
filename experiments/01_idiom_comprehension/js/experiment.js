
const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function (data) {
        //jsPsych.data.displayData('csv');

        proliferate.submit({ "trials": data.values() });

    }
});
let timeline = [];

let filter_idioms = [
    {
        "language": "English",
        "literal": "once in a blue moon",
        "figurative": "rarely or infrequently",
        "confoundone": "every night",
        "confoundtwo": "every two weeks",
        "confoundthree": "almost always"
      },

      {
        "language": "English",
        "literal": "to face the music",
        "figurative": "to deal with the consequences of a situation",
        "confoundone": "to celebrate",
        "confoundtwo": "to be calm and collected",
        "confoundthree": "to talk to someone who has strong opinions"
      },

      {
        "language": "English",
        "literal": "to break the ice",
        "figurative": "to start a conversation or ease tension",
        "confoundone": "to make a tense situation worse",
        "confoundtwo": "to overcome a challenge",
        "confoundthree": "to feel happier after being sad"
      },
      {
        "language": "English",
        "literal": "to feel under the weather",
        "figurative": "to be unwell",
        "confoundone": "to be emotional",
        "confoundtwo": "to be stuck in a difficult situation",
        "confoundthree": "to feel like you are not in control"
      }
];

const NUM_IDIOMS_PER_SAMPLE_LANGUAGE = 4;   // 4 idioms per language, 16 per participant. Ideally 100 participants to get 20 judgments. 
let temp_array = [create_tv_array(russian_idioms_sampled, NUM_IDIOMS_PER_SAMPLE_LANGUAGE), create_tv_array(mandarin_idioms_sampled, NUM_IDIOMS_PER_SAMPLE_LANGUAGE), create_tv_array(hindi_idioms_sampled, NUM_IDIOMS_PER_SAMPLE_LANGUAGE), create_tv_array(spanish_idioms_sampled, NUM_IDIOMS_PER_SAMPLE_LANGUAGE)];
let tv_array = jsPsych.randomization.shuffle([].concat(temp_array[0], temp_array[1], temp_array[2], temp_array[3], filter_idioms));
console.log(tv_array.length);


const irb = {
    // Which plugin to use
    type: jsPsychHtmlButtonResponse,
    // What should be displayed on the screen
    stimulus: '<p><font size="3">We invite you to participate in a research study on language production and comprehension. Your experimenter will ask you to do a linguistic task such as reading sentences or words, naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game. <br><br>There are no risks or benefits of any kind involved in this study. <br><br>You will be paid for your participation at the posted rate.<br><br>If you have read this form and have decided to participate in this experiment, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at anytime without penalty or loss of benefits to which you are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published and written data resulting from the study. You may print this form for your records.<br><br>CONTACT INFORMATION: If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, you should contact the Protocol Director Meghan Sumner at (650)-725-9336. If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>If you agree to participate, please proceed to the study tasks.</font></p>',
    // What should the button(s) say
    choices: ['Continue']
};

// push to the timeline
timeline.push(irb);

const instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "In this experiment, you will see a series of idiom phrases. Each phrase will have four options.<br/>You will need to select the option that you think best represents the actual meaning of the idiom phrase.<br/> When you are ready, please select Continue to proceed.",
    choices: ["Continue"]
};
timeline.push(instructions);

const trials = {
    timeline: [
        {
            type: jsPsychSurveyMultiChoice,
            questions: [{
                options: jsPsych.timelineVariable('choices'),
                prompt: jsPsych.timelineVariable('stimulus'),
                required: true
            }],
            trial_duration: 4000,
            on_finish: function (data) {
                evaluate_response(data);
            },
            data: jsPsych.timelineVariable('data')

        },
        {
            type: jsPsychHtmlButtonResponse,
            choices: ["Continue"],
            stimulus: "",
            response_ends_trial: false,
            trial_duration: 1000,
            on_finish: function (data) {
                var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
                jsPsych.setProgressBar(curr_progress_bar_value + (1/tv_array.length));
            }
        }
    ],
    timeline_variables: tv_array,
    randomize_order: true
}
timeline.push(trials);

const questionnaire = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'html',
                prompt: 'Please answer the following questions.'
            },
            {
                type: 'multi-choice',
                prompt: 'Did you read the instructions and do you think you did the task correctly?',
                name: 'correct',
                options: ['Yes', 'No', 'I was confused']
            },
            {

                type: 'drop-down',
                prompt: 'Gender:',
                name: 'gender',
                options: ['Female', 'Male', 'Non-binary/Non-conforming', 'Other']

            },
            {
                type: 'text',
                prompt: 'Age:',
                name: 'age',
                textbox_columns: 10
            },
            {
                type: 'drop-down',
                prompt: 'Level of education:',
                name: 'education',
                options: ['Some high school', 'Graduated high school', 'Some college', 'Graduated college', 'Hold a higher degree']
            },
            {
                type: 'text',
                prompt: "What languages are you natively proficient in? (grew up speaking OR can read, write and speak at native level). If multiple, separate by commas, e.g. \"English, Spanish\"",
                name: 'language',
                textbox_columns: 20,
                textbox_rows: 3
            },
            {
                type: 'drop-down',
                prompt: 'Do you think the payment was fair?',
                name: 'payment',
                options: ['The payment was too low', 'The payment was fair']
            },
            {
                type: 'drop-down',
                prompt: 'How was the experiment?',
                name: 'enjoy',
                options: ['Worse than the average experiment', 'An average experiment', 'Better than the average experiment']
            },
            {
                type: 'text',
                prompt: "Do you have any other comments about this experiment?",
                name: 'comments',
                textbox_columns: 30,
                textbox_rows: 4
            }
        ]
    ]
};

timeline.push(questionnaire);

const thanks = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: "Thank you for your time! Please click 'Continue' and then wait a moment until you're directed back to Prolific.<br><br>"
};

timeline.push(thanks);

jsPsych.run(timeline)