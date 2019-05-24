var five = require("johnny-five");
var board = new five.Board({port : "COM7"});

  /**
   * In order to use the Stepper class, your board must be flashed with
   * either of the following:
   *
   * - AdvancedFirmata https://github.com/soundanalogous/AdvancedFirmata
   * - ConfigurableFirmata https://github.com/firmata/arduino/releases/tag/v2.6.2
   *
   */

	/**
	 * sleep
	 *
	 * @param {int} ms miliseconds
	 * @returns {promise}
	 */
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Step for Degree
     *
     * @description return setps for desire degree/angle
     * @param {int} degree
     * @param {int} step_degree
     * @returns {int}
     *
     */
    function steps_for_degree(degree,step_degree){
       return parseInt(degree/step_degree);
    }


    /**
     *  Main Board Function
     */
board.on("ready", async function() {

    // Our Leds
   //  var green_led = new five.Led(10);
   //  var yellow_led = new five.Led(11);
   //  var red_led = new five.Led(12);

   var green_led = new five.Led(52);
   var yellow_led = new five.Led(53);
   var red_led = new five.Led(51);

     // stepper motor config
     let STEPS = 200;  // motor steps. our motor is 1.8 degree/step.    can be calculated as   360/step_dgree = STEPS
     let step_degree = 1.8;   //  can be calcualted as   360/STEPS = degree per step

     /**
     * CNC shield v3 step and dir pins on arudio Mega 2560
     *   X  : step  2  dir 5
     *   Y  : step  3  dir 6
     *   Z  : step  4  dir 7
     */
     // standalone setup without cnc on breaboard.
    /*    let step_pin = 3;  // step pin
          let direction_pin = 4;  // directional pin
    */

   // CNC shield  step and dir pins
    let step_pin_x = 2;  // X step pin
    let direction_pin_x = 5;  // X directional pin

    // default movement params
    let number_of_revoulations = 10;
    let rotation_angle = 0;   // angle
    let speed = 10;  // rpm
    let clockwise = true;


     // Initalize driver for x motor.
     var stepper_x = new five.Stepper({
        type: five.Stepper.TYPE.DRIVER,
        stepsPerRev: STEPS,
        pins: {
          step: step_pin_x,
          dir: direction_pin_x
        }
      });



      // calculate revolution steps
      let steps_to_move =  STEPS * number_of_revoulations;
      if(rotation_angle != 0){
        steps_to_move = steps_for_degree(rotation_angle,step_degree);
      }


  console.log('Starting motor in 3 sec ... ');
  yellow_led.on();
  await sleep(3000);
  yellow_led.off();

   // green led on
   console.log("Green ON");
   green_led.on();

   // X motor
   stepper_x.step({
     rpm : speed,
     steps: steps_to_move,
     direction: clockwise
  }, async function() {

    console.log("Done moving X motor");
    green_led.off();
    console.log('Red light is ON');
    red_led.on();
    await sleep(3000);
    red_led.off();
    console.log('Finish X');
  });



});
