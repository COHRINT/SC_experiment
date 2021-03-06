/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you
var answer;
//var keyInformation = "";
var scores;
// All pages to be loaded
var pages = [
	"instructions/Introduction.html",
	"instructions/MainInstructions.html",
   	"instructions/SCInstructions.html",
	"instructions/xQInstructions.html",
	"instructions/xPInstructions.html",
	"testForXp.html",
	"testForXq.html",
	"genericTest.html",
	"stage.html",
	"postquestionnaire.html",
	"xq_questionnaire.html",
	"xp_questionnaire.html",
	"xq_questionnaire.html",
	"xqAndxp_questionnaire.html",
   	"debriefing.html"
];

psiTurk.preloadPages(pages);

var streamInstructionPages = [["instructions/Introduction.html","instructions/MainInstructions.html","genericTest.html"],
["instructions/Introduction.html","instructions/SCInstructions.html","genericTest.html","instructions/xQInstructions.html","testForXq.html"],
["instructions/Introduction.html","instructions/SCInstructions.html","genericTest.html","instructions/xPInstructions.html","testForXp.html"],
["instructions/Introduction.html","instructions/SCInstructions.html","genericTest.html","instructions/xPInstructions.html","testForXp.html","instructions/xQInstructions.html","testForXq.html"]]
var Type_value =  mycondition
var condition_type = Type_value + 1;
// var condition_type = 1;
// console.log("mycondition: " + Type_value);
// console.log("Condition: " + (condition_type));

// print different messages depending on what mode we're in
var debug = false
if (mode == "debug"){
    debug = true
} else if (mode == "live") {
    debug = false
} else {
    debug = false
}

var instructionPages = streamInstructionPages[condition_type-1];

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/****************
* Pre-Questionnaire *
****************/

var Debriefing = function(){

		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

		record_responses = function() {

			psiTurk.recordTrialData({'phase':'debriefing', 'status':'submit'});

			$('textarea').each( function(i, val) {
				psiTurk.recordUnstructuredData(this.id, this.value);
			});
			$('select').each( function(i, val) {
				psiTurk.recordUnstructuredData(this.id, this.value);
			});

		};


		prompt_resubmit = function() {
			document.body.innerHTML = error_message;
			$("#resubmit").click(resubmit);
		};

		resubmit = function() {
			document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
			reprompt = setTimeout(prompt_resubmit, 10000);

            psiTurk.saveData({
                success: psiTurk.completeHIT(),
                error: prompt_resubmit});
		};

		// Load the questionnaire snippet
		psiTurk.showPage('debriefing.html');
		psiTurk.recordTrialData({'phase':'debriefing', 'status':'begin'});

		$("#next").click(function () {
		    record_responses();
            psiTurk.saveData({
                success: function(){
                            psiTurk.computeBonus('compute_bonus', function(){
                            psiTurk.completeHIT()})},
                error: prompt_resubmit});
        });
};

var PreQuestionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    	clearInterval(reprompt);
                		currentview = new Experiment();
			},
			error: prompt_resubmit
		});
	};
	psiTurk.showPage('prequestionnaire.html');
	psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'begin'});
	$("#next").click(function () {
	    record_responses();
            psiTurk.saveData({
                success: new Experiment(),
                error: prompt_resubmit});
	});

};

var XqAndXp_Questionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'XqAndXp_Questionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    	clearInterval(reprompt);
                		currentview = new Questionnaire();
			},
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiTurk.showPage('xqAndxp_questionnaire.html');
	psiTurk.recordTrialData({'phase':'XqAndXp_Questionnaire', 'status':'begin'});

	$("#next").click(function () {
	    record_responses();
            psiTurk.saveData({
                success: new Questionnaire(),
                error: prompt_resubmit});
	});


};


var Xq_Questionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'Xq_Questionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    	clearInterval(reprompt);
                		currentview = new Questionnaire();
			},
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiTurk.showPage('xq_questionnaire.html');
	psiTurk.recordTrialData({'phase':'Xq_Questionnaire', 'status':'begin'});

	$("#next").click(function () {


	    record_responses();
            psiTurk.saveData({
                success: new Questionnaire(),
                error: prompt_resubmit});
	});


};


var Xp_Questionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'Xp_Questionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    	clearInterval(reprompt);
                		currentview = new Questionnaire();
			},
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiTurk.showPage('xp_questionnaire.html');
	psiTurk.recordTrialData({'phase':'Xp_Questionnaire', 'status':'begin'});

	$("#next").click(function () {
	    record_responses();
        psiTurk.saveData({
            success: new Questionnaire(),
            error: prompt_resubmit});
	});
};

