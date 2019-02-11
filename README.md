# SC_experiment

## Project Description:
This repository contains the source code necessary to run the `Donut Delivery` (discussed in [this paper][1]) experiment on Amazon Mechanical Turk. The task set and images needed for running the experiment come from [this code][2].

## Software Requirements
- [python 2.7](https://www.python.org/downloads/) : needed python to run the psiturk experiment
- ` $ pip install psiturk` : after having python 2.7, you can simply run the command in your terminal.
- find the desired directory, then paste the following in you terminal: `$ git clone https://github.com/COHRINT/SC_experiment.git` in your terminal
- `$ cd SC_experiment` and then `$ psiturk` : will start the psiturk environment
- A majority of the code in this repository comes straight from [psiturk][3], see that website for information on how the code is organized other things of that nature.

##### The following links may be useful
- [Amazon Mechanical turk](https://www.mturk.com/)
- [psiturk](https://psiturk.org/)

## Key files
* `static`
    * `js` folder contains `task.js` which is the main file that runs the experiment
* `templates` contains all of the html files used in this project.
    * files in the `instructions` folder are used for the instructions and training of participants
    * `images` folder which used to store images the task set (road network) images (these images are produced by [this code][2])
    * `json/v2_support`---file containing information about the network image location, delivery outcome, problem properties, and the FaMSeC metric values (values for "xQ" and "xP" (now called "xO") were implemented in this expeirment)
    * `json/experiment_trial_set`---file containing a list of the tasks that are to be used in the experiment (this is a list of network numbers that are found in `v2_support.json`)

## Contributors
* Brett W. Israelsen, Department of Computer Science, University of Colorado Boulder
* Jetanat Datephanyawat, Department of Physics, University of Colorado Boulder

[1]: https://arxiv.org/abs/1810.06519
[2]: https://github.com/COHRINT/FaMSeC
[3]: https://psiturk.org/quick_start/
