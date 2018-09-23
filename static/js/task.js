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
	"prequestionnaire.html",
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

/****************
* Pre-Questionnaire *
****************/
var PreQuestionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	// ====TRY====
	// console.log("FFFFF");
	// console.log(document.getElementById("engagement1").selectedIndex);
	// ====TRY====

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
                		currentview = new StroopExperiment();
			},
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiTurk.showPage('prequestionnaire.html');
	psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'begin'});

	$("#next").click(function () {


	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() {
                	currentview = new StroopExperiment(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit});
	});


};




/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {


	var wordon, // time word is presented
	    listening = false;

	var stims = ["pic1.png","mturk_ok_net_1.svg","mturk_ok_net_2.svg","mturk_bad_net_1.svg","mturk_bad_net_2.svg"];

	// var stims = [];
	var takeover;
	var helperXqp=[];

	// //Need to set async to False.
	//
	$.ajax({
	    type: "GET",
	    url: "json/experiment_data_mturk_ok_tprob_solver.json",
	    async: false,
	    dataType: "JSON",
	    success: callback
    	});

	function callback(data){
		takeover= data;
	}
	console.log("takeover : ");
	console.log(takeover);
	console.log("element : ")
	console.log(takeover.two.xQ);
	for(i in takeover)
	{
		console.log(i);
		console.log(i.xQ);
	}
	// for(i=0;i<takeover.length;i++){
	//
	// }

	// for(i=0;i<takeover.length;i++){
	// 	stims.push(takeover[i][xQ]);
	// 	console.log("dfdfd");
	// 	console.log(takeover[i][xQ]);
	// }

	stims = _.shuffle(stims);

	var next = function() {
		if (stims.length===0) {
			finish();
		}
		else {
			stim = stims.shift();
			show_word(stim,"");
			wordon = new Date().getTime();
			listening = true;
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
		// d3.select("#stim")
		// 	.append("div")
		// 	.attr("id","word")
		// 	//.style("color",color)
		// 	.style("text-align","center")
		// 	.style("font-size","150px")
		// 	.style("font-weight","400")
		// 	.style("margin","20px")
		// 	.text(text);
		console.log('show_word function');
		console.log(text);
		// var x = document.getElementById("stim");
		// x.setAttribute("src","{{ server_location }}/static/images/"+text);
		//https://upload.wikimedia.org/wikipedia/commons/4/4f/Start11.png
		 d3.select("#game_pics").append("img")
		     .attr("src","../static/images/"+text)
		     .attr("width", 400)
		     .attr("height", 300)
	};

	var remove_word = function() {
		//d3.select("#word").remove();
		d3.select("#game_pics").select("img").remove();
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

	// ====TRY====
	// console.log("FFFFF");
	// console.log(document.getElementById("engagement1").selectedIndex);
	// ====TRY====

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
    	function() { currentview = new PreQuestionnaire(); } // what you want to do when you are done with instructions
    );
});
