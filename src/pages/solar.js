import '../App.css';
import {React, useState} from 'react';

const Solar = () => {
    const [inputList, setInputList] = useState([{ watts: "", number: "", power: 0 }]);  
    const [totalWatts, setTotalWatts] = useState(0);
    const [volts, setVolts] = useState(0);    
    const [loadCurrent, setLoadCurrent] = useState(0);
    const [hours, setHours] = useState(0);
    const [totalWH, setTotalWH] = useState(0);
    const [batteryCurrent, setBatteryCurrent] = useState(0);
    const [batteryAH, setBatteryAH] = useState(0);
    const [batteryAHVoltage, setBatteryAHVoltage] = useState(0);    
    


    
 
    // handle input change
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const list = [...inputList];
      list[index][name] = value;

      list[index]["power"]  =  list[index]["watts"] * list[index]["number"];
      setInputList(list);

      var tmpTotal = 0;
      inputList.forEach((obj)=> {
         tmpTotal = tmpTotal + obj.power;
      });

      setTotalWatts(tmpTotal);
    };
   
    // handle click event of the Remove button
    const handleRemoveClick = index => {
      const list = [...inputList];
      list.splice(index, 1);
      setInputList(list);
    };
   
    // handle click event of the Add button
    const handleAddClick = () => {
      setInputList([...inputList, { watts: "", number: "", power: 0 }]);
    };

    const handleValtsChange = (e) => {
        const { name, value } = e.target;
        setVolts(value);
    }


    const handleCalculaton = () => {
      setLoadCurrent(  Math.round( (totalWatts / volts) * 100) / 100  );

      setTotalWH (   Math.round(  (((totalWatts * hours)  / volts) * 100) / 100   )  );

      setBatteryCurrent (  Math.round(  ((totalWH * 0.1) * 100) / 100   )   )
    }


    const handleHoursChange = (e) => {
        const { name, value } = e.target;
        setHours(value);      
    }


    const handleAHChange = (e) => {
        const { name, value } = e.target;         
        setBatteryAH (value);
    }

    const handleAHVoltageChange = (e) => {
        const { name, value } = e.target;               
        setBatteryAHVoltage (value);
    }



    function calculateBatteryBackupTime() {
        
        //totalWatts
        //batteryAH   batteryAHVoltage

    }



    return (
      <div className="App">
        <h2>1 - Enter Appliances Watts and Numbers</h2>


        {inputList.map((x, i) => {

          return (

            <div className="box">

                    Watts &nbsp;&nbsp;&nbsp;
                    <input style={{'width':'100px', 'font-size':'20px'}} name="watts" placeholder=""
                        value={x.firstName} onChange={e => handleInputChange(e, i)} />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                    Numbers &nbsp;&nbsp;&nbsp;
                    <input className="ml10" name="number" style={{'width':'100px', 'font-size':'20px'}} 
                        value={x.lastName} onChange={e => handleInputChange(e, i)} />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    {x.power} Watts

                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    { inputList.length !== 1 && 
                    <button className="mr10" onClick={() => handleRemoveClick(i)}>Remove</button>}

                    <br /><br />
                    {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}

            </div>
          );
        })}

        <h3> Total Watts  -  {totalWatts} w </h3> 

        Enter Volts &nbsp;&nbsp;&nbsp;
                    <input className="ml10" style={{'width':'100px', 'font-size':'20px'}} 
                         onChange={e => handleValtsChange(e)} />
        <br /><br />  
        <button className="mr10" onClick={handleCalculaton}>Calculate</button>


        <br /><br />
        <hr />
        <h2>2 - Inverter Selection</h2>
        DC Current Requirement <br />
        P = 1 * V     
        <br />
        I = P / V
        <br />
        {loadCurrent} = {totalWatts} / {volts}        
        <h3>Load Current = {loadCurrent} A</h3>
        

        <br /><br />
        <hr />
        <h2>3 - Battery Selection</h2>
        Total Hours : <input className="ml10" style={{'width':'100px', 'font-size':'20px'}} 
                         onChange={e => handleHoursChange(e)} />  &nbsp;&nbsp;&nbsp;  
                        <button className="mr10" onClick={handleCalculaton}>Calculate</button>
 
        <br /><br />    
        Formula = ( Total Watts * Hours ) / Volts
        <br /><br />
        {totalWH} = ( {totalWatts} * {hours} ) / {volts}
        <br />
        <h3> Battery Selection &nbsp;&nbsp; {totalWH} AH </h3>
        <h3> Battery Charging Current = {totalWH} * 10% = {batteryCurrent} A </h3>
        <br />
        <hr />


        <h2>4 - Solar Plates Current</h2>
        Total Current = Battery Current + loadCurrent
        <br />
        <br /> { batteryCurrent + loadCurrent } A  = {batteryCurrent} A + {loadCurrent} A 
        <br />
        <h3>Total Current Required for this system  &nbsp;&nbsp; { batteryCurrent + loadCurrent } A   </h3>


        <br /><br />
        <hr />
        <h2>5 - Total Solar Plates Wattage</h2>
        Formula = V * I
        <br /><br />
        {volts} * { batteryCurrent + loadCurrent } A 
        <br />

        <h3> { (batteryCurrent + loadCurrent) * volts } W</h3>

        <br /><br /><br /><br /><br />
        <hr />
        <h2>Battery Backup time calculation</h2>

        Total Load comes from top which is &nbsp;&nbsp; {totalWatts} W
        <br /><br />

        Battery in AH &nbsp;&nbsp;&nbsp;&nbsp; <input className="ml10" style={{'width':'100px', 'font-size':'20px'}} 
                         onChange={e => handleAHChange(e)} /> 
        <br /><br />
        Battery Volts &nbsp;&nbsp;&nbsp;&nbsp; <input className="ml10" style={{'width':'100px', 'font-size':'20px'}} 
                         onChange={e => handleAHVoltageChange(e)} /> 
        <br /><br /><br />     

        Backup time = Battery capacity (in amp-hours) / Load current (in amps)        
        <br /><br /><br />
        First, we need to convert the load power from watts to amps:
        <br /><br />
        Load current = Load power / Battery voltage
        <br /><br />
        Battery voltage in this case is {batteryAHVoltage} V, so:
        <br /><br />
        Load current = {totalWatts} W / {batteryAHVoltage} V =  { totalWatts / batteryAHVoltage }  A
        <br /><br /><br />
        Now we can calculate the backup time:
        <br /><br />
        Backup time = {batteryAH} AH / { totalWatts / batteryAHVoltage } A =  {  batteryAH  / (totalWatts / batteryAHVoltage) }  hours

        <br /><br /><br /><br /><br /><br />


      </div>
    );


}


export default Solar;