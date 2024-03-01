
const jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.data.displayData('csv');
      }
  });
let timeline = [];
let tv_array = create_tv_array(idioms).slice(0,3);

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
            on_finish: function(data){
                evaluate_response(data);
            },
            data: jsPsych.timelineVariable('data')
            
        },
        {
            type: jsPsychHtmlButtonResponse,
            choices: ["Continue"],
            stimulus: "",
            response_ends_trial: false,
            trial_duration: 1000
        }
    ],
    timeline_variables: tv_array,
    randomize_order: true
}
timeline.push(trials);


jsPsych.run(timeline)