function xQ_float2word(xQ){
    // convert floating point to words
    var l = 0.0
    var hl = 0.40
    var hm = 0.75
    var lg = 1.00
    var g = 1.50
    var vg = 2.00
    if (xQ >= l && xQ <= hl){
        xQ_word = "very bad"
    } else if (xQ > hl && xQ <= hm){
        xQ_word = "bad"
    } else if (xQ > hm && xQ <= lg){
        xQ_word = "okay"
    } else if (xQ > lg && xQ <= g){
        xQ_word = "good"
    } else if (xQ > g && xQ <= vg){
        xQ_word = "very good"
    } else {
        xQ_word = "something is wrong"
    };
    return xQ_word;
}
function xP_float2word(xP){
    // convert floating point to words
    var l = -1.0
    var hl = -0.50
    var hm = -0.10
    var lg = 0.10
    var g = 0.50
    var vg = 1.0
    if (xP >= l && xP <= hl){
        xP_word = "very bad"
    } else if (xP > hl && xP <= hm){
        xP_word = "bad"
    } else if (xP > hm && xP <= lg){
        xP_word = "uncertain"
    } else if (xP > lg && xP <= g){
        xP_word = "good"
    } else if (xP > g && xP <= vg){
        xP_word = "very good"
    } else {
        xP_word = "something is wrong"
    };
    return xP_word;
}

