function create_tv_array(json_object, sample) {

    let tv_array = [];
    for (let i = 0; i < json_object.length; i++) {
        obj = {};
        obj.stimulus = json_object[i].literal;
        obj.choices = jsPsych.randomization.shuffle([json_object[i].figurative, json_object[i].confoundone, json_object[i].confoundtwo, json_object[i].confoundthree]);
        obj.data = {};
        obj.data.correct = json_object[i].figurative;
        obj.data.language = json_object[i].language;
        obj.data.idiom = json_object[i].literal;  // same as stimulus
        tv_array.push(obj)
    }
    sampled_array = jsPsych.randomization.sampleWithoutReplacement(tv_array, sample);
    return sampled_array;
}

function evaluate_response(data){
    console.log(data.response["Q0"]);
    if (data.response["Q0"] == data.correct) {
        data.result = "correct";
    } else {
        data.result = "incorrect";
    }
}