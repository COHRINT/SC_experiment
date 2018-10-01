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
	"instructions/Type1Instruct1.html",
	"instructions/Type1Instruct2.html",
	"instructions/Type1Instruct3.html",
	"instructions/Type2Instruct1.html",
	"instructions/Type2Instruct2.html",
	"instructions/Type2Instruct3.html",
	"instructions/Type3Instruct1.html",
	"instructions/Type3Instruct2.html",
	"instructions/Type3Instruct3.html",
	"instructions/Type4Instruct1.html",
	"instructions/Type4Instruct2.html",
	"instructions/Type4Instruct3.html",
	"prequestionnaire.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var streamInstructionPages = [["instructions/Type1Instruct1.html","instructions/Type1Instruct2.html","instructions/Type1Instruct3.html"],
["instructions/Type2Instruct1.html","instructions/Type2Instruct2.html","instructions/Type2Instruct3.html"],
["instructions/Type3Instruct1.html","instructions/Type3Instruct2.html","instructions/Type3Instruct3.html"],
["instructions/Type4Instruct1.html","instructions/Type4Instruct2.html","instructions/Type4Instruct3.html"]];
var Type_value =  _.shuffle([0,1,2,3]);
console.log("Type_value : " + (Type_value[0]+1));

var instructionPages = streamInstructionPages[Type_value[0]];


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
                		currentview = new Experiment();
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
                	currentview = new Experiment(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit});
	});


};




/********************
* Experiment TEST       *
********************/
var Experiment = function() {


	var wordon, // time word is presented
	    listening = false;

	//var stims = ["mturk_ok_net_1.svg","mturk_ok_net_2.svg","mturk_bad_net_1.svg","mturk_bad_net_2.svg"];

	var stims = [];
	var takeover;

	// //Need to set async to False.
	//
	$.ajax({
	    type: "GET",
	    url: "json/support.json",
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
	//console.log(takeover.two.xQ);

	var index = 0;
	for(i in takeover)
	{
		stims.push([]);
		stims[index].push(takeover[i]["xQ"].toPrecision(2));
		stims[index].push(takeover[i]["xP"].toPrecision(2));
		stims[index].push(takeover[i]["image_file"]);
		stims[index].push(takeover[i]["outcome"]);

		console.log("xQ : "+takeover[i]["xQ"].toPrecision(2));
		console.log("xP : "+takeover[i]["xP"].toPrecision(2));
		console.log("Images' name : "+takeover[i]["image_file"]);
		console.log("Outcome : "+takeover[i]["outcome"]);
		console.log(index+" : stims : "+stims[index]);
		index+=1;

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
			show_word(stim[0],stim[1],stim[2],stim[3]);
			wordon = new Date().getTime();
			listening = true;
		}
	};

	// d3.select("#Previous_Result")
	//        .append("div")
	//        .style("text-align","center")
	//        .style("font-size","35px")
	//        .text("Previous Result : "+answer);
	//
	// var delayInMilliseconds = 3000; //3 second
	// setTimeout(function() {
	//   //your code to be executed after 1 second
	//   d3.select("#Previous_Result").remove("div");
	// }, delayInMilliseconds);

	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = event.keyCode,
			response;

		switch (keyCode) {
			case 38:
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
			}else if(stim[3]=="fail" && response=="Up"){
				//bool_comp=true;
				scores=-1;
			}else{
				//bool_comp=false;
				scores=-1/4;
			}



			var hit = scores;
			var rt = new Date().getTime() - wordon;

			psiTurk.recordTrialData({'phase':"TEST",
				     'userType':Type_value[0]+1,
                                     'outcome':stim[3],
                                     'image_name':stim[2],
                                     'response':response,
                                     'hit':hit,
                                     'rt':rt}
                                   );

			remove_word();
			var color={"fail":"red","success":"green"};
			console.log("fail : ",color["fail"]);
			d3.select("#Previous_Result")
			       .append("div")
			       .style("text-align","center")
			       .style("font-size","60px")
			       .style("color", color[answer])
			       .text("Solution is " + answer);

			console.log("Solution is "+answer);

			var delayInMilliseconds = 1500; //1.5 second
			setTimeout(function() {
	   		//your code to be executed after 1 second
	   			// d3.select("#Previous_Result").remove("div");
				remove_word();
				next();
	   		}, delayInMilliseconds);
		}
	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};

	var show_word = function(xQ, xP,image,outcome) {

		//d3.select("#Previous_Result").select("div").remove();
		answer=outcome;
		// d3.select("#stim")
		// 	.append("div")
		// 	.attr("id","word")
		// 	//.style("color",color)
		// 	.style("text-align","center")
		// 	.style("font-size","150px")
		// 	.style("font-weight","400")
		// 	.style("margin","20px")
		// 	.text(text);

		// var Decision_function = function(outcome,keyInformation){
		// 	if(keyInformation=="Down"){
		// 		display=
		// 	}
		// }

		console.log('show_word function : '+ image);
		console.log('outcome : '+outcome);
		console.log('scores : '+scores);
		// console.log('Outcome');
		// console.log(outcome);
		// var x = document.getElementById("stim");
		// x.setAttribute("src","{{ server_location }}/static/images/"+text);
		//https://upload.wikimedia.org/wikipedia/commons/4/4f/Start11.png

		d3.select("#game_pics").append("img")
		     .attr("src","../static/images/game_pictures/"+image)
		     .attr("width", 400)
		     .attr("height", 300)

		console.log("Type_value : " + (Type_value[0]+1));
		switch(Type_value[0]){
     			case 0:
				break;
			case 1:
				d3.select("#xQ")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","35px")
				       .text("xQ : "+xQ);
				 break;
			case 2:
				d3.select("#xP")
					.append("div")
					.style("text-align","center")
					.style("font-size","35px")
					.text("xP : "+xP);
				break;
			case 3:
				d3.select("#xP")
					.append("div")
					.style("text-align","center")
					.style("font-size","35px")
					.text("xP : "+xP);

			 	d3.select("#xQ")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","35px")
				       .text("xQ : "+xQ);
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