/********************
* Experiment TEST       *
********************/
var Experiment = function() {
	var collector = 0;
	var wordon, // time word is presented
	    listening = false;

	var stims = [];
	var takeover;
    var json_task_set;

	// //Need to set async to False.
	$.ajax({
	    type: "GET",
	    url: "json/v2_support.json",
	    async: false,
	    dataType: "JSON",
	    success: exp_data
    	});
	$.ajax({
	    type: "GET",
	    url: "json/experiment_trial_set.json",
	    async: false,
	    dataType: "JSON",
	    success: task_set
    	});

	function exp_data(data){
		takeover = data;
	}
    function task_set(data){
        json_task_set = data;
    }
    console.log("data");
    console.log(takeover);
    console.log("Task Set");
    console.log(json_task_set);
    // var task_set = [1,2,3].map(String); // shorten task set for debugging
    var v1_task_set = [100,10,13,16,18,22,23,25,29,30,32,39,41,43,44,48,49,50,54,56,57,58,59,60,62,66,6,74,75,76,77,79,7,80,82,84,87,89,8,90,91,93,94,97,98].sort(function(a,b){return a-b;}).map(String);
    // var task_set = [10,16,22,23,29,30,39,41,44,48,49,50,54,56,57,59,60,62,66,74,75,76,77,79,82,84,87,89,8,90,91,93,94,97,98].sort(function(a,b){return a-b;}).map(String);
    var task_set = json_task_set.sort(function(a,b){return a-b;}).map(String);

	var index = 0;
	for(i in takeover)
	{
        if (task_set.includes(i))
        {
            stims.push([]);
            xQ_word = xQ_float2word(takeover[i]["xQ"])
            xP_word = xP_float2word(takeover[i]["xP"])
            stims[index].push(xQ_word);
            stims[index].push(xP_word);
            stims[index].push(takeover[i]["image_file"]);
            stims[index].push(takeover[i]["outcome"]);
            index+=1;
        }

	}


	stims = _.shuffle(stims);
	var stims_tmp=[];
	var count=0;
	for(i in stims)
	{
		stims_tmp.push(stims[i]);
		count+=1;
	}
	stims = stims_tmp;

	var next = function() {
        console.log(collector)
        if (debug) {
            var msg_string = "DEBUG MODE -- Score:" + collector.toFixed(2)
        } else {
            var msg_string = "Good Job. We'll Review Your Results, And Calculate Your Bonus"
        }

		if (stims.length===0) {

            d3.select("#Previous_Result")
                .append("div")
                .style("text-align","center")
                .style("font-size","60px")
                .text(msg_string);
                // .text("Total Score : "+ collector.toFixed(2));

			d3.select("#Previous_Result")
				.append("div")
				.style("text-align","center")
				.style("font-size","45px")
                .style("color","blue")
				.text("Please Wait While We Load The Final Survey");

			var delayInMilliseconds = 6000;
			setTimeout(function() {
			  d3.select("#Previous_Result").remove("div");
			  finish();
			}, delayInMilliseconds);
		} else {
			stim = stims.shift();
			show_word(stim[0],stim[1],stim[2],stim[3]);
			wordon = new Date().getTime();
			listening = true;
		}
        psiTurk.recordUnstructuredData("total_score",collector);
	};

	var response_handler = function(e) {
		if (!listening) return;

		var evt = e || window.event
		var keyCode = evt.keyCode;
		// var keyCode = event.keyCode;
		var response;

		switch (keyCode) {
			case 38:
				//87 "w"
				//83 "s"
				//up key 38
				//down key 40


				// "Up sign"
				//keyInformation="Up"
				response="Up";
				break;
			case 40:
				// "Down sign"
				//keyInformation="Down"
				response="Down";
				break;
			default:
				response = "";
				break;
		}

		if (response.length>0) {
			listening = false;
			//var bool_comp;
			if(stim[3]=="success" && response=="Up"){
				//bool_comp=true;
				scores=1;
				collector+=scores;
			}else if(stim[3]=="fail" && response=="Up"){
				//bool_comp=true;
				scores=-1;
				collector+=scores;
			}else{
				//bool_comp=false;
				scores=-1/4;
				collector+=scores;
			}



			var hit = scores;
			var rt = new Date().getTime() - wordon;

			var x = stim[2];
	    	    	var sub_x="";
	                var tmp="";

	                for(i=12;i<x.length;i++){
	    		    tmp=x.substring(i,i+1)
	    		    if(tmp=="."){
	    			    break;
	    		    }else{sub_x=sub_x+tmp;}
	    	    	}

			psiTurk.recordTrialData({'phase':"TEST",
	                			     'userType':condition_type,
                                     'outcome':stim[3],
                                     'image_name':stim[2],
				                     'image_name_number':sub_x,
                                     'response':response,
                                     'hit':hit,
                                     'rt':rt}
                                   );

			remove_word();
			var color={"fail":"red","success":"green"};
			var context={"fail":"Delivery Failed (-1)","success":"Delivery Success (+1)"};
			if(Math.abs(scores)==1){
				d3.select("#Previous_Result")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","60px")
				       .style("color", color[answer])
				       .text(context[answer]);
			}else{
				d3.select("#Previous_Result")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","60px")
				       .text("Delivery Declined (-1/4)");
			}

			var delayInMilliseconds = 1500; //1.5 second
			setTimeout(function() {
				remove_word();
				next();
	   		}, delayInMilliseconds);
		}
	};

	var finish = function() {

	    $("body").unbind("keydown", response_handler); // Unbind keys

	    switch(condition_type-1){
		    case 0 : 	currentview = new Questionnaire();
		    		break;
		    case 1 :	currentview = new Xq_Questionnaire();
		    		break;
		    case 2 : 	currentview = new Xp_Questionnaire();
		    		break;
		    case 3 :	currentview = new XqAndXp_Questionnaire();
		    		break;
	    }
	};

	var show_word = function(xQ, xP,image,outcome) {
		answer=outcome;

		d3.select("#game_pics").append("img")
		     .attr("src","../static/images/game_pictures/"+image)
		     .attr("width", 400)
		     .attr("height", 400)

        if (debug){
            var xQ_text = "xQ (net"+image+"): "
            var xP_text = "xP ("+outcome+"): "
        } else {
            var xQ_text = "Solver Quality: "
            var xP_text = "Outcome Assessment: "
        }

		switch(condition_type-1){
     			case 0:
				break;
			case 1:
				d3.select("#xQ")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","35px")
				       .text(xQ_text+xQ);
				 break;
			case 2:
				d3.select("#xP")
					.append("div")
					.style("text-align","center")
					.style("font-size","35px")
					.text(xP_text+xP);
				break;
			case 3:
				d3.select("#xP")
					.append("div")
					.style("text-align","center")
					.style("font-size","35px")
					.text(xP_text+xP);

			 	d3.select("#xQ")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","35px")
				       .text(xQ_text+xQ);
				break;
     		}
	};

	var remove_word = function() {
		//d3.select("#word").remove();
		d3.select("#Previous_Result").select("div").remove();
		d3.select("#game_pics").select("img").remove();
		d3.select("#xP").select("div").remove();
		d3.select("#xQ").select("div").remove();
	};


	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');


	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler);

	// Start the test
	next();

};


/****************
* Post-Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('input').each(function(i,val){
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

	};


	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);


		psiTurk.saveData({
			success: function() {
			    	clearInterval(reprompt);
                		currentview = new Debriefing();
			},
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});

	$("#next").click(function () {


	    record_responses();
        psiTurk.saveData({
            success: new Debriefing(),
            error: prompt_resubmit});
	});
};


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new Experiment(); } // what you want to do when you are done with instructions
    );
});
