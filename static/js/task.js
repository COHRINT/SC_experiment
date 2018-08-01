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

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {


// 	var print1 = $.get('hello.txt',{},function(content){
//       let lines=content.split('\n');
//       //
//       //  console.log(`"file.txt" contains ${lines.length} lines`)
//       // console.log(`First line : ${lines[0]}`)
// });

	var wordon, // time word is presented
	listening = false;


    //Need to set async to False.
	$.ajax({
	    type: "GET",
	    url: "support.json",
	    async: false,
	    dataType: "JSON",
	    success: callback
    	});

	function callback(data){
		takeover= data;
	}

	for(i=0;i<takeover.question_set.length;i++){
		stims.push(takeover.question_set[i]);
		console.log(takeover.question_set[i]);
	}

	console.log("Hello");
	console.log(stims);
	// $.ajax({
	// 	url: 'support.json',
	// 	dataType: 'json',
	// 	type: 'get',
	// 	cache: false,
	// 	success: function(data){
	// 		for(i=0;i<data.question_set.length;i++){
	// 			console.log(data.question_set[i]);
	// 			stims.push(data.question_set[i]);
	// 		}
	// 	}
	// });

	// var set1 = '{"name":["John","Jim","Jame","Joe"],"age":[21,23,19,22],"address":["CO","NY","TX","CA"]}';
	// var use_set1 =  JSON.parse(set1);
	// document.getElementById("pos1").innerHTML = use_set1.name[1];

	// var stims = [
			// ["Down", "Up", "doNotNeedIt"],
			// ["Up", "Down", "doNotNeedIt"],
			// ["Left", "Right", "doNotNeedIt"],
			// ["Right", "Left", "doNotNeedIt"],
			// ["Down", "Up", "doNotNeedIt"],
			// ["Up", "Down", "doNotNeedIt"],
			// ["Left", "Right", "doNotNeedIt"],
			// ["Right", "Left", "doNotNeedIt"],
			// ["Down", "Up", "doNotNeedIt"]
			// ];

	stims = _.shuffle(stims);

	var next = function() {
		if (stims.length===0) {
			finish();
		}
		else {
			stim = stims.shift();
			show_word( stim[0], stim[1] );
			wordon = new Date().getTime();
			listening = true;
			d3.select("#query").html('Click "Up sign" for Go down, "Down sign" for Go up, "Left sign" for go right, "Right sign" for go left.');
			// var set1 = '{"name":["John","Jim","Jame","Joe"],"age":[21,23,19,22],"address":["CO","NY","TX","CA"]}';
			// var use_set1 =  JSON.parse(set1);
			//document.getElementById("pos1").innerHTML = use_set1.name[1];
			// document.getElementById("pos1").innerHTML = set1;
			// $.getJSON('newfile.json',function(print1){
			// 	document.getElementById("pos1").innerHTML = "print1";
			// });
			// document.getElementById("pos1").innerHTML = print1;
			var set1 = '{"name":["John","Jim","Jame","Joe"],"age":[21,23,19,22],"address":["CO","NY","TX","CA"]}';
			var use_set1 =  JSON.parse(set1);
			document.getElementById("pos1").innerHTML = use_set1.name[1];

//
		}
	};

	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = event.keyCode,
			response;

		switch (keyCode) {
			case 38:
				// "Up sign"
				response="Up";
				break;
			case 40:
				// "Down sign"
				response="Down";
				break;
			case 39:
				// "Right sign"
				response="Right";
				break;
			case 37:
				// "Left "
				response="Left";
				break;
			default:
				response = "";
				break;
		}
		if (response.length>0) {
			listening = false;
			var hit = response == stim[1];
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
                                     'word':stim[0],
                                     'color':stim[1],
                                     'relation':stim[2],
                                     'response':response,
                                     'hit':hit,
                                     'rt':rt}
                                   );
			remove_word();
			next();
		}
	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};

	var show_word = function(text, color) {
		d3.select("#stim")
			.append("div")
			.attr("id","word")
			//.style("color",color)
			.style("text-align","center")
			.style("font-size","150px")
			.style("font-weight","400")
			.style("margin","20px")
			.text(text);
	};

	var remove_word = function() {
		d3.select("#word").remove();
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
* Questionnaire *
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
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });


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
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() {
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });
            },
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
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
