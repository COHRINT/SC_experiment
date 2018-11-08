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
["instructions/Introduction.html","instructions/SCInstructions.html","instructions/xQInstructions.html","testForXq.html","genericTest.html"],
["instructions/Introduction.html","instructions/SCInstructions.html","instructions/xPInstructions.html","testForXp.html","genericTest.html"],
["instructions/Introduction.html","instructions/SCInstructions.html","instructions/xQInstructions.html","testForXq.html","instructions/xPInstructions.html","testForXp.html","genericTest.html"]]
var Type_value =  _.shuffle([0,1,2,3]);
var condition_type = Type_value[0]+1;
// var condition_type = 1;
console.log("Condition: " + (condition_type));


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


//Debriefing NEED TO MAKE CHANGE
//Debriefing NEED TO MAKE CHANGE
//Debriefing NEED TO MAKE CHANGE
//Debriefing NEED TO MAKE CHANGE
var Debriefing = function(){

		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

		// ====TRY====
		// console.log("FFFFF");
		// console.log(document.getElementById("engagement1").selectedIndex);
		// ====TRY====

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
				success: function() {
				    clearInterval(reprompt);
	                psiTurk.computeBonus('compute_bonus', function(){
				console.log("completeHIt : "+psiTurk.completeHIT());
	                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
	                });


				},
				error: prompt_resubmit
			});
		};

		// Load the questionnaire snippet
		psiTurk.showPage('debriefing.html');
		psiTurk.recordTrialData({'phase':'debriefing', 'status':'begin'});

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
//Debriefing NEED TO MAKE CHANGE
//Debriefing NEED TO MAKE CHANGE
//Debriefing NEED TO MAKE CHANGE
//Debriefing NEED TO MAKE CHANGE


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
	// d3.select('#container-instructions').property('value', condition);
	//<div id="container-instructions">

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

var XqAndXp_Questionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	// ====TRY====
	console.log("XqAndXp_Questionnaire");
	// console.log(document.getElementById("engagement1").selectedIndex);
	// ====TRY====

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
	// d3.select('#container-instructions').property('value', condition);
	//<div id="container-instructions">

	$("#next").click(function () {


	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() {
                	currentview = new Questionnaire(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit});
	});


};


var Xq_Questionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	// ====TRY====
	console.log("Xq_Questionnaire");
	// console.log(document.getElementById("engagement1").selectedIndex);
	// ====TRY====

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
	// d3.select('#container-instructions').property('value', condition);
	//<div id="container-instructions">

	$("#next").click(function () {


	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() {
                	currentview = new Questionnaire(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit});
	});


};


var Xp_Questionnaire = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	// ====TRY====
	console.log("Xp_Questionnaire");
	// console.log(document.getElementById("engagement1").selectedIndex);
	// ====TRY====

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
	// d3.select('#container-instructions').property('value', condition);
	//<div id="container-instructions">

	$("#next").click(function () {


	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() {
                	currentview = new Questionnaire(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit});
	});


};




/********************
* Experiment TEST       *
********************/
var Experiment = function() {

	var collector = 0;
	var wordon, // time word is presented
	    listening = false;

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
    var task_set = [1,2,3].map(String);
    // var task_set = [100,10,13,16,18,22,23,25,29,30,32,39,41,43,44,48,49,50,54,56,57,58,59,60,62,66,6,74,75,76,77,79,7,80,82,84,87,89,8,90,91,93,94,97,98].sort(function(a,b){return a-b;}).map(String);

	var index = 0;
	for(i in takeover)
	{
        if (task_set.includes(i))
        {
            stims.push([]);
            stims[index].push(takeover[i]["xQ"].toPrecision(1));
            stims[index].push(takeover[i]["xP"].toPrecision(1));
            stims[index].push(takeover[i]["image_file"]);
            stims[index].push(takeover[i]["outcome"]);
            index+=1;
        }

	}


	stims = _.shuffle(stims);


	console.log("stims : "+stims);
	var stims_tmp=[];
	var count=0;
	for(i in stims)
	{
		stims_tmp.push(stims[i]);
		count+=1;
	}
	console.log(stims_tmp);
	stims = stims_tmp;

	var next = function() {
		if (stims.length===0) {

			d3.select("#Previous_Result")
				.append("div")
				.style("text-align","center")
				.style("font-size","60px")
				.text("Total Score : "+collector);

			d3.select("#Previous_Result")
				.append("div")
				.style("text-align","center")
				.style("font-size","60px")
				.text("Please Wait While We Load The Final Survey");

			var delayInMilliseconds = 5000;
			setTimeout(function() {
			  d3.select("#Previous_Result").remove("div");
			  finish();
			}, delayInMilliseconds);
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
			console.log("fail : ",color["fail"]);
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

			console.log("Solution is "+answer);

			var delayInMilliseconds = 1500; //1.5 second
			setTimeout(function() {
				remove_word();
				next();
	   		}, delayInMilliseconds);
		}
	};

	var finish = function() {

	    // $(document).ready(function(){
	    $("body").unbind("keydown", response_handler); // Unbind keys

	    // });

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

		//d3.select("#Previous_Result").select("div").remove();
		answer=outcome;

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
		     .attr("width", 500)
		     .attr("height", 500)

		console.log("Condition : " + (condition_type));
		switch(condition_type-1){
     			case 0:
				break;
			case 1:
				d3.select("#xQ")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","35px")
				       .text("Solver Quality : "+xQ);
				 break;
			case 2:
				d3.select("#xP")
					.append("div")
					.style("text-align","center")
					.style("font-size","35px")
					.text("Outcome Assessment : "+xP);
				break;
			case 3:
				d3.select("#xP")
					.append("div")
					.style("text-align","center")
					.style("font-size","35px")
					.text("Outcome Assessment : "+xP);

			 	d3.select("#xQ")
				       .append("div")
				       .style("text-align","center")
				       .style("font-size","35px")
				       .text("Solver Quality : "+xQ);
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
	//Debriefing()
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
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() {
                	currentview = new Debriefing(); // when finished saving compute bonus, the quit
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
    	function() { currentview = new Experiment(); } // what you want to do when you are done with instructions
    );
});
