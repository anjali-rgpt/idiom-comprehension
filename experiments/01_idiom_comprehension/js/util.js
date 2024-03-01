function create_tv_array(json_object) {
    let tv_array = [];
    for (let i = 0; i < json_object.length; i++) {
        obj = {};
        obj.stimulus = json_object[i].literal;
        obj.choices = [json_object[i].figurative, json_object[i].confoundone, json_object[i].confoundtwo, json_object[i].confoundthree]
        obj.data = {};
        obj.data.correct = json_object[i].figurative;
        tv_array.push(obj)
    }
    return tv_array;
}